<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicClass;
use App\Models\AcademicTerm;
use App\Models\ClassSection;
use App\Models\SchoolSetting;
use App\Models\Student;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SettingsController extends Controller
{
    public function publicSchool(Request $request): JsonResponse
    {
        $schoolId = trim((string) $request->query('school_id', ''));

        $settings = null;
        if ($schoolId !== '') {
            $settings = SchoolSetting::where('school_id', $schoolId)->first();
        }

        if (!$settings) {
            $settings = SchoolSetting::orderByDesc('updated_at')->first();
        }

        if (!$settings) {
            return response()->json([
                'school_id' => 'SCH-001',
            ]);
        }

        $data = $this->mapGeneral($settings);
        $data['school_id'] = (string) $settings->school_id;

        return response()->json($data);
    }

    public function publicClasses(Request $request): JsonResponse
    {
        $schoolId = trim((string) $request->query('school_id', ''));

        $query = AcademicClass::with(['sections' => fn ($q) => $q->orderBy('name')])
            ->orderBy('order')
            ->orderBy('name');

        if ($schoolId !== '') {
            $query->where('school_id', $schoolId);
        } else {
            $latestSchoolId = AcademicClass::query()
                ->orderByDesc('updated_at')
                ->value('school_id');

            if ($latestSchoolId) {
                $query->where('school_id', $latestSchoolId);
            }
        }

        $classes = $query->get()->map(function (AcademicClass $academicClass) {
            return [
                'id' => (string) $academicClass->id,
                'level' => (string) ($academicClass->name ?: $academicClass->level),
                'sections' => $academicClass->sections
                    ->map(fn (ClassSection $section) => trim((string) $section->name))
                    ->filter()
                    ->values()
                    ->all(),
            ];
        })->values();

        return response()->json($classes);
    }

    public function general(Request $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);

        $settings = SchoolSetting::firstOrCreate(
            ['school_id' => $schoolId],
            ['school_id' => $schoolId]
        );

        return response()->json($this->mapGeneral($settings));
    }

    public function saveGeneral(Request $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);
        $payload = $this->validateGeneral($request);

        $settings = SchoolSetting::firstOrCreate(
            ['school_id' => $schoolId],
            ['school_id' => $schoolId]
        );

        if ($request->boolean('remove_logo') && $settings->school_logo_path) {
            Storage::disk('public')->delete($settings->school_logo_path);
            $settings->school_logo_path = null;
        }

        if ($request->boolean('remove_seal') && $settings->school_seal_path) {
            Storage::disk('public')->delete($settings->school_seal_path);
            $settings->school_seal_path = null;
        }

        if ($request->hasFile('school_logo') && $request->file('school_logo')?->isValid()) {
            if ($settings->school_logo_path) {
                Storage::disk('public')->delete($settings->school_logo_path);
            }
            $settings->school_logo_path = $request->file('school_logo')->store("schools/{$schoolId}/branding", 'public');
        }

        if ($request->hasFile('school_seal') && $request->file('school_seal')?->isValid()) {
            if ($settings->school_seal_path) {
                Storage::disk('public')->delete($settings->school_seal_path);
            }
            $settings->school_seal_path = $request->file('school_seal')->store("schools/{$schoolId}/branding", 'public');
        }

        $settings->fill([
            'school_name'  => $payload['school_name'] ?? null,
            'main_address' => $payload['main_address'] ?? null,
            'phone_number' => $payload['phone_number'] ?? null,
            'email'        => $payload['email'] ?? null,
            'website_url'  => $payload['website_url'] ?? null,
        ])->save();

        return response()->json([
            'message' => 'General settings saved.',
            'data'    => $this->mapGeneral($settings->fresh()),
        ]);
    }

    public function resultControls(Request $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);

        $settings = SchoolSetting::firstOrCreate(
            ['school_id' => $schoolId],
            ['school_id' => $schoolId]
        );

        return response()->json($this->mapResultControls($settings));
    }

    public function saveResultControls(Request $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);
        $payload = $request->validate([
            'allow_assessment_entry' => 'required|boolean',
        ]);

        $settings = SchoolSetting::firstOrCreate(
            ['school_id' => $schoolId],
            ['school_id' => $schoolId]
        );

        $settings->fill([
            'allow_assessment_entry' => (bool) $payload['allow_assessment_entry'],
        ])->save();

        return response()->json([
            'message' => 'Result controls saved.',
            'data' => $this->mapResultControls($settings->fresh()),
        ]);
    }

    public function classes(Request $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);

        $classes = AcademicClass::with(['sections' => fn ($q) => $q->where('school_id', $schoolId)->orderBy('name')])
            ->where('school_id', $schoolId)
            ->orderBy('order')
            ->orderBy('name')
            ->get()
            ->map(fn (AcademicClass $academicClass) => $this->mapClass($academicClass));

        return response()->json($classes);
    }

    public function storeClass(Request $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);
        $payload = $this->validateClass($request);

        $academicClass = AcademicClass::create([
            'name'           => $payload['level'],
            'level'          => $payload['level'],
            'order'          => ((int) AcademicClass::where('school_id', $schoolId)->max('order')) + 1,
            'capacity_total' => $payload['capacity_total'] ?? null,
            'lead_faculty'   => $payload['lead_faculty'] ?? null,
            'school_id'      => $schoolId,
        ]);

        $this->syncSections($academicClass, $schoolId, $payload['sections']);

        return response()->json([
            'message' => 'Class created.',
            'data'    => $this->mapClass($academicClass->fresh(['sections'])),
        ], 201);
    }

    public function updateClass(Request $request, AcademicClass $academicClass): JsonResponse
    {
        abort_if($academicClass->school_id !== $this->resolveSchoolId($request), 403);

        $payload = $this->validateClass($request);

        $academicClass->update([
            'name'           => $payload['level'],
            'level'          => $payload['level'],
            'capacity_total' => $payload['capacity_total'] ?? null,
            'lead_faculty'   => $payload['lead_faculty'] ?? null,
        ]);

        $this->syncSections($academicClass, $academicClass->school_id, $payload['sections']);

        return response()->json([
            'message' => 'Class updated.',
            'data'    => $this->mapClass($academicClass->fresh(['sections'])),
        ]);
    }

    public function destroyClass(Request $request, AcademicClass $academicClass): JsonResponse
    {
        abort_if($academicClass->school_id !== $this->resolveSchoolId($request), 403);

        try {
            ClassSection::where('class_id', $academicClass->id)
                ->where('school_id', $academicClass->school_id)
                ->delete();

            $academicClass->delete();
        } catch (QueryException $e) {
            return response()->json([
                'message' => 'This class cannot be deleted because it is already in use.',
            ], 422);
        }

        return response()->json(['message' => 'Class removed.']);
    }

    public function terms(Request $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);

        $terms = AcademicTerm::where('school_id', $schoolId)
            ->orderByRaw("CASE WHEN is_active = 1 THEN 0 ELSE 1 END")
            ->orderByDesc('academic_year')
            ->orderBy('name')
            ->get()
            ->map(fn (AcademicTerm $term) => $this->mapTerm($term));

        return response()->json($terms);
    }

    public function storeTerm(Request $request): JsonResponse
    {
        $schoolId = $this->resolveSchoolId($request);
        $payload = $this->validateTerm($request);
        $status = $this->normalizeStatus($payload['status'] ?? null);

        if ($status === 'Active') {
            AcademicTerm::where('school_id', $schoolId)->update([
                'status'    => 'Closed',
                'is_active' => false,
            ]);
        }

        $term = AcademicTerm::create([
            'name'          => $payload['name'],
            'academic_year' => $payload['year'] ?? null,
            'start_date'    => $payload['start'],
            'end_date'      => $payload['end'],
            'weeks'         => $payload['weeks'],
            'status'        => $status,
            'is_active'     => $status === 'Active',
            'school_id'     => $schoolId,
        ]);

        return response()->json([
            'message' => 'Academic term created.',
            'data'    => $this->mapTerm($term),
        ], 201);
    }

    public function updateTerm(Request $request, AcademicTerm $term): JsonResponse
    {
        abort_if($term->school_id !== $this->resolveSchoolId($request), 403);

        $payload = $this->validateTerm($request);
        $status = $this->normalizeStatus($payload['status'] ?? null);

        if ($status === 'Active') {
            AcademicTerm::where('school_id', $term->school_id)
                ->where('id', '!=', $term->id)
                ->update([
                    'status'    => 'Closed',
                    'is_active' => false,
                ]);
        }

        $term->update([
            'name'          => $payload['name'],
            'academic_year' => $payload['year'] ?? $term->academic_year,
            'start_date'    => $payload['start'],
            'end_date'      => $payload['end'],
            'weeks'         => $payload['weeks'],
            'status'        => $status,
            'is_active'     => $status === 'Active',
        ]);

        return response()->json([
            'message' => 'Academic term updated.',
            'data'    => $this->mapTerm($term->fresh()),
        ]);
    }

    public function destroyTerm(Request $request, AcademicTerm $term): JsonResponse
    {
        abort_if($term->school_id !== $this->resolveSchoolId($request), 403);

        $wasActive = $term->is_active;
        $schoolId = $term->school_id;

        $term->delete();

        if ($wasActive) {
            $next = AcademicTerm::where('school_id', $schoolId)
                ->orderByDesc('academic_year')
                ->orderBy('name')
                ->first();

            if ($next) {
                $next->update([
                    'status'    => 'Active',
                    'is_active' => true,
                ]);
            }
        }

        return response()->json(['message' => 'Academic term removed.']);
    }

    private function validateTerm(Request $request): array
    {
        return $request->validate([
            'name'   => 'required|string|max:255',
            'start'  => 'required|string|max:100',
            'end'    => 'required|string|max:100',
            'weeks'  => 'required|integer|min:1|max:60',
            'status' => 'nullable|string|max:20',
            'year'   => 'nullable|string|max:50',
        ]);
    }

    private function resolveSchoolId(Request $request): string
    {
        $user = $request->user();
        abort_if(!$user, 401);

        $schoolId = (string) ($user->school_id ?? '');
        if (trim($schoolId) !== '') return $schoolId;

        $schoolId = (string) Str::uuid();
        $user->forceFill(['school_id' => $schoolId])->save();
        return $schoolId;
    }

    private function validateGeneral(Request $request): array
    {
        return $request->validate([
            'school_name'  => 'nullable|string|max:255',
            'school_logo'  => 'nullable|image|max:4096',
            'school_seal'  => 'nullable|image|max:4096',
            'remove_logo'  => 'nullable|boolean',
            'remove_seal'  => 'nullable|boolean',
            'main_address' => 'nullable|string|max:500',
            'phone_number' => 'nullable|string|max:50',
            'email'        => 'nullable|email|max:255',
            'website_url'  => 'nullable|string|max:255',
        ]);
    }

    private function validateClass(Request $request): array
    {
        return $request->validate([
            'level'          => 'required|string|max:255',
            'sections'       => 'required|array|min:1',
            'sections.*'     => 'required|string|max:100',
            'capacity_total' => 'nullable|integer|min:0',
            'lead_faculty'   => 'nullable|string|max:255',
        ]);
    }

    private function normalizeStatus(?string $status): string
    {
        return match (strtolower(trim((string) $status))) {
            'active'   => 'Active',
            'closed'   => 'Closed',
            default    => 'Upcoming',
        };
    }

    private function mapTerm(AcademicTerm $term): array
    {
        return [
            'id'     => (string) $term->id,
            'name'   => $term->name,
            'start'  => $term->start_date,
            'end'    => $term->end_date,
            'weeks'  => $term->weeks,
            'status' => $term->is_active ? 'Active' : $term->status,
            'year'   => $term->academic_year,
        ];
    }

    private function mapClass(AcademicClass $academicClass): array
    {
        $sectionIds = $academicClass->sections->pluck('id')->all();
        $sectionNames = $academicClass->sections
            ->map(fn (ClassSection $section) => trim((string) $section->name))
            ->filter()
            ->values();

        return [
            'id'             => (string) $academicClass->id,
            'level'          => $academicClass->name ?: $academicClass->level,
            'sections'       => $sectionNames->implode(', '),
            'capacity_used'  => empty($sectionIds)
                ? 0
                : Student::where('school_id', $academicClass->school_id)
                    ->whereIn('class_section_id', $sectionIds)
                    ->count(),
            'capacity_total' => (int) ($academicClass->capacity_total ?? 0),
            'lead_faculty'   => (string) ($academicClass->lead_faculty ?? ''),
        ];
    }

    private function mapGeneral(SchoolSetting $settings): array
    {
        return [
            'school_name'          => (string) ($settings->school_name ?? ''),
            'school_logo_data_url' => $this->storageFileAsDataUrl($settings->school_logo_path),
            'school_seal_data_url' => $this->storageFileAsDataUrl($settings->school_seal_path),
            'main_address'         => (string) ($settings->main_address ?? ''),
            'phone_number'         => (string) ($settings->phone_number ?? ''),
            'email'                => (string) ($settings->email ?? ''),
            'website_url'          => (string) ($settings->website_url ?? ''),
            'allow_assessment_entry' => $settings->allow_assessment_entry ?? true,
        ];
    }

    private function mapResultControls(SchoolSetting $settings): array
    {
        return [
            'allow_assessment_entry' => $settings->allow_assessment_entry ?? true,
        ];
    }

    private function storageFileAsDataUrl(?string $path): string
    {
        $path = trim((string) $path);
        if ($path === '') {
            return '';
        }

        $disk = Storage::disk('public');
        if (!$disk->exists($path)) {
            return '';
        }

        $mime = $disk->mimeType($path) ?: 'application/octet-stream';
        $contents = $disk->get($path);

        return 'data:' . $mime . ';base64,' . base64_encode($contents);
    }

    private function syncSections(AcademicClass $academicClass, string $schoolId, array $sections): void
    {
        $normalized = collect($sections)
            ->map(fn ($section) => trim((string) $section))
            ->filter()
            ->unique(fn ($section) => strtolower($section))
            ->values();

        $existing = ClassSection::where('class_id', $academicClass->id)
            ->where('school_id', $schoolId)
            ->get()
            ->keyBy(fn (ClassSection $section) => strtolower($section->name));

        foreach ($normalized as $sectionName) {
            $key = strtolower($sectionName);
            $section = $existing->get($key);

            if ($section) {
                $section->update([
                    'name'      => $sectionName,
                    'full_name' => trim(($academicClass->name ?: $academicClass->level) . ' ' . $sectionName),
                ]);
                $existing->forget($key);
                continue;
            }

            ClassSection::create([
                'class_id'   => $academicClass->id,
                'name'       => $sectionName,
                'full_name'  => trim(($academicClass->name ?: $academicClass->level) . ' ' . $sectionName),
                'school_id'  => $schoolId,
            ]);
        }

        foreach ($existing as $section) {
            try {
                $section->delete();
            } catch (QueryException $e) {
                throw new \Illuminate\Validation\ValidationException(
                    validator: validator([], []),
                    response: response()->json([
                        'message' => "Section '{$section->name}' cannot be removed because it is already in use.",
                    ], 422)
                );
            }
        }
    }
}
