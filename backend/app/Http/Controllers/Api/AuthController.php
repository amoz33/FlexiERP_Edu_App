<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    | 1. Look up by email in the users table
    | 2. If role = student, cross-verify the record exists in students table
    | 3. If role = teacher/staff, cross-verify in staff table
    | 4. Issue Sanctum token and return user payload
    */

    public function login(LoginRequest $request): JsonResponse
    {
        $throttleKey = Str::lower($request->input('email')) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            return response()->json([
                'message' => 'Too many login attempts. Please try again in ' . RateLimiter::availableIn($throttleKey) . ' seconds.',
            ], 429);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($throttleKey, 60);
            return response()->json(['message' => 'These credentials do not match our records.'], 401);
        }

        if (! $user->is_active) {
            return response()->json(['message' => 'Your account has been deactivated. Please contact the administrator.'], 403);
        }

        // ── Cross-verify student records ────────────────────────────────
        if ($user->role === 'student') {
            $student = Student::where('user_id', $user->id)->where('status', 'active')->first();
            if (! $student) {
                return response()->json(['message' => 'Student record not found or account is inactive.'], 403);
            }
        }

        // ── Cross-verify staff records ──────────────────────────────────
        if (in_array($user->role, ['teacher'])) {
            $staff = \App\Models\Staff::where('user_id', $user->id)->where('status', 'active')->first();
            if (! $staff) {
                return response()->json(['message' => 'Staff record not found or account is inactive.'], 403);
            }
        }

        RateLimiter::clear($throttleKey);

        // Revoke previous session tokens
        $user->tokens()->where('name', 'web-session')->delete();

        $token = $user->createToken('web-session', ['*'], now()->addDays(7))->plainTextToken;

        $user->update(['last_login_at' => now()]);

        return response()->json([
            'user'  => $this->userPayload($user),
            'token' => $token,
        ], 200);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully.'], 200);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json(['user' => $this->userPayload($request->user())], 200);
    }

    private function userPayload(User $user): array
    {
        $extra = [];

        // Attach student profile if applicable
        if ($user->role === 'student') {
            $student = Student::with('section.academicClass')->where('user_id', $user->id)->first();
            if ($student) {
                $extra['student_id']   = $student->student_id;
                $extra['admission_no'] = $student->admission_no;
                $extra['section']      = $student->section?->full_name;
                $extra['class']        = $student->section?->academicClass?->name;
            }
        }

        // Attach staff profile if applicable
        if (in_array($user->role, ['teacher'])) {
            $staff = \App\Models\Staff::with('department')->where('user_id', $user->id)->first();
            if ($staff) {
                $extra['staff_id']   = $staff->staff_id;
                $extra['role_title'] = $staff->role_title;
                $extra['department'] = $staff->department?->name;
            }
        }

        return [
            'id'         => $user->id,
            'name'       => $user->name,
            'email'      => $user->email,
            'role'       => $user->role,
            'school_id'  => $user->school_id,
            'last_login' => $user->last_login_at?->toIso8601String(),
            ...$extra,
        ];
    }
}
