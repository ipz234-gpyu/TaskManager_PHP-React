<?php

namespace App\Helpers;

use App\Core\Config;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class TokenHelper
{
    public const REFRESH_TTL = 60 * 60 * 24 * 30;
    public const ACCESS_TTL = 900;

    public static function generateAccessToken(array $user): string
    {
        $secret = Config::getEnv('ACCESS_SECRET');

        $payload = [
            'sub' => $user['id'],
            'exp' => time() + self::ACCESS_TTL
        ];

        return JWT::encode($payload, $secret, 'HS256');
    }

    public static function verifyAccessToken(string $token): array
    {
        $secret = Config::getEnv('ACCESS_SECRET');

        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
            return (array) $decoded;
        } catch (\Exception $e) {
            throw new \Exception("JWT ERROR: " . $e->getMessage());
            //throw new \Exception('INVALID_TOKEN');
        }
    }

    public static function generateRefreshToken(): string
    {
        return bin2hex(random_bytes(64));
    }

    public static function hashRefreshToken(string $token): string
    {
        return hash('sha256', $token);
    }
}