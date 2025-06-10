<?php

namespace App\Models;

use App\Core\Model;

class UserRefreshTokenModel extends Model
{
    protected string $table = 'user_refresh_tokens';
    protected string $alias = 'urt';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findById(string $id): ?array
    {
        return $this->query()->where('id', '=', $id)->first();
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
        return $this->query()->where('refresh_token_hash', '=', $hash)->first();
    }
    public function findByDevice(string $deviceInfo): ?array
    {
        return $this->query()->where('device_info', '=', $deviceInfo)->first();
    }
    public function findByUserId(string $userId): array
    {
        return $this->query()->where('user_id', '=', $userId)->get();
    }
    public function updateById(string $id, array $data): bool
    {
        return $this->query()->where('id', '=', $id)->update($data);
    }
    public function deleteById(string $id): bool
    {
        return $this->query()->where('id', '=', $id)->delete();
    }
    public function deleteByTokenHash(string $hash): bool
    {
        return $this->query()->where('refresh_token_hash', '=', $hash)->delete();
    }
    public function deleteByUserId(string $userId): bool
    {
        return $this->query()->where('user_id', '=', $userId)->delete();
    }
}
