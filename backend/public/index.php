<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
    header('Access-Control-Allow-Headers: Content-Type, Authorization, enctype');
}

ini_set('upload_max_filesize', '5M');
ini_set('post_max_size', '5M');
ini_set('max_execution_time', 30);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../app/Core/autoload.php';
require_once __DIR__ . '/../vendor/autoload.php';

use App\Core\App;

$app = App::get();
$app->run();