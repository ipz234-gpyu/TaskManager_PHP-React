<?php

namespace App\Core;

class Request
{
    private static $user;

    public static function user(): ?array
    {
        return self::$user;
    }

    public static function setUser(array $user): void
    {
        self::$user = $user;
    }

    public static function method(): string
    {
        return $_SERVER['REQUEST_METHOD'];
    }

    public static function json(): array
    {
        $data = file_get_contents('php://input');
        return json_decode($data, true) ?? [];
    }

    public static function get(string $key = null)
    {
        return $key ? ($_GET[$key] ?? null) : $_GET;
    }

    public static function post(string $key = null)
    {
        return $key ? ($_POST[$key] ?? null) : $_POST;
    }
}
