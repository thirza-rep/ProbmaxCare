<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Welcome / Landing Page
Route::get('/', function () {
    return view('welcome');
})->name('home');

// Guest Routes (Login & Register)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'webLogin']);

    Route::get('/register', [AuthController::class, 'showRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'webRegister']);
});

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'webLogout'])->name('logout');
    Route::get('/logout', [AuthController::class, 'webLogout']); // Also allow GET for redirect

    // Dashboard redirect to Vite SPA
    Route::get('/dashboard', function () {
        $user = auth()->user();
        $user->load('role');
        $token = $user->createToken('probmaxcare_token')->plainTextToken;

        // Redirect ke Vite frontend dengan token
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        return redirect($frontendUrl . '/dashboard?token=' . $token);
    })->name('dashboard');
});
