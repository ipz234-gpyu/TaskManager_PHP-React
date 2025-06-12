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

    public function hasUserAccess(string $taskId, string $userId): bool
    {
        $userTaskAccess = $this->query()
            ->select(['t.id'])
            ->join('task_lists tl', 'tl.task_id = t.id')
            ->join('lists l', 'l.id = tl.list_id')
            ->join('group_lists_from_user glu', 'glu.list_id = l.id')
            ->join('groups_from_user gu', 'gu.id = glu.group_id')
            ->where('t.id', '=', $taskId)
            ->where('gu.user_id', '=', $userId)
            ->first();

        if ($userTaskAccess) {
            return true;
        }

        $teamTaskAccess = $this->query()
            ->select(['t.id'])
            ->join('task_lists tl', 'tl.task_id = t.id')
            ->join('lists l', 'l.id = tl.list_id')
            ->join('group_lists_from_team glt', 'glt.list_id = l.id')
            ->join('groups_from_team gt', 'gt.id = glt.group_id')
            ->join('user_teams ut', 'ut.team_id = gt.team_id')
            ->where('t.id', '=', $taskId)
            ->where('ut.user_id', '=', $userId)
            ->first();

        return $teamTaskAccess !== null;
    }

    public function searchTasksByUser(string $userId, string $searchQuery): array
    {
        $searchQuery = trim($searchQuery);

        $userTasks = $this->query()
            ->select([
                't.id', 't.title', 't.description', 't.start_time',
                't.deadline', 't.notification', 't.priority', 't.status',
                't.parent_task_id', 'l.name as list_name', 'l.id as list_id',
                'gu.name as group_name', 'gu.id as group_id', 'gu.user_id as owner_id'
            ])
            ->join('task_lists tl', 'tl.task_id = t.id')
            ->join('lists l', 'l.id = tl.list_id')
            ->join('group_lists_from_user glu', 'glu.list_id = l.id')
            ->join('groups_from_user gu', 'gu.id = glu.group_id')
            ->where('gu.user_id', '=', $userId)
            ->where('t.title', 'LIKE', '%' . $searchQuery . '%')
            ->get();

        $teamTasks = $this->query()
            ->select([
                't.id', 't.title', 't.description', 't.start_time',
                't.deadline', 't.notification', 't.priority', 't.status',
                't.parent_task_id', 'l.name as list_name', 'l.id as list_id',
                'gt.name as group_name', 'gt.id as group_id', 'teams.name as team_name', 'teams.id as team_id'
            ])
            ->join('task_lists tl', 'tl.task_id = t.id')
            ->join('lists l', 'l.id = tl.list_id')
            ->join('group_lists_from_team glt', 'glt.list_id = l.id')
            ->join('groups_from_team gt', 'gt.id = glt.group_id')
            ->join('teams', 'teams.id = gt.team_id')
            ->join('user_teams ut', 'ut.team_id = gt.team_id')
            ->where('ut.user_id', '=', $userId)
            ->where('t.title', 'LIKE', '%' . $searchQuery . '%')
            ->get();

        $allTasks = array_merge($userTasks, $teamTasks);

        $uniqueTasks = [];
        $seenIds = [];

        foreach ($allTasks as $task) {
            if (!in_array($task['id'], $seenIds)) {
                $uniqueTasks[] = $task;
                $seenIds[] = $task['id'];
            }
        }

        usort($uniqueTasks, function($a, $b) {
            return (int)$b['priority'] - (int)$a['priority'];
        });

        return $uniqueTasks;
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

    public function findByIdWithAccess(string $id, string $userId): ?array
    {
        if (!$this->hasUserAccess($id, $userId)) {
            return null;
        }

        return $this->findById($id);
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

    public function updateByIdWithAccess(string $id, array $data, string $userId): bool
    {
        if (!$this->hasUserAccess($id, $userId)) {
            return false;
        }

        return $this->updateById($id, $data);
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

    public function deleteByIdWithAccess(string $id, string $userId): bool
    {
        if (!$this->hasUserAccess($id, $userId)) {
            return false;
        }

        return $this->deleteById($id);
    }

    public function deleteByIdSimple(string $id): bool
    {
        return $this->query()->where('id', '=', $id)->delete();
    }
}