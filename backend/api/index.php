<?php

// Temporary Debug Probe
if ($_SERVER['REQUEST_URI'] === '/api/debug-env') {
    header('Content-Type: application/json');
    echo json_encode([
        'uri' => $_SERVER['REQUEST_URI'],
        'script' => $_SERVER['SCRIPT_NAME'],
        'query' => $_SERVER['QUERY_STRING'] ?? '',
        'method' => $_SERVER['REQUEST_METHOD'],
        'server' => $_SERVER
    ]);
    exit;
}

require __DIR__ . '/../public/index.php';
