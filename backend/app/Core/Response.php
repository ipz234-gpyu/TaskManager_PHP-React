<?php

namespace App\Core;

class Response
{
    public static function json($data, int $status = 200)
    {
        http_response_code($status);
        header('Content-Type: application/json');

        if ($status >= 200 && $status < 300) {
            ob_start();
        }

        echo json_encode([
            'status' => $status < 400 ? 'success' : 'error',
            'data' => $data
        ]);
    }
}
