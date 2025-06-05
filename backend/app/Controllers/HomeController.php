<?php

namespace App\Controllers;

use App\Core\Controller;

class HomeController extends Controller
{
    public array $middlewares = [
        'actionAdd' => ['auth'],
    ];
    public function actionIndex()
    {
        $this->json([
            'message' => 'Hello from PHP MVC API!',
            'time' => date('Y-m-d H:i:s')
        ]);
    }
    public function actionAdd()
    {
        $this->json([
            'message' => 'Add new element for Home',
            'time' => date('Y-m-d H:i:s')
        ]);
    }
}