<?php

namespace App\Models;

use App\Core\Model;

class TaskModel extends Model
{
    protected string $table = 'tasks';
    protected string $alias = 't';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findById(string $id): ?array
    {
        return $this->query()
            ->select([
                't.id', 't.title', 't.description', 't.start_time',
                't.deadline', 't.notification', 't.priority', 't.status', 't.parent_task_id'
            ])
            ->where('t.id', '=', $id)
            ->first();
    }
    public function findAll(): array
    {
        return $this->query()->get();
    }
    public function findByListId(string $listId): array
    {
        return $this->query()
            ->select([
                't.id', 't.title', 't.description', 't.start_time',
                't.deadline', 't.notification', 't.priority', 't.status', 't.parent_task_id'
            ])
            ->join('task_lists tl', 'tl.task_id = t.id')
            ->where('tl.list_id', '=', $listId)
            ->orderBy('t.priority')
            ->get();
    }
    public function findByParentId(string $parentId): array
    {
        return $this->query()->where('parent_task_id', '=', $parentId)->get();
    }
    public function updateById(string $id, array $data): bool
    {
        if (empty($data)) {
            return false;
        }
        return $this->query()->where('id', '=', $id)->update($data);
    }
    public function reorderInList(string $listId, array $taskIds): bool
    {
        foreach ($taskIds as $index => $taskId) {
            $this->query()
                ->join('task_lists tl', 'tl.task_id = t.id')
                ->where('tl.list_id', '=', $listId)
                ->where('t.id', '=', $taskId)
                ->update(['priority' => $index + 1]);
        }
        return true;
    }
    public function attachToList(string $taskId, string $listId): bool
    {
        $taskListModel = new TaskListModel();
        return $taskListModel->create([
            'task_id' => $taskId,
            'list_id' => $listId,
        ]);
    }
    public function moveToList(string $taskId, string $sourceListId, string $destListId): bool
    {
        $taskListModel = new TaskListModel();

        $taskListModel->query()
            ->where('task_id', '=', $taskId)
            ->where('list_id', '=', $sourceListId)
            ->delete();

        return $taskListModel->create([
            'task_id' => $taskId,
            'list_id' => $destListId,
        ]);
    }
    public function deleteById(string $id): bool
    {
        $childTasks = $this->findByParentId($id);
        foreach ($childTasks as $childTask) {
            $this->deleteById($childTask['id']);
        }

        $taskAssignmentModel = new TaskAssignmentModel();
        $taskAssignmentModel->deleteByTaskId($id);

        $taskTagModel = new TaskTagModel();
        $taskTagModel->deleteByTaskId($id);

        $taskListModel = new TaskListModel();
        $taskListModel->deleteByTaskId($id);

        return $this->query()->where('id', '=', $id)->delete();
    }
    public function deleteByIdSimple(string $id): bool
    {
        return $this->query()->where('id', '=', $id)->delete();
    }
}