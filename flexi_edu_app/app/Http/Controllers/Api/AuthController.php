<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Login
    |--------------------------------------------------------------------------
    | Validates credentials, checks account status, issues a Sanctum token,
    | and returns a sanitised user payload the frontend can store in state.
    */

    public function login(LoginRequest $request): JsonResponse
    {
        $throttleKey = Str::lower($request->input('email')) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            return response()->json([
                'message' => 'Too many login attempts. Please try again in ' . $seconds . ' seconds.',
            ], 429);
        }

        $user = User::where('email', $request->email)->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            RateLimiter::hit($throttleKey, 60);

            return response()->json([
                'message' => 'These credentials do not match our records.',
            ], 401);
        }

        if (! $user->is_active) {
            return response()->json([
                'message' => 'Your account has been deactivated. Please contact your administrator.',
            ], 403);
        }

        RateLimiter::clear($throttleKey);

        // Revoke all previous tokens for this device/session before issuing a new one
        $user->tokens()->where('name', 'web-session')->delete();

        $token = $user->createToken('web-session', ['*'], now()->addDays(7))->plainTextToken;

        $user->update(['last_login_at' => now()]);

        return response()->json([
            'user'  => $this->userPayload($user),
            'token' => $token,
        ], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | Logout
    |--------------------------------------------------------------------------
    | Revokes only the token that was used for this request.
    */

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully.'], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | Me – authenticated user profile
    |--------------------------------------------------------------------------
    */

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $this->userPayload($request->user()),
        ], 200);
    }

    /*
    |--------------------------------------------------------------------------
    | Internal helpers
    |--------------------------------------------------------------------------
    */

    private function userPayload(User $user): array
    {
        return [
            'id'           => $user->id,
            'name'         => $user->name,
            'email'        => $user->email,
            'role'         => $user->role,
            'school_id'    => $user->school_id,
            'last_login'   => $user->last_login_at?->toIso8601String(),
        ];
    }
}
