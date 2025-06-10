<?php

namespace App\Models;

use App\Core\Model;

class UserTeamModel extends Model
{
    protected string $table = 'user_teams';
    protected string $alias = 'ut';

    public function findByUserAndTeam(string $userId, string $teamId): ?array
    {
        return $this->query()
            ->where('user_id', '=', $userId)
            ->where('team_id', '=', $teamId)
            ->first();
    }

    public function deleteByTeamId(string $teamId): bool
    {
        return $this->delete(['team_id' => $teamId]);
    }

    public function deleteByUserAndTeam(string $userId, string $teamId): bool
    {
        return $this->query()
            ->where('user_id', '=', $userId)
            ->where('team_id', '=', $teamId)
            ->delete();
    }
}