<?php

namespace App\Models;

use App\Core\Model;

class GroupListFromUserModel extends Model
{
    protected string $table = 'group_lists_from_user';
    protected string $alias = 'glu';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findByGroupId(string $groupId): array
    {
        return $this->query()->where('group_id', '=', $groupId)->get();
    }
    public function findByListId(string $listId): array
    {
        return $this->query()->where('list_id', '=', $listId)->get();
    }
    public function findByGroupAndList(string $groupId, string $listId): ?array
    {
        return $this->query()
            ->where('group_id', '=', $groupId)
            ->where('list_id', '=', $listId)
            ->first();
    }
    public function deleteByGroupId(string $groupId): bool
    {
        return $this->query()->where('group_id', '=', $groupId)->delete();
    }
    public function deleteByListId(string $listId): bool
    {
        return $this->query()->where('list_id', '=', $listId)->delete();
    }
    public function deleteByGroupAndList(string $groupId, string $listId): bool
    {
        return $this->query()
            ->where('group_id', '=', $groupId)
            ->where('list_id', '=', $listId)
            ->delete();
    }
}