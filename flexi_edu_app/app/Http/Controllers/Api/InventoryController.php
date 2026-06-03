<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InventoryItem;
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

        $query = InventoryItem::where('school_id', $schoolId)->orderBy('name');

        if ($cat = $request->query('category')) {
            if ($cat !== 'All Categories') {
                $query->where('category', $cat);
            }
        }

        if ($status = $request->query('status')) {
            if ($status === 'In Stock') {
                $query->where('status', 'optimal');
            } elseif ($status === 'Low Stock Alert') {
                $query->where('status', 'low_stock');
            }
        }

        $items = $query->get();
        $total = InventoryItem::where('school_id', $schoolId)->count();

        return response()->json([
            'total' => $total,
            'items' => $items->map(fn($i) => [
                'id'       => $i->item_code,
                'name'     => $i->name,
                'category' => $i->category,
                'stock'    => $i->stock_quantity,
                'reorder'  => $i->reorder_level,
                'status'   => match($i->status) {
                    'optimal'      => 'Optimal',
                    'low_stock'    => 'Low Stock',
                    'out_of_stock' => 'Out of Stock',
                    default        => 'Unknown',
                },
            ]),
        ]);
    }
}
