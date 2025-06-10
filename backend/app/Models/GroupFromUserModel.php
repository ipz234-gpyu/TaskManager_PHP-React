<?php

namespace App\Models;

use App\Core\Model;

class GroupFromUserModel extends Model
{
    protected string $table = 'groups_from_user';
    protected string $alias = 'g';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findById(string $id): ?array
    {
        return $this->query()
            ->select([
                'g.id', 'g.name', 'g.priority', 'g.user_id',
                'COUNT(tl.task_id) as count'
            ])
            ->leftJoin('group_lists_from_user glu', 'glu.group_id = g.id')
            ->leftJoin('lists l', 'l.id = glu.list_id')
            ->leftJoin('task_lists tl', 'tl.list_id = l.id')
            ->where('g.id', '=', $id)
            ->groupBy('g.id', 'g.name', 'g.priority', 'g.user_id')
            ->first();
    }
    public function findAllByUserId(string $userId): array
    {
        return $this->query()
            ->select([
            'g.id', 'g.name', 'g.priority',
            'COUNT(tl.task_id) as count'
        ])
            ->leftJoin('group_lists_from_user glu', 'glu.group_id = g.id')
            ->leftJoin('lists l', 'l.id = glu.list_id')
            ->leftJoin('task_lists tl', 'tl.list_id = l.id')
            ->where('g.user_id', '=', $userId)
            ->groupBy('g.id', 'g.name', 'g.priority')
            ->orderBy('g.priority')
            ->get();
    }
    public function updateById(string $id, array $data): bool
    {
        return $this->query()->where('id', '=', $id)->update($data);
    }
    public function deleteById(string $id): bool
    {
        $groupListModel = new GroupListFromUserModel();
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
    public function deleteByUserId(string $userId): bool
    {
        $groups = $this->query()->select(['id'])->where('user_id', '=', $userId)->get();
        foreach ($groups as $group) {
            $this->deleteById($group['id']);
        }
        return true;
    }
}
