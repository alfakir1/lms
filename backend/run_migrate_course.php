<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$status = $kernel->call('migrate', ['--force' => true, '--no-interaction' => true]);
echo "Exit code: " . $status . "\n";
echo "Output: " . \Illuminate\Support\Facades\Artisan::output() . "\n";
