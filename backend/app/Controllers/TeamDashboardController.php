<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Models\GroupFromTeamModel;
use App\Models\ListModel;
use App\Models\TaskListModel;
use App\Models\TaskModel;
use App\Models\GroupListFromTeamModel;
use App\Models\UserTeamModel;
use Ramsey\Uuid\Uuid;

class TeamDashboardController extends Controller
{
    public array $middlewares = [
        'actionGetDashboard' => ['auth'],
        'actionAddList' => ['auth'],
        'actionUpdateList' => ['auth'],
        'actionDeleteList' => ['auth'],
        'actionAddTask' => ['auth'],
        'actionUpdateTask' => ['auth'],
        'actionDeleteTask' => ['auth'],
        'actionMoveTask' => ['auth'],
        'actionReorderTasks' => ['auth'],
        'actionReorderLists' => ['auth'],
    ];

    public function actionGetDashboard()
    {
        $data = Request::json();
        $dashboardId = $data['dashboardId'] ?? '';
        $teamId = $data['teamId'] ?? '';
        $userId = Request::user()['id'];

        if (empty($dashboardId) || empty($teamId)) {
            return $this->json(['message' => 'Dashboard ID and Team ID are required'], 400);
        }

        $userTeamModel = new UserTeamModel();
        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $dashboardModel = new GroupFromTeamModel();
        $dashboard = $dashboardModel->findById($dashboardId);

        if (!$dashboard) {
            return $this->json(['message' => 'Dashboard not found'], 404);
        }

        if ($dashboard['team_id'] !== $teamId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel = new ListModel();
        $lists = $listModel->findByTeamDashboardId($dashboardId);

        return $this->json([
            'dashboard' => [
                'id' => $dashboard['id'],
                'name' => $dashboard['name'],
                'priority' => $dashboard['priority'],
                'team_id' => $dashboard['team_id'],
            ],
            'lists' => $lists
        ]);
    }

    public function actionAddList()
    {
        $data = Request::json();
        $dashboardId = $data['dashboardId'] ?? '';
        $teamId = $data['teamId'] ?? '';
        $name = $data['name'] ?? '';
        $priority = $data['priority'] ?? 0;
        $userId = Request::user()['id'];

        if (empty($dashboardId) || empty($teamId) || empty($name)) {
            return $this->json(['message' => 'Dashboard ID, Team ID and name are required'], 400);
        }

        $userTeamModel = new UserTeamModel();
        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $dashboardModel = new GroupFromTeamModel();
        $dashboard = $dashboardModel->findById($dashboardId);

        if (!$dashboard || $dashboard['team_id'] !== $teamId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listId = Uuid::uuid4()->toString();

        $listModel = new ListModel();
        $listModel->fill([
            'id' => $listId,
            'name' => $name,
            'priority' => $priority,
        ])->save();

        $groupListModel = new GroupListFromTeamModel();
        $groupListModel->fill([
            'list_id' => $listId,
            'group_id' => $dashboardId,
        ])->save();

        return $this->json([
            'list' => [
                'id' => $listId,
                'name' => $name,
                'priority' => $priority,
                'tasks' => []
            ]
        ]);
    }

    public function actionUpdateList()
    {
        $data = Request::json();
        $listId = $data['listId'] ?? '';
        $teamId = $data['teamId'] ?? '';
        $name = $data['name'] ?? '';
        $priority = $data['priority'] ?? null;
        $userId = Request::user()['id'];

        if (empty($listId) || empty($teamId) || empty($name)) {
            return $this->json(['message' => 'List ID, Team ID and name are required'], 400);
        }

        // Перевіряємо чи користувач є членом команди
        $userTeamModel = new UserTeamModel();
        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel = new ListModel();
        if (!$listModel->hasTeamAccess($listId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $updateData = ['name' => $name];
        if ($priority !== null) {
            $updateData['priority'] = $priority;
        }

        $listModel->updateById($listId, $updateData);
        $updatedList = $listModel->findByIdWithTasks($listId);

        return $this->json([
            'list' => $updatedList
        ]);
    }

    public function actionDeleteList()
    {
        $data = Request::json();
        $listId = $data['listId'] ?? '';
        $teamId = $data['teamId'] ?? '';
        $userId = Request::user()['id'];

        if (empty($listId) || empty($teamId)) {
            return $this->json(['message' => 'List ID and Team ID are required'], 400);
        }

        // Перевіряємо чи користувач є членом команди
        $userTeamModel = new UserTeamModel();
        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel = new ListModel();
        if (!$listModel->hasTeamAccess($listId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel->deleteById($listId);

        return $this->json(['deleteId' => $listId]);
    }

    public function actionAddTask()
    {
        $data = Request::json();
        $listId = $data['listId'] ?? '';
        $teamId = $data['teamId'] ?? '';
        $title = $data['title'] ?? '';
        $description = $data['description'] ?? '';
        $start_time = $data['startTime'] ?? null;
        $deadline = $data['deadline'] ?? null;
        $notification = $data['notification'] ?? null;
        $priority = $data['priority'] ?? 0;
        $status = $data['status'] ?? 'todo';
        $userId = Request::user()['id'];

        if (empty($listId) || empty($teamId) || empty($title)) {
            return $this->json(['message' => 'List ID, Team ID and title are required'], 400);
        }

        // Перевіряємо чи користувач є членом команди
        $userTeamModel = new UserTeamModel();
        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel = new ListModel();
        if (!$listModel->hasTeamAccess($listId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $taskId = Uuid::uuid4()->toString();

        $taskModel = new TaskModel();
        $taskModel->fill([
            'id' => $taskId,
            'title' => $title,
            'description' => $description,
            'start_time' => $start_time,
            'deadline' => $deadline,
            'notification' => $notification,
            'priority' => $priority,
            'status' => $status,
        ])->save();

        $taskModel->attachToList($taskId, $listId);

        $task = $taskModel->findById($taskId);

        return $this->json([
            'listId' => $listId,
            'task' => $task
        ]);
    }

    public function actionUpdateTask()
    {
        $data = Request::json();
        $listId = $data['listId'] ?? '';
        $teamId = $data['teamId'] ?? '';
        $taskId = $data['taskId'] ?? '';
        $userId = Request::user()['id'];

        if (empty($taskId) || empty($listId) || empty($teamId)) {
            return $this->json(['message' => 'Task ID, List ID and Team ID are required'], 400);
        }

        $userTeamModel = new UserTeamModel();
        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel = new ListModel();
        if (!$listModel->hasTeamAccess($listId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $taskModel = new TaskModel();
        $task = $taskModel->findById($taskId);

        if (!$task) {
            return $this->json(['message' => 'Task not found'], 404);
        }

        $taskModel->updateById($taskId, $data['task']);
        $updatedTask = $taskModel->findById($taskId);

        return $this->json([
            'listId' => $listId,
            'task' => $updatedTask
        ]);
    }

    public function actionDeleteTask()
    {
        $data = Request::json();
        $taskId = $data['taskId'] ?? '';
        $listId = $data['listId'] ?? '';
        $teamId = $data['teamId'] ?? '';
        $userId = Request::user()['id'];

        if (empty($taskId) || empty($listId) || empty($teamId)) {
            return $this->json(['message' => 'Task ID, List ID and Team ID are required'], 400);
        }

        // Перевіряємо чи користувач є членом команди
        $userTeamModel = new UserTeamModel();
        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel = new ListModel();
        if (!$listModel->hasTeamAccess($listId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        (new TaskListModel())->deleteByTaskId($taskId);
        (new TaskModel())->deleteById($taskId);

        return $this->json([
            'listId' => $listId,
            'taskId' => $taskId
        ]);
    }

    public function actionMoveTask()
    {
        $data = Request::json();
        $taskId = $data['taskId'] ?? '';
        $sourceListId = $data['sourceListId'] ?? '';
        $destListId = $data['destListId'] ?? '';
        $teamId = $data['teamId'] ?? '';
        $userId = Request::user()['id'];

        if (empty($taskId) || empty($sourceListId) || empty($destListId) || empty($teamId)) {
            return $this->json(['message' => 'Task ID, source and destination list IDs and Team ID are required'], 400);
        }

        // Перевіряємо чи користувач є членом команди
        $userTeamModel = new UserTeamModel();
        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel = new ListModel();

        if (!$listModel->hasTeamAccess($sourceListId, $teamId) ||
            !$listModel->hasTeamAccess($destListId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $taskModel = new TaskModel();
        $taskModel->moveToList($taskId, $sourceListId, $destListId);

        return $this->json([
            'success' => true,
            'taskId' => $taskId,
            'sourceListId' => $sourceListId,
            'destListId' => $destListId
        ]);
    }

    public function actionReorderTasks()
    {
        $data = Request::json();
        $listId = $data['listId'] ?? '';
        $teamId = $data['teamId'] ?? '';
        $taskIds = $data['taskIds'] ?? [];
        $userId = Request::user()['id'];

        if (empty($listId) || empty($teamId) || empty($taskIds)) {
            return $this->json(['message' => 'List ID, Team ID and task IDs are required'], 400);
        }

        // Перевіряємо чи користувач є членом команди
        $userTeamModel = new UserTeamModel();
        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel = new ListModel();
        if (!$listModel->hasTeamAccess($listId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $taskModel = new TaskModel();
        $taskModel->reorderInList($listId, $taskIds);

        return $this->json(['success' => true]);
    }

    public function actionReorderLists()
    {
        $data = Request::json();
        $dashboardId = $data['dashboardId'] ?? '';
        $teamId = $data['teamId'] ?? '';
        $listIds = $data['listIds'] ?? [];
        $userId = Request::user()['id'];

        if (empty($dashboardId) || empty($teamId) || empty($listIds)) {
            return $this->json(['message' => 'Dashboard ID, Team ID and list IDs are required'], 400);
        }

        $userTeamModel = new UserTeamModel();
        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $dashboardModel = new GroupFromTeamModel();
        $dashboard = $dashboardModel->findById($dashboardId);

        if (!$dashboard || $dashboard['team_id'] !== $teamId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel = new ListModel();
        $listModel->reorderInDashboard($dashboardId, $listIds);

        return $this->json(['success' => true]);
    }
}