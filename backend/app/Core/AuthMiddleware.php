<?php

namespace App\Core;

use App\Helpers\TokenHelper;

class AuthMiddleware
{
    public static function handle(callable $next)
    {
        $authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');

        if (!preg_match('/^Bearer\\s+(.+)$/i', $authHeader, $matches)) {
            self::unauthorized('INVALID_TOKEN');
        }

        $token = $matches[1];

        try {
            $payload = TokenHelper::verifyAccessToken($token);
        } catch (\Exception $e) {
            self::unauthorized($e->getMessage());
        }

        Request::setUser([
            'id' => $payload['sub']
        ]);

        return $next();
    }

    private static function unauthorized(string $message)
    {
        Response::json(['message' => $message], 401);
        exit;
    }
}