<?php

namespace App\Controllers;

use App\Core\Controller;
use App\Core\Request;
use App\Models\GroupFromTeamModel;
use App\Models\TeamInvitationModel;
use App\Models\TeamModel;
use App\Models\UserModel;
use App\Models\UserTeamModel;
use App\Helpers\EmailHelper;
use Ramsey\Uuid\Uuid;

class MenageTeamController extends Controller
{
    public array $middlewares = [
        'actionGetTeam' => ['auth'],
        'actionInviteUser' => ['auth'],
        'actionRevokeInvitation' => ['auth'],
        'actionKickMember' => ['auth'],
        'actionAcceptInvitation' => ['auth'],
        'actionCancelInvitation' => ['auth'],
        'actionIsLiveInvitation' => ['auth'],
    ];

    public function actionGetTeam()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $teamId = $data['teamId'] ?? '';

        if (empty($teamId)) {
            return $this->json(['message' => 'Team ID is required'], 400);
        }

        $teamModel = new TeamModel();
        $userTeamModel = new UserTeamModel();

        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $team = $teamModel->findById($teamId);
        if (!$team) {
            return $this->json(['message' => 'Team not found'], 404);
        }

        if ($team['created_by'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $users = (new UserModel())->findAllByTeamId($teamId);

        $userResponse = [];
        foreach ($users as $user) {
            $userResponse[] = UserModel::formatBasicUser($user);
        }

        $invitations = (new TeamInvitationModel())->findByTeamIdWithUserInfo($teamId);

        foreach ($invitations as &$invitation) {
            $invitation['user'] = UserModel::formatBasicUser([
                'id' => $invitation['user_id'],
                'name' => $invitation['name'],
                'surname' => $invitation['surname'],
                'email' => $invitation['email'],
                'avatar' => $invitation['avatar'],
            ]);
            unset($invitation['name'], $invitation['surname'], $invitation['email'], $invitation['avatar']);
        }

        return $this->json([
            'team' => $team,
            'members' => $userResponse,
            'invitations' => $invitations
        ]);
    }

    public function actionInviteUser()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $teamId = $data['teamId'] ?? '';
        $inviteEmail = $data['email'] ?? '';

        if (empty($teamId) || empty($inviteEmail)) {
            return $this->json(['message' => 'Team ID and email are required'], 400);
        }

        if (!filter_var($inviteEmail, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['message' => 'Invalid email format'], 400);
        }

        $teamModel = new TeamModel();
        $userTeamModel = new UserTeamModel();

        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $team = $teamModel->findById($teamId);
        if (!$team || $team['created_by'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $userModel = new UserModel();
        $invitedUser = $userModel->findByEmail($inviteEmail);

        if (!$invitedUser) {
            return $this->json(['message' => 'User with this email not found'], 404);
        }

        if ($userTeamModel->isUserInTeam($invitedUser['id'], $teamId)) {
            return $this->json(['message' => 'User is already a team member'], 400);
        }

        $invitationModel = new TeamInvitationModel();

        $existingInvitation = $invitationModel->findByUserAndTeam($invitedUser['id'], $teamId);
        if ($existingInvitation && strtotime($existingInvitation['expires_at']) > time()) {
            return $this->json(['message' => 'User already has an active invitation'], 400);
        }

        if ($existingInvitation) {
            $invitationModel->deleteById($existingInvitation['id']);
        }

        $invitationToken = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $invitationToken);
        $expiresAt = date('Y-m-d H:i:s', time() + (7 * 24 * 60 * 60));

        $invitationId = Uuid::uuid4()->toString();

        $invitationData = [
            'id' => $invitationId,
            'token_hash' => $tokenHash,
            'expires_at' => $expiresAt,
            'user_id' => $invitedUser['id'],
            'team_id' => $teamId
        ];

        if (!$invitationModel->create($invitationData)) {
            return $this->json(['message' => 'Failed to create invitation'], 500);
        }

        try {
            $invitationLink = "http://localhost:5173/dashboard/team-invitation/" . $invitationToken;
            EmailHelper::sendTeamInvitation($inviteEmail, $invitedUser['name'], $team['name'], $invitationLink);
        } catch (\Exception $e) {
            $invitationModel->deleteById($invitationId);
            return $this->json(['message' => 'Failed to send invitation email'], 500);
        }

        $newInvitation = $invitationModel->findByIdWithUserInfo($invitationId);
        if ($newInvitation) {
            $newInvitation['user'] = UserModel::formatBasicUser([
                'id' => $newInvitation['user_id'],
                'name' => $newInvitation['name'],
                'surname' => $newInvitation['surname'],
                'email' => $newInvitation['email'],
                'avatar' => $newInvitation['avatar'] ?? null,
            ]);
            unset($newInvitation['name'], $newInvitation['surname'], $newInvitation['email'], $newInvitation['avatar']);
        }

        return $this->json([
            'invitation' => $newInvitation,
        ]);
    }

    public function actionRevokeInvitation()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $teamId = $data['teamId'] ?? '';
        $invitationId = $data['invitationId'] ?? '';

        if (empty($teamId) || empty($invitationId)) {
            return $this->json(['message' => 'Team ID and invitation ID are required'], 400);
        }

        $teamModel = new TeamModel();
        $userTeamModel = new UserTeamModel();

        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $team = $teamModel->findById($teamId);
        if (!$team || $team['created_by'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $invitationModel = new TeamInvitationModel();
        $invitation = $invitationModel->findById($invitationId);

        if (!$invitation || $invitation['team_id'] !== $teamId) {
            return $this->json(['message' => 'Invitation not found'], 404);
        }

        if (!$invitationModel->deleteById($invitationId)) {
            return $this->json(['message' => 'Failed to revoke invitation'], 500);
        }

        return $this->json([
            'invitationId' => $invitationId,
        ]);
    }

    public function actionKickMember()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $teamId = $data['teamId'] ?? '';
        $memberId = $data['memberId'] ?? '';

        if (empty($teamId) || empty($memberId)) {
            return $this->json(['message' => 'Team ID and member ID are required'], 400);
        }

        if ($userId === $memberId) {
            return $this->json(['message' => 'Cannot kick yourself'], 400);
        }

        $teamModel = new TeamModel();
        $userTeamModel = new UserTeamModel();

        if (!$userTeamModel->isUserInTeam($userId, $teamId)) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $team = $teamModel->findById($teamId);
        if (!$team || $team['created_by'] !== $userId) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        if (!$userTeamModel->isUserInTeam($memberId, $teamId)) {
            return $this->json(['message' => 'User is not a team member'], 400);
        }

        if (!$userTeamModel->deleteByUserAndTeam($memberId, $teamId)) {
            return $this->json(['message' => 'Failed to kick member'], 500);
        }

        return $this->json([
            'memberId' => $memberId,
        ]);
    }

    public function actionAcceptInvitation()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $token = $data['token'] ?? '';

        if (empty($token)) {
            return $this->json(['message' => 'Invitation token is required'], 400);
        }

        $tokenHash = hash('sha256', $token);
        $invitationModel = new TeamInvitationModel();
        $invitation = $invitationModel->findByTokenHash($tokenHash);

        if (!$invitation) {
            return $this->json(['message' => 'Invalid invitation token'], 400);
        }

        if (strtotime($invitation['expires_at']) < time()) {
            $invitationModel->deleteById($invitation['id']);
            return $this->json(['message' => 'Invitation has expired'], 400);
        }

        $userTeamModel = new UserTeamModel();

        if ($userTeamModel->isUserInTeam($invitation['user_id'], $invitation['team_id'])) {
            $invitationModel->deleteById($invitation['id']);
            return $this->json(['message' => 'You are already a member of this team'], 400);
        }

        $userTeamId = Uuid::uuid4()->toString();
        $userTeamData = [
            'id' => $userTeamId,
            'user_id' => $invitation['user_id'],
            'team_id' => $invitation['team_id']
        ];

        if (!$userTeamModel->create($userTeamData)) {
            return $this->json(['message' => 'Failed to join team'], 500);
        }

        $invitationModel->deleteById($invitation['id']);

        $teamModel = new TeamModel();
        $team = $teamModel->findById($invitation['team_id']);
        $team['isAdmin'] = $team['created_by'] === $userId;
        unset($team['created_by'], $team['user_team_id']);

        $team['dashboards'] = (new GroupFromTeamModel())->findByTeamId($team['id']);

        return $this->json([
            'team' => $team
        ]);
    }

