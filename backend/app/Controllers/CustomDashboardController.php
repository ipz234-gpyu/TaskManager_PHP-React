<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Models\GroupFromUserModel;
use App\Models\ListModel;
use App\Models\TaskListModel;
use App\Models\TaskModel;
use App\Models\GroupListFromUserModel;
use App\Models\TaskTagModel;
use Ramsey\Uuid\Uuid;

class CustomDashboardController extends Controller
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
        $userId = Request::user()['id'];

        if (empty($dashboardId)) {
            return $this->json(['message' => 'Dashboard ID is required'], 400);
        }

        $dashboardModel = new GroupFromUserModel();
        $dashboard = $dashboardModel->findById($dashboardId);

        if (!$dashboard) {
            return $this->json(['message' => 'Dashboard not found'], 404);
        }

        if ($dashboard['user_id'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel = new ListModel();
        $lists = $listModel->findByDashboardId($dashboardId);

        return $this->json([
            'dashboard' => [
                'id' => $dashboard['id'],
                'name' => $dashboard['name'],
                'priority' => $dashboard['priority'],
            ],
            'lists' => $lists
        ]);
    }
    public function actionAddList()
    {
        $data = Request::json();
        $dashboardId = $data['dashboardId'] ?? '';
        $name = $data['name'] ?? '';
        $priority = $data['priority'] ?? 0;
        $userId = Request::user()['id'];

        if (empty($dashboardId) || empty($name)) {
            return $this->json(['message' => 'Dashboard ID and name are required'], 400);
        }

        $dashboardModel = new GroupFromUserModel();
        $dashboard = $dashboardModel->findById($dashboardId);

        if (!$dashboard || $dashboard['user_id'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listId = Uuid::uuid4()->toString();
        $groupListId = Uuid::uuid4()->toString();

        $listModel = new ListModel();
        $listModel->fill([
            'id' => $listId,
            'name' => $name,
            'priority' => $priority,
        ])->save();

        $groupListModel = new GroupListFromUserModel();
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
        $name = $data['name'] ?? '';
        $priority = $data['priority'] ?? null;
        $userId = Request::user()['id'];

        if (empty($listId) || empty($name)) {
            return $this->json(['message' => 'List ID and name are required'], 400);
        }

        $listModel = new ListModel();
        if (!$listModel->hasUserAccess($listId, $userId)) {
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
        $userId = Request::user()['id'];

        if (empty($listId)) {
            return $this->json(['message' => 'List ID is required'], 400);
        }

        $listModel = new ListModel();
        if (!$listModel->hasUserAccess($listId, $userId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel->deleteById($listId);

        return $this->json(['deleteId' => $listId]);
    }
    public function actionAddTask()
    {
        $data = Request::json();
        $listId = $data['listId'] ?? '';
        $title = $data['title'] ?? '';
        $description = $data['description'] ?? '';
        $start_time = $data['startTime'] ?? null;
        $deadline = $data['deadline'] ?? null;
        $notification = $data['notification'] ?? null;
        $priority = $data['priority'] ?? 0;
        $status = $data['status'] ?? 'todo';
        $userId = Request::user()['id'];

        if (empty($listId) || empty($title)) {
            return $this->json(['message' => 'List ID and title are required'], 400);
        }

        $listModel = new ListModel();
        if (!$listModel->hasUserAccess($listId, $userId)) {
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
        $task['tags'] = [];

        return $this->json([
            'listId' => $listId,
            'task' => $task
        ]);
    }

    public function actionUpdateTask()
    {
        $data = Request::json();
        $listId = $data['listId'] ?? '';
        $taskId = $data['taskId'] ?? '';
        $userId = Request::user()['id'];

        if (empty($taskId) || empty($listId)) {
            return $this->json(['message' => 'Task ID and List ID are required'], 400);
        }

        $listModel = new ListModel();
        if (!$listModel->hasUserAccess($listId, $userId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $taskModel = new TaskModel();
        $task = $taskModel->findById($taskId);

        if (!$task) {
            return $this->json(['message' => 'Task not found'], 404);
        }

        $taskModel->updateById($taskId, array_diff_key($data['task'], array_flip(['tags', 'assignedUserIds'])));
        $updatedTask = $taskModel->findById($taskId);
        $updatedTask['tags'] = (new TaskTagModel())->findTagsByTaskId($taskId);

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
        $userId = Request::user()['id'];

        if (empty($taskId) || empty($listId)) {
            return $this->json(['message' => 'Task ID and List ID are required'], 400);
        }

        $listModel = new ListModel();
        if (!$listModel->hasUserAccess($listId, $userId)) {
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
        $userId = Request::user()['id'];

        if (empty($taskId) || empty($sourceListId) || empty($destListId)) {
            return $this->json(['message' => 'Task ID, source and destination list IDs are required'], 400);
        }

        $listModel = new ListModel();

        if (!$listModel->hasUserAccess($sourceListId, $userId) ||
            !$listModel->hasUserAccess($destListId, $userId)) {
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
        $taskIds = $data['taskIds'] ?? [];
        $userId = Request::user()['id'];

        if (empty($listId) || empty($taskIds)) {
            return $this->json(['message' => 'List ID and task IDs are required'], 400);
        }

        $listModel = new ListModel();
        if (!$listModel->hasUserAccess($listId, $userId)) {
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
        $listIds = $data['listIds'] ?? [];
        $userId = Request::user()['id'];

        if (empty($dashboardId) || empty($listIds)) {
            return $this->json(['message' => 'Dashboard ID and list IDs are required'], 400);
        }

        $dashboardModel = new GroupFromUserModel();
        $dashboard = $dashboardModel->findById($dashboardId);

        if (!$dashboard || $dashboard['user_id'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $listModel = new ListModel();
        $listModel->reorderInDashboard($dashboardId, $listIds);

        return $this->json(['success' => true]);
    }
}