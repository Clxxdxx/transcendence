<?php
use Illuminate\Support\Facades\Log;

\$app = require __DIR__ . "/bootstrap/app.php";
\$app->make("log")->info("Test ELK log", ["environment" => "docker", "timestamp" => date("Y-m-d H:i:s")]);
echo "Log sent successfully\n";
