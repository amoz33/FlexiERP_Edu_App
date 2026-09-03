<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    protected function redirectTo(Request $request): ?string
    {
        // For API requests, return null so it throws a 401 JSON response
        // instead of trying to redirect to a 'login' route
        return $request->expectsJson() ? null : null;
    }
}