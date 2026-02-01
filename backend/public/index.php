<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

/*
|--------------------------------------------------------------------------
| Setup Bootstrap Cache for Vercel Serverless
|--------------------------------------------------------------------------
*/

$bootstrapCache = '/tmp/bootstrap/cache';
if (!is_dir($bootstrapCache)) {
    mkdir($bootstrapCache, 0755, true);
}
if (!is_dir($bootstrapCache . '/cache')) {
    mkdir($bootstrapCache . '/cache', 0755, true);
}
define('LARAVEL_BOOTSTRAP_CACHE', $bootstrapCache);

/*
|--------------------------------------------------------------------------
| Check If The Application Is Under Maintenance
|--------------------------------------------------------------------------
|
| If the application is in maintenance / demo mode via the "down" command
| we will load this file so that any pre-rendered content can be shown
| instead of starting the framework, which could cause an exception.
|
*/

if (file_exists($maintenance = __DIR__ . '/../storage/framework/maintenance.php')) {
    require $maintenance;
}

/*
|--------------------------------------------------------------------------
| Register The Auto Loader
|--------------------------------------------------------------------------
|
| Composer provides a convenient, automatically generated class loader for
| this application. We just need to utilize it! We'll simply require it
| into the script here so we don't need to manually load our classes.
|
*/

require __DIR__ . '/../vendor/autoload.php';

/*
|--------------------------------------------------------------------------
| Run The Application
|--------------------------------------------------------------------------
|
| Once we have the application, we can handle the incoming request using
| the application's HTTP kernel. Then, we will send the response back
| to this client's browser, allowing them to enjoy our application.
|
*/

error_log("PUBLIC INDEX: Starting Laravel bootstrap");

$app = require_once __DIR__ . '/../bootstrap/app.php';

error_log("PUBLIC INDEX: App loaded");

$kernel = $app->make(Kernel::class);

error_log("PUBLIC INDEX: Kernel created");

$request = Request::capture();

// Fix for Vercel/vercel-php: Reset SCRIPT_NAME and PHP_SELF to prevent Symfony
// from stripping the first segment (e.g., /api) from the path info.
if (isset($_SERVER['VERCEL_URL'])) {
    $request->server->set('SCRIPT_NAME', '/index.php');
    $request->server->set('PHP_SELF', '/index.php');
}

error_log("PUBLIC INDEX: Request captured - URI: " . $request->getRequestUri() . " | Path: " . $request->getPathInfo());

$response = $kernel->handle($request);

error_log("PUBLIC INDEX: Response status: " . $response->getStatusCode());

$response->send();

$kernel->terminate($request, $response);
