<?php

namespace App\Models;

use App\Core\Model;

class ListModel extends Model
{
    protected string $table = 'lists';
    protected string $alias = 'l';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findAll(): array
    {
        return $this->query()->get();
    }
    public function findById(string $id): ?array
    {
        return $this->query()->where('id', '=', $id)->first();
    }
    public function findByDashboardId(string $dashboardId): array
    {
        $lists = $this->query()
            ->select([
                'l.id', 'l.name', 'l.priority'
            ])
            ->join('group_lists_from_user glu', 'glu.list_id = l.id')
            ->where('glu.group_id', '=', $dashboardId)
            ->orderBy('l.priority')
            ->get();

        if (empty($lists)) {
            return [];
        }

        foreach ($lists as &$list){
            $list['tasks'] = (new TaskModel())->findByListId($list['id']);
        }

        return $lists;
    }
    public function findByIdWithTasks(string $listId): ?array
    {
        $list = $this->query()
            ->select(['l.id', 'l.name', 'l.priority'])
            ->where('l.id', '=', $listId)
            ->first();

        if ($list) {
            $taskModel = new TaskModel();
            $list['tasks'] = $taskModel->findByListId($listId);
        }

        return $list;
    }
    public function hasUserAccess(string $listId, string $userId): bool
    {
        $result = $this->query()
            ->select(['l.id'])
            ->join('group_lists_from_user glu', 'glu.list_id = l.id')
            ->join('groups_from_user g', 'g.id = glu.group_id')
            ->where('l.id', '=', $listId)
            ->where('g.user_id', '=', $userId)
            ->first();

        return $result !== null;
    }
    public function updateById(string $id, array $data): bool
    {
        return $this->query()->where('id', '=', $id)->update($data);
    }
    public function reorderInDashboard(string $dashboardId, array $listIds): bool
    {
        foreach ($listIds as $index => $listId) {
            $this->query()
                ->join('group_lists_from_user glu', 'glu.list_id = l.id')
                ->where('glu.group_id', '=', $dashboardId)
                ->where('l.id', '=', $listId)
                ->update(['priority' => $index + 1]);
        }
        return true;
    }
    public function deleteById(string $id): bool
    {
        $taskListModel = new TaskListModel();
        $taskLists = $taskListModel->findByListId($id);
        $taskIds = array_column($taskLists, 'task_id');

        if (!empty($taskIds)) {
            $taskAssignmentModel = new TaskAssignmentModel();
            foreach ($taskIds as $taskId) {
                $taskAssignmentModel->deleteByTaskId($taskId);
            }

            $taskTagModel = new TaskTagModel();
            foreach ($taskIds as $taskId) {
                $taskTagModel->deleteByTaskId($taskId);
            }

            $taskModel = new TaskModel();
            foreach ($taskIds as $taskId) {
                $taskModel->deleteByIdSimple($taskId);
            }
        }

        $taskListModel->deleteByListId($id);

        $groupListFromUserModel = new GroupListFromUserModel();
        $groupListFromUserModel->deleteByListId($id);

        $groupListFromTeamModel = new GroupListFromTeamModel();
        $groupListFromTeamModel->deleteByListId($id);

        return $this->query()->where('id', '=', $id)->delete();
    }
}