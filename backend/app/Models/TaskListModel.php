<?php

namespace App\Models;

use App\Core\Model;

class TaskListModel extends Model
{
    protected string $table = 'task_lists';
    protected string $alias = 'tl';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findByListId(string $listId): array
    {
        return $this->query()->where('list_id', '=', $listId)->get();
    }
    public function findByTaskId(string $taskId): array
    {
        return $this->query()->where('task_id', '=', $taskId)->get();
    }
    public function findByListAndTask(string $listId, string $taskId): ?array
    {
        return $this->query()
            ->where('list_id', '=', $listId)
            ->where('task_id', '=', $taskId)
            ->first();
    }
    public function findListsByTaskId(string $taskId): array
    {
        return $this->query()
            ->select(['l.id', 'l.name', 'l.priority'])
            ->join('lists l', 'l.id = tl.list_id')
            ->where('tl.task_id', '=', $taskId)
            ->get();
    }
    public function findTasksByListId(string $listId): array
    {
        return $this->query()
            ->select(['t.id', 't.title', 't.description', 't.start_time', 't.deadline', 't.notification', 't.priority', 't.status', 't.parent_task_id'])
            ->join('tasks t', 't.id = tl.task_id')
            ->where('tl.list_id', '=', $listId)
            ->orderBy('t.priority')
            ->get();
    }
    public function deleteByListId(string $listId): bool
    {
        return $this->query()->where('list_id', '=', $listId)->delete();
    }
    public function deleteByTaskId(string $taskId): bool
    {
        return $this->query()->where('task_id', '=', $taskId)->delete();
    }
    public function deleteByListAndTask(string $listId, string $taskId): bool
    {
        return $this->query()
            ->where('list_id', '=', $listId)
            ->where('task_id', '=', $taskId)
            ->delete();
    }
}