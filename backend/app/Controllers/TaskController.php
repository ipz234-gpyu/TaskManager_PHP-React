<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Models\TagsModel;
use App\Models\TaskTagModel;
use App\Models\TaskAssignmentModel;
use App\Models\UserTeamModel;
use Ramsey\Uuid\Uuid;

class TaskController extends Controller
{
    public array $middlewares = [
        'actionGetTags' => ['auth'],
        'actionCreateTag' => ['auth'],
        'actionUpdateTag' => ['auth'],
        'actionDeleteTag' => ['auth'],
        'actionAddTagToTask' => ['auth'],
        'actionRemoveTagFromTask' => ['auth'],
        'actionGetTaskTags' => ['auth'],
        'actionGetTasksByTag' => ['auth'],
        'actionCreateTaskAssignment' => ['auth'],
        'actionGetTaskAssignments' => ['auth'],
        'actionDeleteTaskAssignment' => ['auth'],
        'actionGetAssignmentsByTask' => ['auth'],
        'actionGetAssignmentsByUser' => ['auth'],
    ];

    public function actionGetTags()
    {
        $userId = Request::user()['id'];
        $tags = (new TagsModel())->findByUserId($userId);

        return $this->json([
            'tags' => $tags
        ]);
    }

    public function actionCreateTag()
    {
        $data = Request::json();
        $userId = Request::user()['id'];

        $name = $data['name'] ?? '';
        $color = $data['color'] ?? '#000000';

        if (empty($name)) {
            return $this->json(['message' => 'Tag name is required'], 400);
        }

        $existingTag = (new TagsModel())->findByName($name, $userId);
        if ($existingTag) {
            return $this->json(['message' => 'Tag with this name already exists'], 409);
        }

        $tagData = [
            'id' => uniqid(),
            'name' => $name,
            'color' => $color,
            'user_id' => $userId,
        ];

        $created = (new TagsModel())->create($tagData);

        if ($created) {
            return $this->json([
                'tag' => $tagData
            ]);
        }

        return $this->json(['message' => 'Failed to create tag'], 500);
    }

