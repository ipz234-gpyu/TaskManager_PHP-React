<?php

namespace App\Models;

use App\Core\Model;

class TeamInvitationModel extends Model
{
    protected string $table = 'team_invitations';
    protected string $alias = 'ti';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findById(string $id): ?array
    {
        return $this->query()->where('id', '=', $id)->first();
    }
    public function findByTokenHash(string $tokenHash): ?array
    {
        return $this->query()->where('token_hash', '=', $tokenHash)->first();
    }
    public function findByUserAndTeam(string $userId, string $teamId): ?array
    {
        return $this->query()
            ->where('user_id', '=', $userId)
            ->where('team_id', '=', $teamId)
            ->first();
    }
    public function findByUserId(string $userId): array
    {
        return $this->query()->where('user_id', '=', $userId)->get();
    }
    public function findByTeamId(string $teamId): array
    {
        return $this->query()->where('team_id', '=', $teamId)->get();
    }
    public function updateById(string $id, array $data): bool
    {
        return $this->query()->where('id', '=', $id)->update($data);
    }
    public function deleteById(string $id): bool
    {
        return $this->query()->where('id', '=', $id)->delete();
    }
    public function deleteByUserId(string $userId): bool
    {
        return $this->query()->where('user_id', '=', $userId)->delete();
    }
    public function deleteByTeamId(string $teamId): bool
    {
        return $this->query()->where('team_id', '=', $teamId)->delete();
    }
    public function deleteByTokenHash(string $tokenHash): bool
    {
        return $this->query()->where('token_hash', '=', $tokenHash)->delete();
    }
}