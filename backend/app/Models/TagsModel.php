<?php

namespace App\Models;

use App\Core\Model;

class TagsModel extends Model
{
    protected string $table = 'tags';
    protected string $alias = 'tag';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findById(string $id): ?array
    {
        return $this->query()->where('id', '=', $id)->first();
    }
    public function findAll(): array
    {
        return $this->query()->get();
    }
    public function findByUserId(string $userId): array
    {
        return $this->query()->where('user_id', '=', $userId)->get();
    }
    public function findByName(string $name, string $userId): ?array
    {
        return $this->query()
            ->where('name', '=', $name)
            ->where('user_id', '=', $userId)
            ->first();
    }
    public function findByTaskId(string $taskId): array
    {
        return $this->query()
            ->select(['tag.id', 'tag.name', 'tag.color', 'tag.user_id'])
            ->join('task_tag tt', 'tt.tag_id = tag.id')
            ->where('tt.task_id', '=', $taskId)
            ->get();
    }
    public function updateById(string $id, array $data): bool
    {
        return $this->query()->where('id', '=', $id)->update($data);
    }
    public function deleteById(string $id): bool
    {
        $taskTagModel = new TaskTagModel();
        $taskTagModel->deleteByTagId($id);

        return $this->query()->where('id', '=', $id)->delete();
    }
    public function deleteByUserId(string $userId): bool
    {
        $tags = $this->findByUserId($userId);
        foreach ($tags as $tag) {
            $this->deleteById($tag['id']);
        }
        return true;
    }
}