    public function actionUpdateTag()
    {
        $data = Request::json();
        $userId = Request::user()['id'];

        $tagId = $data['tagId'] ?? '';
        $name = $data['name'] ?? '';
        $color = $data['color'] ?? '';

        if (empty($tagId)) {
            return $this->json(['message' => 'Tag ID is required'], 400);
        }

        $tag = (new TagsModel())->findById($tagId);
        if (!$tag) {
            return $this->json(['message' => 'Tag not found'], 404);
        }

        if ($tag['user_id'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        if (!empty($name)) $updateData['name'] = $name;
        if (!empty($color)) $updateData['color'] = $color;

        if (empty($updateData))
            return $this->json(['message' => 'Tag param is required'], 400);

        $updated = (new TagsModel())->updateById($tagId, $updateData);

        if ($updated) {
            $updatedTag = (new TagsModel())->findById($tagId);
            return $this->json([
                'tag' => $updatedTag
            ]);
        }

        return $this->json(['message' => 'Failed to update tag'], 500);
    }

    public function actionDeleteTag()
    {
        $data = Request::json();
        $userId = Request::user()['id'];

        $tagId = $data['tagId'] ?? '';

        if (empty($tagId)) {
            return $this->json(['message' => 'Tag ID is required'], 400);
        }

        $tag = (new TagsModel())->findById($tagId);
        if (!$tag) {
            return $this->json(['message' => 'Tag not found'], 404);
        }

        if ($tag['user_id'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $deleted = (new TagsModel())->deleteById($tagId);

        if ($deleted) {
            return $this->json(['deletedId' => $tagId]);
        }

        return $this->json(['message' => 'Failed to delete tag'], 500);
    }

    public function actionAddTagToTask()
    {
        $data = Request::json();
        $userId = Request::user()['id'];

        $tagId = $data['tagId'] ?? '';
        $taskId = $data['taskId'] ?? '';

        if (empty($tagId) || empty($taskId)) {
            return $this->json(['message' => 'Tag ID and Task ID are required'], 400);
        }

        $tag = (new TagsModel())->findById($tagId);
        if (!$tag) {
            return $this->json(['message' => 'Tag not found'], 404);
        }

        if ($tag['user_id'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $attached = (new TaskTagModel())->attachTagToTask($taskId, $tagId);

        if ($attached) {
            return $this->json([
                'taskId' => $taskId,
                'tag' => $tag
            ]);
        }

        return $this->json(['message' => 'Failed to add tag to task'], 500);
    }

    public function actionRemoveTagFromTask()
    {
        $data = Request::json();
        $userId = Request::user()['id'];

        $tagId = $data['tagId'] ?? '';
        $taskId = $data['taskId'] ?? '';

        if (empty($tagId) || empty($taskId)) {
            return $this->json(['message' => 'Tag ID and Task ID are required'], 400);
        }

        $tag = (new TagsModel())->findById($tagId);
        if (!$tag) {
            return $this->json(['message' => 'Tag not found'], 404);
        }

        if ($tag['user_id'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $detached = (new TaskTagModel())->detachTagFromTask($taskId, $tagId);

        if ($detached) {
            return $this->json([
                'taskId' => $taskId,
                'tagId' => $tagId
            ]);
        }

        return $this->json(['message' => 'Failed to remove tag from task'], 500);
    }

    public function actionGetTaskTags()
    {
        $data = Request::json();
        $taskId = $data['taskId'] ?? '';

        if (empty($taskId)) {
            return $this->json(['message' => 'Task ID is required'], 400);
        }

        $tags = (new TaskTagModel())->findTagsByTaskId($taskId);

        return $this->json([
            'taskId' => $taskId,
            'tags' => $tags
        ]);
    }

    public function actionGetTasksByTag()
    {
        $data = Request::json();
        $userId = Request::user()['id'];

        $tagId = $data['tagId'] ?? '';

        if (empty($tagId)) {
            return $this->json(['message' => 'Tag ID is required'], 400);
        }

        $tag = (new TagsModel())->findById($tagId);
        if (!$tag) {
            return $this->json(['message' => 'Tag not found'], 404);
        }

        if ($tag['user_id'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $tasks = (new TaskTagModel())->findTasksByTagId($tagId);

        return $this->json([
            'tagId' => $tagId,
            'tasks' => $tasks
        ]);
    }

    public function actionGetTaskAssignments()
    {
        $data = Request::json();
        $taskId = $data['taskId'] ?? '';

        if (empty($taskId)) {
            return $this->json(['message' => 'Task ID is required'], 400);
        }

        $assignments = (new TaskAssignmentModel())->findByTaskId($taskId);

        return $this->json([
            'taskId' => $taskId,
            'assignments' => $assignments
        ]);
    }

    public function actionCreateTaskAssignment()
    {
        $data = Request::json();
        $userId = Request::user()['id'];

        $taskId = $data['taskId'] ?? '';
        $teamId = $data['teamId'] ?? '';
        $assignedUserId = $data['assignedUserId'] ?? '';

        if (empty($taskId) || empty($teamId) || empty($assignedUserId)) {
            return $this->json(['message' => 'All fields are required'], 400);
        }

        if (!(new UserTeamModel())->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'You are not a member of this team'], 403);
        }

        $userTeam = (new UserTeamModel())->findByUserAndTeam($assignedUserId, $teamId);
        if (!$userTeam) {
            return $this->json(['message' => 'User team relationship not found'], 404);
        }

        $assignmentData = [
            'task_id' => $taskId,
            'user_team_id' => $userTeam['id']
        ];

        $created = (new TaskAssignmentModel())->create($assignmentData);

        if ($created) {
            return $this->json([
                'taskId' => $taskId,
                'assignedUserId' => $assignedUserId
            ]);
        }

        return $this->json(['message' => 'Failed to create task assignment'], 500);
    }


    public function actionDeleteTaskAssignment()
    {
        $data = Request::json();
        $userId = Request::user()['id'];

        $taskId = $data['taskId'] ?? '';
        $teamId = $data['teamId'] ?? '';
        $assignedUserId = $data['assignedUserId'] ?? '';

        if (empty($taskId) || empty($teamId) || empty($assignedUserId)) {
            return $this->json(['message' => 'All fields are required'], 400);
        }

        if (!(new UserTeamModel())->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'You are not a member of this team'], 403);
        }

        $userTeam = (new UserTeamModel())->findByUserAndTeam($assignedUserId, $teamId);
        if (!$userTeam) {
            return $this->json(['message' => 'User team relationship not found'], 404);
        }

        $assignment = (new TaskAssignmentModel())->findByUserTeamAndTask($userTeam['id'], $taskId);
        if (!$assignment) {
            return $this->json(['message' => 'Assignment not found'], 404);
        }

        $deleted = (new TaskAssignmentModel())->deleteByUserTeamAndTask($userTeam['id'], $taskId);

        if ($deleted) {
            return $this->json([
                'taskId' => $taskId,
                'assignedUserId' => $assignedUserId
            ]);
        }

        return $this->json(['message' => 'Failed to delete assignment'], 500);
    }

    public function actionGetAssignmentsByTask()
    {
        $data = Request::json();
        $taskId = $data['taskId'] ?? '';

        if (empty($taskId)) {
            return $this->json(['message' => 'Task ID is required'], 400);
        }

        $assignments = (new TaskAssignmentModel())->findAssignedUserIds($taskId);

        return $this->json([
            'taskId' => $taskId,
            'assignedUserIds' => $assignments
        ]);
    }

    public function actionGetAssignmentsByUser()
    {
        $data = Request::json();
        $userTeamId = $data['userTeamId'] ?? '';

        if (empty($userTeamId)) {
            return $this->json(['message' => 'User Team ID is required'], 400);
        }

        $assignments = (new TaskAssignmentModel())->findByUserTeamId($userTeamId);

        return $this->json([
            'userTeamId' => $userTeamId,
            'assignments' => $assignments
        ]);
    }
}