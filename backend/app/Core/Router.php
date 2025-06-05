<?php

namespace App\Core;

class Router
{
    public function dispatch()
    {
        $uri = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
        $method = $_SERVER['REQUEST_METHOD'];

        if (strpos($uri, 'api/') === 0) {
            $segments = explode('/', $uri);
            App::get()->moduleName = $segments[1] ?? 'home';
            App::get()->actionName = $segments[2] ?? 'index';

            $controllerName = ucfirst($segments[1] ?? 'Home') . 'Controller';
            $methodName = 'action' . ucfirst($segments[2] ?? 'Index');

            $controllerClass = "App\\Controllers\\$controllerName";

            if (class_exists($controllerClass)) {
                $controller = new $controllerClass();
                if (method_exists($controller, $methodName)) {
                    $middlewares = property_exists($controller, 'middlewares') ? $controller->middlewares : [];

                    if (isset($middlewares[$methodName]) && in_array('auth', $middlewares[$methodName])) {
                        return AuthMiddleware::handle(function () use ($controller, $methodName) {
                            return $controller->$methodName();
                        });
                    }

                    return $controller->$methodName();
                }
            }
        }

        http_response_code(404);
        echo json_encode(['error' => 'Not Found']);
    }
}