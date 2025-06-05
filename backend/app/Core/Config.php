<?php

namespace App\Core;

class Config
{
    protected static array $config = [];

    public static function load(string $path)
    {
        self::$config = require $path;
    }

    public static function get(string $key, $default = null)
    {
        $keys = explode('.', $key);
        $value = self::$config;

        foreach ($keys as $k) {
            if (!isset($value[$k])) return $default;
            $value = $value[$k];
        }

        return $value;
    }

    public static function loadEnv(string $filePath): void
    {
        if (!file_exists($filePath)) return;

        $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

        foreach ($lines as $line) {
            if (str_starts_with(trim($line), '#')) continue;

            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            $_ENV[$key] = $value;
        }
    }

    public static function getEnv(string $key, $default = null): mixed
    {
        return $_ENV[$key] ?? $default;
    }
}
