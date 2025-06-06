<?php

namespace App\Models;

use App\Core\Model;

class UserRefreshToken extends Model
{
    protected string $table = 'user_refresh_tokens';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }

    public function deleteByTokenHash(string $hash): void
    {
        $this->query()->where('refresh_token_hash', '=', $hash)->delete();
    }

    public function findValidToken(string $hash): ?array
    {
        return $this->query()
            ->where('refresh_token_hash', '=', $hash)
            ->where('expires_at', '>', date('Y-m-d H:i:s'))
            ->first();
    }

    public function findByTokenHash(string $hash): ?array
    {
        return $this->query()
            ->where('refresh_token_hash', '=', $hash)
            ->first();
    }

    public function findByDevice(string $device_info): ?array
    {
        return $this->query()
            ->where('device_info', '=', $device_info)
            ->first();
    }
}
