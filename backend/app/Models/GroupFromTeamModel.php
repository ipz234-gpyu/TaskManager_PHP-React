<?php

namespace App\Models;

use App\Core\Model;

class GroupFromTeamModel extends Model
{
    protected string $table = 'groups_from_team';
    protected string $alias = 'g';

    public function findByTeamId(string $teamId): array
    {
        return $this->query()
            ->select([
                'g.id', 'g.name', 'g.priority',
                'COUNT(tl.task_id) as count'
            ])
            ->leftJoin('group_lists_from_team glt', 'glt.group_id = g.id')
            ->leftJoin('lists l', 'l.id = glt.list_id')
            ->leftJoin('task_lists tl', 'tl.list_id = l.id')
            ->where('g.team_id', '=', $teamId)
            ->groupBy('g.id', 'g.name', 'g.priority')
            ->orderBy('g.priority')
            ->get();
    }

    public function findWithCount(string $id): ?array
    {
        return $this->query()
            ->select([
                'g.id', 'g.name', 'g.priority', 'g.team_id',
                'COUNT(tl.task_id) as count'
            ])
            ->leftJoin('group_lists_from_team glt', 'glt.group_id = g.id')
            ->leftJoin('lists l', 'l.id = glt.list_id')
            ->leftJoin('task_lists tl', 'tl.list_id = l.id')
            ->where('g.id', '=', $id)
            ->groupBy('g.id', 'g.name', 'g.priority', 'g.team_id')
            ->first();
    }

    public function deleteByTeamId(string $teamId): bool
    {
        return $this->delete(['team_id' => $teamId]);
    }
}