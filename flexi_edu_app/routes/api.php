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
use App\Http\Controllers\Api\PayrollController;
use App\Http\Controllers\Api\AssignmentController; 
use App\Http\Controllers\Api\TeacherAssignmentController;
use App\Http\Controllers\Api\AdminAssignmentController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public routes
|--------------------------------------------------------------------------
*/

//Route::get('/test', fn() => response()->json(['status' => 'API is working']));

Route::prefix('auth')->group(function () {
    Route::post('login',  [AuthController::class, 'login']);
});

Route::post('admissions', [AdmissionController::class, 'store']);

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
    Route::get('students/class-sections',   [StudentController::class, 'classSections']); 
    Route::post('students/bulk-import',     [StudentController::class, 'bulkImport']);    
    Route::get('students',                  [StudentController::class, 'index']);
    Route::get('students/{student}',        [StudentController::class, 'show']);
    Route::post('students',                 [StudentController::class, 'store']);
    Route::post('students/{student}',       [StudentController::class, 'update']);         
    Route::delete('students/{student}',     [StudentController::class, 'destroy']);

    // ── Staff ─────────────────────────────────────────────────────────────────
    Route::get('staff',               [StaffController::class, 'index']);
    Route::get('staff/{staff}',       [StaffController::class, 'show']);
    Route::post('staff',         [StaffController::class, 'store']); 
    Route::post('staff/{staff}', [StaffController::class, 'update']);
    Route::delete('staff/{staff}',[StaffController::class, 'destroy']);

    // ── Academics ─────────────────────────────────────────────────────────────
    Route::prefix('academics')->group(function () {
        Route::get('classes',  [AcademicsController::class, 'getClasses']);
        Route::get('subjects', [AcademicsController::class, 'getSubjects']);
    });

    // ── Admissions ────────────────────────────────────────────────────────────
    Route::get('admissions',                       [AdmissionController::class, 'index']);
    Route::get('admissions/{application}',         [AdmissionController::class, 'show']);
    Route::patch('admissions/{application}/status',[AdmissionController::class, 'updateStatus']);
    Route::delete('admissions/{application}',      [AdmissionController::class, 'destroy']);

    // ── Attendance (admin/teacher shared) ────────────────────────────────────
    Route::prefix('attendance')->group(function () {
        Route::get('students', [AttendanceController::class, 'getStudents']);
        Route::post('save',    [AttendanceController::class, 'save']);
    });

    //── Admin Assignment Management ───────────────────────────────────────────────
        Route::prefix('admin')->group(function () {
        Route::get('assignments',                                 [AdminAssignmentController::class, 'index']);
        Route::put('assignments/{assignment}',                    [AdminAssignmentController::class, 'update']);
        Route::delete('assignments/{assignment}',                 [AdminAssignmentController::class, 'destroy']);
        Route::get('assignments/{assignment}/submissions',        [AdminAssignmentController::class, 'submissions']);
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
        Route::get('groups/{sectionId}/students',            [TeacherController::class, 'groupStudents']);
        Route::get('assessments',                            [TeacherController::class, 'assessments']);
        Route::get('assessments/{assessment}/grades',        [TeacherController::class, 'assessmentGrades']);
        Route::post('assessments/{assessment}/grades',       [TeacherController::class, 'saveGrades']);
        Route::get('performance',                            [TeacherController::class, 'performance']);
        Route::get('lesson-plans',                           [TeacherController::class, 'lessonPlans']);
        Route::post('lesson-plans',                          [TeacherController::class, 'storeLessonPlan']); 
        Route::put('lesson-plans/{plan}',                    [TeacherController::class, 'updateLessonPlan']); 
        Route::delete('lesson-plans/{plan}',                 [TeacherController::class, 'deleteLessonPlan']);
        Route::get('messages',                               [TeacherController::class, 'messages']);
        Route::post('messages',                              [TeacherController::class, 'sendMessage']);
        Route::get('assignments/groups',                          [TeacherAssignmentController::class, 'groups']);
        Route::get('assignments',                                 [TeacherAssignmentController::class, 'index']);
        Route::post('assignments',                                [TeacherAssignmentController::class, 'store']);
        Route::put('assignments/{assignment}',                    [TeacherAssignmentController::class, 'update']);
        Route::delete('assignments/{assignment}',                 [TeacherAssignmentController::class, 'destroy']);
        Route::get('assignments/{assignment}/submissions',        [TeacherAssignmentController::class, 'submissions']);
        Route::post('assignments/{assignment}/feedback',          [TeacherAssignmentController::class, 'leaveFeedback']);
    });

    // ── Student / Parent Portal ───────────────────────────────────────────────
    Route::prefix('portal')->group(function () {
        Route::get('children',   [StudentPortalController::class, 'children']);
        Route::get('dashboard',  [StudentPortalController::class, 'dashboard']);
        Route::get('subjects',   [StudentPortalController::class, 'subjects']);  
        Route::get('attendance', [StudentPortalController::class, 'attendance']);
        Route::get('fees',       [StudentPortalController::class, 'fees']);
        Route::get('terms',      [StudentPortalController::class, 'terms']);  
        Route::get('assignments',                            [AssignmentController::class, 'index']);
        Route::post('assignments/{assignment}/submit',       [AssignmentController::class, 'submit']);
        Route::delete('assignments/{assignment}/submission', [AssignmentController::class, 'withdraw']);
    });

    //Staff Payroll
    Route::get('payroll/my-payslips', [PayrollController::class, 'myPayslips']);
});