    public function actionCancelInvitation()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $token = $data['token'] ?? '';

        if (empty($token)) {
            return $this->json(['message' => 'Invitation token is required'], 400);
        }

        $tokenHash = hash('sha256', $token);
        $invitationModel = new TeamInvitationModel();
        $invitation = $invitationModel->findByTokenHash($tokenHash);

        if (!$invitation) {
            return $this->json(['message' => 'Invalid invitation token'], 400);
        }

        if ($userId !== $invitation['user_id']) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        $invitationModel->deleteById($invitation['id']);

        return $this->json();
    }

    public function actionIsLiveInvitation()
    {
        $data = Request::json();
        $userId = Request::user()['id'];
        $token = $data['token'] ?? '';

        if (empty($token)) {
            return $this->json(['message' => 'Invitation token is required'], 400);
        }

        $tokenHash = hash('sha256', $token);
        $invitationModel = new TeamInvitationModel();
        $invitation = $invitationModel->findByTokenHash($tokenHash);

        if (!$invitation) {
            return $this->json(['message' => 'Invalid invitation token'], 400);
        }

        if ($userId !== $invitation['user_id']) {
            return $this->json(['message' => 'Forbidden'], 403);
        }

        if (strtotime($invitation['expires_at']) < time()) {
            $invitationModel->deleteById($invitation['id']);
            return $this->json(['message' => 'Invitation has expired'], 400);
        }

        $userTeamModel = new UserTeamModel();

        if ($userTeamModel->isUserInTeam($invitation['user_id'], $invitation['team_id'])) {
            $invitationModel->deleteById($invitation['id']);
            return $this->json(['message' => 'You are already a member of this team'], 400);
        }

        return $this->json([
            'isLive' => true
        ]);
    }
}