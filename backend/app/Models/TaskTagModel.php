<?php

namespace App\Models;

use App\Core\Model;

class TaskTagModel extends Model
{
    protected string $table = 'task_tags';
    protected string $alias = 'tt';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findByTaskId(string $taskId): array
    {
        return $this->query()->where('task_id', '=', $taskId)->get();
    }
    public function findByTagId(string $tagId): array
    {
        return $this->query()->where('tag_id', '=', $tagId)->get();
    }
    public function findByTaskAndTag(string $taskId, string $tagId): ?array
    {
        return $this->query()
            ->where('task_id', '=', $taskId)
            ->where('tag_id', '=', $tagId)
            ->first();
    }
    public function findTagsByTaskId(string $taskId): array
    {
        return $this->query()
            ->select(['tag.id', 'tag.name', 'tag.color', 'tag.user_id'])
            ->join('tags tag', 'tag.id = tt.tag_id')
            ->where('tt.task_id', '=', $taskId)
            ->get();
    }
    public function findTasksByTagId(string $tagId): array
    {
        return $this->query()
            ->select(['t.id', 't.title', 't.description', 't.start_time', 't.deadline', 't.notification', 't.priority', 't.status', 't.parent_task_id'])
            ->join('tasks t', 't.id = tt.task_id')
            ->where('tt.tag_id', '=', $tagId)
            ->orderBy('t.priority')
            ->get();
    }
    public function attachTagToTask(string $taskId, string $tagId): bool
    {
        $existing = $this->findByTaskAndTag($taskId, $tagId);
        if ($existing) {
            return true;
        }

        return $this->create([
            'task_id' => $taskId,
            'tag_id' => $tagId
        ]);
    }
    public function detachTagFromTask(string $taskId, string $tagId): bool
    {
        return $this->deleteByTaskAndTag($taskId, $tagId);
    }
    public function deleteByTaskId(string $taskId): bool
    {
        return $this->query()->where('task_id', '=', $taskId)->delete();
    }
    public function deleteByTagId(string $tagId): bool
    {
        return $this->query()->where('tag_id', '=', $tagId)->delete();
    }
    public function deleteByTaskAndTag(string $taskId, string $tagId): bool
    {
        return $this->query()
            ->where('task_id', '=', $taskId)
            ->where('tag_id', '=', $tagId)
            ->delete();
    }
}