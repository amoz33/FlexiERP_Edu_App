<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryCategory;
use App\Models\InventoryItem;
use App\Models\InventoryTransaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | GET /api/inventory
    |--------------------------------------------------------------------------
    | Supports: category, status, page
    | Frontend: inventoryApi.list({ category, status })
    */
    public function index(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $items = InventoryItem::where('school_id', $schoolId)
            ->orderBy('name')
            ->get();
        $total = InventoryItem::where('school_id', $schoolId)->count();

        return response()->json([
            'total' => $total,
            'items' => $items->map(fn(InventoryItem $item) => $this->mapItem($item)),
        ]);
    }

    public function categories(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;

        $stored = InventoryCategory::where('school_id', $schoolId)
            ->orderBy('name')
            ->pluck('name');

        $fromItems = InventoryItem::where('school_id', $schoolId)
            ->whereNotNull('category')
            ->where('category', '!=', '')
            ->orderBy('category')
            ->pluck('category');

        $categories = $stored
            ->merge($fromItems)
            ->map(fn ($name) => trim((string) $name))
            ->filter()
            ->unique(fn ($name) => strtolower($name))
            ->values();

        return response()->json($categories);
    }

    public function history(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $perPage = min((int) $request->query('per_page', 20), 100);

        $query = InventoryTransaction::where('school_id', $schoolId)
            ->orderByDesc('action_date')
            ->orderByDesc('id');

        if ($itemId = trim((string) $request->query('item_id', ''))) {
            $query->where('inventory_item_id', $itemId);
        }

        if ($actionType = trim((string) $request->query('action_type', ''))) {
            $query->where('action_type', $actionType);
        }

        $transactions = $query->paginate($perPage);

        return response()->json([
            'data' => $transactions->getCollection()->map(fn (InventoryTransaction $transaction) => $this->mapTransaction($transaction))->values(),
            'total' => $transactions->total(),
            'current_page' => $transactions->currentPage(),
            'last_page' => $transactions->lastPage(),
            'per_page' => $transactions->perPage(),
        ]);
    }

    public function storeCategory(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $payload = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $name = trim((string) $payload['name']);

        $existing = InventoryCategory::where('school_id', $schoolId)
            ->get()
            ->first(fn (InventoryCategory $category) => strtolower($category->name) === strtolower($name));

        if ($existing) {
            return response()->json([
                'message' => 'Category already exists.',
                'data' => $existing,
            ], 200);
        }

        $category = InventoryCategory::create([
            'name' => $name,
            'school_id' => $schoolId,
        ]);

        return response()->json([
            'message' => 'Category created.',
            'data' => $category,
        ], 201);
    }

    public function addStock(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $payload = $request->validate([
            'item_id' => 'nullable|integer',
            'name' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:255',
            'reorder_level' => 'nullable|integer|min:0',
            'quantity' => 'required|integer|min:1',
            'received_at' => 'nullable|date',
        ]);

        $item = null;
        if (!empty($payload['item_id'])) {
            $item = InventoryItem::findOrFail($payload['item_id']);
            abort_if($item->school_id !== $schoolId, 403);
        } else {
            $name = trim((string) ($payload['name'] ?? ''));
            $category = trim((string) ($payload['category'] ?? ''));
            $reorderLevel = (int) ($payload['reorder_level'] ?? 0);

            if ($name === '' || $category === '') {
                return response()->json([
                    'message' => 'Name and category are required for a new inventory item.',
                ], 422);
            }

            $this->ensureCategoryExists($schoolId, $category);

            $item = InventoryItem::create([
                'item_code' => $this->generateItemCode(),
                'name' => $name,
                'category' => $category,
                'stock_quantity' => 0,
                'reorder_level' => $reorderLevel,
                'status' => 'out_of_stock',
                'school_id' => $schoolId,
            ]);
        }

        $balanceBefore = (int) $item->stock_quantity;
        $item->stock_quantity = (int) $item->stock_quantity + (int) $payload['quantity'];
        $item->status = $this->resolveStatus($item->stock_quantity, (int) $item->reorder_level);
        $item->save();
        $this->recordTransaction(
            request: $request,
            item: $item,
            actionType: 'stock_in',
            quantity: (int) $payload['quantity'],
            balanceBefore: $balanceBefore,
            balanceAfter: (int) $item->stock_quantity,
            recipientType: null,
            recipientName: null,
            reference: null,
            note: null,
            actionDate: (string) ($payload['received_at'] ?? ''),
        );

        return response()->json([
            'message' => 'Stock added.',
            'data' => $this->mapItem($item->fresh()),
        ]);
    }

    public function issueStock(Request $request): JsonResponse
    {
        $schoolId = $request->user()->school_id;
        $payload = $request->validate([
            'item_id' => 'required|integer',
            'quantity' => 'required|integer|min:1',
            'issued_to_type' => 'required|string|max:20',
            'issued_to_name' => 'required|string|max:255',
            'issue_date' => 'nullable|date',
            'reference' => 'nullable|string|max:255',
            'note' => 'nullable|string|max:1000',
        ]);

        $item = InventoryItem::findOrFail($payload['item_id']);
        abort_if($item->school_id !== $schoolId, 403);

        $quantity = (int) $payload['quantity'];
        if ($quantity > (int) $item->stock_quantity) {
            return response()->json([
                'message' => 'Insufficient stock for this issue request.',
            ], 422);
        }

        $balanceBefore = (int) $item->stock_quantity;
        $item->stock_quantity = (int) $item->stock_quantity - $quantity;
        $item->status = $this->resolveStatus($item->stock_quantity, (int) $item->reorder_level);
        $item->save();
        $this->recordTransaction(
            request: $request,
            item: $item,
            actionType: 'stock_out',
            quantity: $quantity,
            balanceBefore: $balanceBefore,
            balanceAfter: (int) $item->stock_quantity,
            recipientType: (string) $payload['issued_to_type'],
            recipientName: (string) $payload['issued_to_name'],
            reference: (string) ($payload['reference'] ?? ''),
            note: (string) ($payload['note'] ?? ''),
            actionDate: (string) ($payload['issue_date'] ?? ''),
        );

        return response()->json([
            'message' => 'Stock issued.',
            'data' => $this->mapItem($item->fresh()),
        ]);
    }

    private function ensureCategoryExists(string $schoolId, string $name): void
    {
        $existing = InventoryCategory::where('school_id', $schoolId)
            ->get()
            ->first(fn (InventoryCategory $category) => strtolower($category->name) === strtolower($name));

        if ($existing) {
            return;
        }

        InventoryCategory::create([
            'name' => $name,
            'school_id' => $schoolId,
        ]);
    }

    private function generateItemCode(): string
    {
        do {
            $code = 'INV-' . random_int(1000, 9999);
        } while (InventoryItem::where('item_code', $code)->exists());

        return $code;
    }

    private function resolveStatus(int $stockQuantity, int $reorderLevel): string
    {
        if ($stockQuantity <= 0) {
            return 'out_of_stock';
        }

        if ($stockQuantity <= $reorderLevel) {
            return 'low_stock';
        }

        return 'optimal';
    }

    private function mapItem(InventoryItem $item): array
    {
        return [
            'db_id' => $item->id,
            'id' => $item->item_code,
            'name' => $item->name,
            'category' => $item->category,
            'stock' => (int) $item->stock_quantity,
            'reorder' => (int) $item->reorder_level,
            'status' => match($item->status) {
                'optimal' => 'Optimal',
                'low_stock' => 'Low Stock',
                'out_of_stock' => 'Out of Stock',
                default => 'Unknown',
            },
        ];
    }

    private function mapTransaction(InventoryTransaction $transaction): array
    {
        return [
            'id' => $transaction->id,
            'item_id' => $transaction->inventory_item_id,
            'item_code' => $transaction->item_code,
            'item_name' => $transaction->item_name,
            'category' => $transaction->category,
            'action_type' => $transaction->action_type,
            'action_label' => $transaction->action_type === 'stock_in' ? 'Stock In' : 'Stock Out',
            'quantity' => (int) $transaction->quantity,
            'balance_before' => (int) $transaction->balance_before,
            'balance_after' => (int) $transaction->balance_after,
            'recipient_type' => $transaction->recipient_type,
            'recipient_name' => $transaction->recipient_name,
            'reference' => $transaction->reference,
            'note' => $transaction->note,
            'action_date' => optional($transaction->action_date)->format('Y-m-d'),
            'actor_name' => $transaction->actor_name,
            'created_at' => optional($transaction->created_at)->toISOString(),
        ];
    }

    private function recordTransaction(
        Request $request,
        InventoryItem $item,
        string $actionType,
        int $quantity,
        int $balanceBefore,
        int $balanceAfter,
        ?string $recipientType,
        ?string $recipientName,
        ?string $reference,
        ?string $note,
        string $actionDate,
    ): void {
        $user = $request->user();

        InventoryTransaction::create([
            'inventory_item_id' => $item->id,
            'action_type' => $actionType,
            'quantity' => $quantity,
            'balance_before' => $balanceBefore,
            'balance_after' => $balanceAfter,
            'item_code' => $item->item_code,
            'item_name' => $item->name,
            'category' => $item->category,
            'recipient_type' => $recipientType ?: null,
            'recipient_name' => $recipientName ?: null,
            'reference' => $reference ?: null,
            'note' => $note ?: null,
            'action_date' => trim($actionDate) !== '' ? $actionDate : now()->toDateString(),
            'actor_user_id' => $user?->id,
            'actor_name' => trim((string) (($user?->first_name ?? '') . ' ' . ($user?->last_name ?? ''))) ?: ($user?->name ?? null),
            'school_id' => $item->school_id,
        ]);
    }
}
