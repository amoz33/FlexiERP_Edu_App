<?php

use App\Http\Controllers\Api\AcademicsController;
use App\Http\Controllers\Api\AdmissionController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FeeController;
use App\Http\Controllers\Api\InventoryController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\StudentPortalController;
use App\Http\Controllers\Api\TeacherController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

Route::get('/test', fn() => response()->json(['status' => 'API is working']));

Route::prefix('auth')->group(function () {
    Route::post('login',  [AuthController::class, 'login']);
});

/*
|--------------------------------------------------------------------------
| Protected routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // ── Auth ─────────────────────────────────────────────────────────────────
    Route::prefix('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me',      [AuthController::class, 'me']);
    });

    // ── Admin Dashboard ───────────────────────────────────────────────────────
    Route::prefix('dashboard')->group(function () {
        Route::get('overview',   [DashboardController::class, 'overview']);
        Route::get('activities', [DashboardController::class, 'activities']);
    });

    // ── Students ──────────────────────────────────────────────────────────────
    Route::get('students',            [StudentController::class, 'index']);
    Route::get('students/{student}',  [StudentController::class, 'show']);

    // ── Staff ─────────────────────────────────────────────────────────────────
    Route::get('staff',               [StaffController::class, 'index']);
    Route::get('staff/{staff}',       [StaffController::class, 'show']);

    // ── Academics ─────────────────────────────────────────────────────────────
    Route::prefix('academics')->group(function () {
        Route::get('classes',  [AcademicsController::class, 'getClasses']);
        Route::get('subjects', [AcademicsController::class, 'getSubjects']);
    });

    // ── Admissions ────────────────────────────────────────────────────────────
    Route::get('admissions',   [AdmissionController::class, 'index']);
    Route::post('admissions',  [AdmissionController::class, 'store']);

    // ── Attendance (admin/teacher shared) ────────────────────────────────────
    Route::prefix('attendance')->group(function () {
        Route::get('students', [AttendanceController::class, 'getStudents']);
        Route::post('save',    [AttendanceController::class, 'save']);
    });

    // ── Fees (admin) ─────────────────────────────────────────────────────────
    Route::get('fees/dashboard', [FeeController::class, 'dashboard']);

    // ── Inventory ─────────────────────────────────────────────────────────────
    Route::get('inventory', [InventoryController::class, 'index']);

    // ── Teacher Portal ────────────────────────────────────────────────────────
    Route::prefix('teacher')->group(function () {
        Route::get('dashboard',                              [TeacherController::class, 'dashboard']);
        Route::get('schedule',                               [TeacherController::class, 'schedule']);
        Route::get('groups',                                 [TeacherController::class, 'groups']);
        Route::get('groups/{sectionId}/students',           [TeacherController::class, 'groupStudents']);
        Route::get('assessments',                            [TeacherController::class, 'assessments']);
        Route::get('assessments/{assessment}/grades',        [TeacherController::class, 'assessmentGrades']);
        Route::post('assessments/{assessment}/grades',       [TeacherController::class, 'saveGrades']);
        Route::get('performance',                            [TeacherController::class, 'performance']);
        Route::get('lesson-plans',                           [TeacherController::class, 'lessonPlans']);
        Route::get('messages',                               [TeacherController::class, 'messages']);
        Route::post('messages',                              [TeacherController::class, 'sendMessage']);
    });

    // ── Student / Parent Portal ───────────────────────────────────────────────
    Route::prefix('portal')->group(function () {
        Route::get('dashboard',  [StudentPortalController::class, 'dashboard']);
        Route::get('subjects',   [StudentPortalController::class, 'subjects']);
        Route::get('attendance', [StudentPortalController::class, 'attendance']);
        Route::get('fees',       [StudentPortalController::class, 'fees']);
    });
});
