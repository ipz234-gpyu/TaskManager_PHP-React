<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Models\GroupFromTeamModel;
use App\Models\GroupFromUserModel;
use App\Models\TeamModel;
use App\Models\UserTeamModel;
use Ramsey\Uuid\Uuid;

class DashboardController extends Controller
{
    public array $middlewares = [
        'actionAddCustomDashboard' => ['auth'],
        'actionGetCustomDashboards' => ['auth'],
        'actionUpdateCustomDashboard' => ['auth'],
        'actionDeleteCustomDashboard' => ['auth'],
        'actionGetSingleCustomDashboard' => ['auth'],
        'actionAddTeam' => ['auth'],
        'actionGetTeams' => ['auth'],
        'actionDeleteTeam' => ['auth'],
        'actionUpdateTeam' => ['auth'],
        'actionAddTeamDashboard' => ['auth'],
        'actionDeleteTeamDashboard' => ['auth'],
        'actionUpdateTeamDashboard' => ['auth'],
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

    public function actionAddTeam()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $name = $data['name'] ?? '';

        if ($name === '') {
            return $this->json(['message' => 'Team name is required'], 400);
        }

        $teamId = Uuid::uuid4()->toString();
        $userTeamId = Uuid::uuid4()->toString();

        $teamModel = new TeamModel();
        $userTeamModel = new UserTeamModel();

        $teamModel->fill([
            'id' => $teamId,
            'name' => $name,
            'created_by' => $userId,
        ])->save();

        $userTeamModel->fill([
            'id' => $userTeamId,
            'user_id' => $userId,
            'team_id' => $teamId,
        ])->save();

        return $this->json([
            'team' => [
                'id' => $teamId,
                'name' => $name,
                'isAdmin' => true,
                'dashboards' => []
            ]
        ]);
    }

    public function actionGetTeams()
    {
        $userId = Request::user()['id'];
        $teamModel = new TeamModel();
        $groupModel = new GroupFromTeamModel();

        $teams = $teamModel->findAllByUserId($userId);

        foreach ($teams as &$team) {
            $team['isAdmin'] = $team['created_by'] === $userId;
            unset($team['created_by'], $team['user_team_id']);

            $team['dashboards'] = $groupModel->findByTeamId($team['id']);
        }

        return $this->json([
            'teams' => $teams
        ]);
    }

    public function actionDeleteTeam()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $teamId = $data['id'] ?? '';

        if (empty($teamId)) {
            return $this->json(['message' => 'Team ID is required'], 400);
        }

        $teamModel = new TeamModel();
        $team = $teamModel->find($teamId);

        if (!$team) {
            return $this->json(['message' => 'Team not found'], 404);
        }

        if ($team['created_by'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $teamModel->delete(['id' => $teamId]);

        return $this->json(['deleteId' => $teamId]);
    }

    public function actionUpdateTeam()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $teamId = $data['id'] ?? '';
        $name = $data['name'] ?? '';

        if (empty($teamId) || empty($name)) {
            return $this->json(['message' => 'Team ID and name are required'], 400);
        }

        $teamModel = new TeamModel();
        $groupModel = new GroupFromTeamModel();
        $team = $teamModel->find($teamId);
        $team['dashboards'] = $groupModel->findByTeamId($team['id']);

        if (!$team) {
            return $this->json(['message' => 'Team not found'], 404);
        }

        if ($team['created_by'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $teamModel->update(['name' => $name], ['id' => $teamId]);
        $updated = $teamModel->find($teamId);

        return $this->json([
            'team' => [
                'id' => $updated['id'],
                'name' => $updated['name'],
                'isAdmin' => true,
                'dashboards' =>  $team['dashboards'],
            ]
        ]);
    }

    public function actionAddTeamDashboard()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $teamId = $data['teamId'] ?? '';
        $name = $data['name'] ?? '';
        $priority = $data['priority'] ?? 0;

        if (empty($teamId) || empty($name)) {
            return $this->json(['message' => 'Team ID and name are required'], 400);
        }

        $userTeamModel = new UserTeamModel();
        $membership = $userTeamModel->findByUserAndTeam($userId, $teamId);

        if (!$membership) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $groupId = Uuid::uuid4()->toString();
        $groupModel = new GroupFromTeamModel();

        $groupModel->fill([
            'id' => $groupId,
            'team_id' => $teamId,
            'name' => $name,
            'priority' => $priority,
        ])->save();

        return $this->json([
            'teamId' => $teamId,
            'dashboard' => [
                'id' => $groupId,
                'name' => $name,
                'priority' => $priority,
                'count' => 0
            ]
        ]);
    }

    public function actionDeleteTeamDashboard()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $teamId = $data['teamId'] ?? '';
        $dashboardId = $data['dashboardId'] ?? '';

        if (empty($teamId) || empty($dashboardId)) {
            return $this->json(['message' => 'Team ID and Dashboard ID are required'], 400);
        }

        $userTeamModel = new UserTeamModel();
        $membership = $userTeamModel->findByUserAndTeam($userId, $teamId);

        if (!$membership) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $groupModel = new GroupFromTeamModel();
        $dashboard = $groupModel->find($dashboardId);

        if (!$dashboard || $dashboard['team_id'] !== $teamId) {
            return $this->json(['message' => 'Dashboard not found'], 404);
        }

        $groupModel->delete(['id' => $dashboardId]);

        return $this->json(['deleteId' => $dashboardId]);
    }

    public function actionUpdateTeamDashboard()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $teamId = $data['teamId'] ?? '';
        $dashboardId = $data['dashboardId'] ?? '';
        $name = $data['name'] ?? '';

        if (empty($teamId) || empty($dashboardId) || empty($name)) {
            return $this->json(['message' => 'Team ID, Dashboard ID and name are required'], 400);
        }

        $userTeamModel = new UserTeamModel();
        $membership = $userTeamModel->findByUserAndTeam($userId, $teamId);

        if (!$membership) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $groupModel = new GroupFromTeamModel();
        $dashboard = $groupModel->find($dashboardId);

        if (!$dashboard || $dashboard['team_id'] !== $teamId) {
            return $this->json(['message' => 'Dashboard not found'], 404);
        }

        $updateData = ['name' => $name];
        if (isset($data['priority'])) {
            $updateData['priority'] = $data['priority'];
        }

        $groupModel->update($updateData, ['id' => $dashboardId]);
        $updated = $groupModel->findWithCount($dashboardId);

        return $this->json([
            'teamId' => $teamId,
            'dashboard' => [
                'id' => $updated['id'],
                'name' => $updated['name'],
                'priority' => $updated['priority'],
                'count' => $updated['count'] ?? 0
            ]
        ]);
    }
}