<?php

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
