<?php

namespace App\Core;
use App\Core\Response;

class Controller
{
    protected function json($data = "", int $status = 200)
    {
        Response::json($data, $status);
    }
}