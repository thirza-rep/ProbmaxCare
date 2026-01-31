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

// CRITICAL: Load Composer autoloader FIRST!
require __DIR__ . '/../vendor/autoload.php';

// DEBUG: Log that we got here
error_log("API INDEX: Autoloader loaded");

try {
    // Bootstrap Laravel manually
    $app = require_once __DIR__ . '/../bootstrap/app.php';
    error_log("API INDEX: App bootstrapped");

    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    error_log("API INDEX: Kernel created");

    // MANUAL SIMPLE ROUTE - Bypass RouteServiceProvider
    $request = Illuminate\Http\Request::capture();
    error_log("API INDEX: Request captured - Path: " . $request->getPathInfo());

    // Check if this is API route
    if (str_starts_with($request->getPathInfo(), '/api/')) {
        error_log("API INDEX: Matched API route");
        header('Content-Type: application/json');

        if ($request->getPathInfo() === '/api/ping') {
            error_log("API INDEX: Returning ping response");
            echo json_encode([
                'message' => 'PONG from manual Laravel route!',
                'laravel_version' => app()->version(),
                'environment' => app()->environment()
            ]);
            exit;
        }

        if ($request->getPathInfo() === '/api/test-db') {
            error_log("API INDEX: Testing database");
            try {
                DB::connection()->getPdo();
                echo json_encode([
                    'message' => 'Database Connected!',
                    'database' => DB::connection()->getDatabaseName()
                ]);
            } catch (\Exception $e) {
                http_response_code(500);
                echo json_encode([
                    'message' => 'Database Error',
                    'error' => $e->getMessage()
                ]);
            }
            exit;
        }
    }

    error_log("API INDEX: No manual route matched, using Laravel routing");
    // For other routes, use normal Laravel
    $response = $kernel->handle($request);
    $response->send();
    $kernel->terminate($request, $response);

} catch (\Throwable $e) {
    error_log("API INDEX ERROR: " . $e->getMessage());
    error_log("API INDEX ERROR TRACE: " . $e->getTraceAsString());
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'error' => 'Fatal Error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
    exit;
}
