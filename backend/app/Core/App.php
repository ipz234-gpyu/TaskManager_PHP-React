<?php

namespace App\Core;

class App
{
    public string $moduleName;
    public string $actionName;
    public Database $db;
    protected Router $router;
    private static $instance;

    private function __construct()
    {
        Config::load(__DIR__ . '/../../config/config.php');
        Config::loadEnv(__DIR__ . '/../../.env');

        $this->router = new Router();
        $this->db = Database::get();
    }

    public static function get()
    {
        if (empty(self::$instance))
            self::$instance = new App();
        return self::$instance;
    }

    public function run()
    {
        $this->router->dispatch();
    }
}
