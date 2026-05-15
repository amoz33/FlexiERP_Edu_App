<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Laravel API is working!',
        'app' => 'FlexiERP Edu'
    ]);
});