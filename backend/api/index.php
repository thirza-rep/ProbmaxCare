<?php

// Setup bootstrap cache
$bootstrapCache = '/tmp/bootstrap/cache';
if (!is_dir($bootstrapCache)) {
    mkdir($bootstrapCache, 0755, true);
}
if (!is_dir($bootstrapCache . '/cache')) {
    mkdir($bootstrapCache . '/cache', 0755, true);
}
define('LARAVEL_BOOTSTRAP_CACHE', $bootstrapCache);

// Bootstrap Laravel manually
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// MANUAL SIMPLE ROUTE - Bypass RouteServiceProvider
$request = Illuminate\Http\Request::capture();

// Check if this is API route
if (str_starts_with($request->getPathInfo(), '/api/')) {
    header('Content-Type: application/json');

    if ($request->getPathInfo() === '/api/ping') {
        echo json_encode([
            'message' => 'PONG from manual Laravel route!',
            'laravel_version' => app()->version(),
            'environment' => app()->environment()
        ]);
        exit;
    }

    if ($request->getPathInfo() === '/api/test-db') {
        try {
            DB::connection()->getPdo();
            echo json_encode([
                'message' => 'Database Connected!',
                'database' => DB::connection()->getDatabaseName()
            ]);
        } catch (\Exception $e) {
            echo json_encode([
                'message' => 'Database Error',
                'error' => $e->getMessage()
            ], 500);
        }
        exit;
    }
}

// For other routes, use normal Laravel
$response = $kernel->handle($request);
$response->send();
$kernel->terminate($request, $response);
