<?php

// ULTRA SIMPLE TEST - Does Vercel execute PHP at all?
header('Content-Type: application/json');
echo json_encode([
    'status' => 'PHP IS ALIVE!',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'request_uri' => $_SERVER['REQUEST_URI'] ?? 'unknown',
    'script_name' => $_SERVER['SCRIPT_NAME'] ?? 'unknown'
]);
exit;

// Setup writable bootstrap cache for Vercel serverless
$bootstrapCache = '/tmp/bootstrap/cache';
if (!is_dir($bootstrapCache)) {
    mkdir($bootstrapCache, 0755, true);
}
// Create cache subdirectory that Laravel expects
if (!is_dir($bootstrapCache . '/cache')) {
    mkdir($bootstrapCache . '/cache', 0755, true);
}

// Define bootstrap cache path for Laravel
define('LARAVEL_BOOTSTRAP_CACHE', $bootstrapCache);

require __DIR__ . '/../public/index.php';
