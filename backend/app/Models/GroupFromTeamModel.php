<?php

namespace App\Models;

use App\Core\Model;

class GroupFromTeamModel extends Model
{
    protected string $table = 'groups_from_team';
    protected string $alias = 'g';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findById(string $id): ?array
    {
        return $this->query()->where('id', '=', $id)->first();
    }
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
    public function updateById(string $id, array $data): bool
    {
        return $this->query()->where('id', '=', $id)->update($data);
    }
    public function deleteById(string $id): bool
    {
        $groupListModel = new GroupListFromTeamModel();
        $groupLists = $groupListModel->findByGroupId($id);
        $listIds = array_column($groupLists, 'list_id');

        if (!empty($listIds)) {
            $listModel = new ListModel();
            foreach ($listIds as $listId) {
                $listModel->deleteById($listId);
            }
        }

        $groupListModel->deleteByGroupId($id);

        return $this->query()->where('id', '=', $id)->delete();
    }
    public function deleteByTeamId(string $teamId): bool
    {
        $groups = $this->query()->select(['id'])->where('team_id', '=', $teamId)->get();
        foreach ($groups as $group) {
            $this->deleteById($group['id']);
        }
        return true;
    }
}