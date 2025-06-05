<?php

namespace App\Models;

use App\Core\Model;

class UserModel extends Model
{
    protected string $table = 'users';

    public function findByEmail(string $email): ?array
    {
        return $this->query()->where('email', '=', $email)->first();
    }

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
}