<?php

namespace App\Helpers;

class UrlHelper
{
    public static function getBaseUrl(): string
    {
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        return $protocol . '://' . $host;
    }

    public static function asset(string $path): string
    {
        if (filter_var($path, FILTER_VALIDATE_URL)) {
            return $path;
        }

        if (!str_starts_with($path, '/')) {
            $path = '/' . $path;
        }

        return self::getBaseUrl() . $path;
    }

    public static function formatUserAvatar(?string $avatar): ?string
    {
        if (!$avatar) {
            return null;
        }

        $filePath = __DIR__ . '/../../public' . $avatar;
        if (!file_exists($filePath)) {
            error_log("Avatar file not found: " . $filePath);
            return null;
        }

        return self::asset($avatar);
    }
}