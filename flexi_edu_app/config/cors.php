<?php

/*
|--------------------------------------------------------------------------
| config/cors.php  –  place this in your Laravel config/ directory
|--------------------------------------------------------------------------
|
| This file controls which origins, methods, and headers the API will
| accept via CORS preflight. Update `allowed_origins` to match the exact
| URL(s) where your Next.js app is hosted.
|
*/

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    /*
    | Development: use localhost.
    | Production: replace with your actual frontend domain, e.g.
    |   'https://app.flexierp.com'
    | Never use '*' in production.
    */
    'allowed_origins' => explode(',', env('FRONTEND_URLS', 'http://localhost:3000')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
    | Must be true for Sanctum cookie-based auth.
    | Also ensures the Authorization header is forwarded correctly
    | when using token-based auth.
    */
    'supports_credentials' => true,

];
