<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Models\GroupFromUserModel;
use Ramsey\Uuid\Uuid;

class DashboardController extends Controller
{
    public array $middlewares = [
        'actionAddCustomDashboard' => ['auth'],
        'actionGetCustomDashboards' => ['auth'],
        'actionUpdateCustomDashboard' => ['auth'],
        'actionDeleteCustomDashboard' => ['auth'],
        'actionGetSingleCustomDashboard' => ['auth'],
    ];

    public function actionAddCustomDashboard()
    {
        $data = Request::json();
        $title = $data['title'] ?? '';
        $priority = $data['priority'] ?? 0;

        $userId = Request::user()['id'];
        $groupId = Uuid::uuid4()->toString();

        $model = new GroupFromUserModel();
        $model->create([
            'id' => $groupId,
            'user_id' => $userId,
            'name' => $title,
            'priority' => $priority,
        ]);

        return $this->json(['dashboard' => [
                'id' => $groupId,
                'name' => $title,
                'priority' => $priority,
            ]]);
    }

    public function actionGetCustomDashboards()
    {
        $userId = Request::user()['id'];
        $model = new GroupFromUserModel();
        $groups = $model->findAllByUserId($userId);

        if ($groups) {
            return $this->json([
                'dashboards' => $groups
            ]);
        }
        return $this->json([
            'dashboards' => []
        ]);
    }

    public function actionGetCustomDashboard()
    {
        $userId = Request::user()['id'];
        $data = Request::json();
        $id = $data['id'] ?? '';

        $model = new GroupFromUserModel();
        $group = $model->findById($id);

        if (!$group) {
            return $this->json(['message' => 'Dashboard not found'], 404);
        }

        if ($group['user_id'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        return $this->json(['dashboard' => [
            'id' => $group['id'],
            'name' => $group['name'],
            'priority' => $group['priority'],
        ]]);
    }

    public function actionUpdateCustomDashboard()
    {
        $data = Request::json();
        $id = $data['id'];

        $model = new GroupFromUserModel();
        $group = $model->findById($id);

        if (!$group) {
            return $this->json(['error' => 'Dashboard not found'], 404);
        }

        if ($group['user_id'] !== Request::user()['id']) {
            return $this->json(['error' => 'Forbidden'], 403);
        }

        $updateData = [];
        if (isset($data['name'])) {
            $updateData['name'] = $data['name'];
        }
        if (isset($data['priority'])) {
            $updateData['priority'] = $data['priority'];
        }

        $model->updateById($id, $updateData);
        $updated = $model->findById($id);

        return $this->json(['dashboard' => [
            'id' => $updated['id'],
            'name' => $updated['name'],
            'priority' => $updated['priority'],
            'count' => $updated['count']
        ]]);
    }

    public function actionDeleteCustomDashboard()
    {
        $userId = Request::user()['id'];
        $data = Request::json();
        $id = $data['id'] ?? '';

        $model = new GroupFromUserModel();
        $group = $model->findById($id);

        if (!$group) {
            return $this->json(['message' => 'Dashboard not found'], 404);
        }

        if ($group['user_id'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $model->deleteById($id);

        return $this->json(['deleteId' => $id]);
    }
}
