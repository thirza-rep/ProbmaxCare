<?php

use Illuminate\Support\Facades\Route;

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

Route::get('/', function () {
    return response()->json(['message' => 'ProbmaxCare Backend is Running']);
});

Route::get('/hello', function () {
    return response()->json([
        'message' => 'Hello from Laravel!',
        'routes_loaded' => true,
        'php_version' => phpversion()
    ]);
});
