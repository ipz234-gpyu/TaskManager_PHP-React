<?php


namespace App\Models;

use App\Core\Model;

class TeamModel extends Model
{
    protected string $table = 'teams';
    protected string $alias = 't';

    public function findAllByUserId(string $userId): array
    {
        return $this->query()
            ->select(['t.id', 't.name', 't.created_by', 'ut.id AS user_team_id'])
            ->alias('t')
            ->leftJoin('user_teams ut', 'ut.team_id = t.id')
            ->where('ut.user_id', '=', $userId)
            ->get();
    }
}