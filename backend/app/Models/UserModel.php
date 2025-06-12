<?php

namespace App\Models;

use App\Core\Model;
use App\Helpers\UrlHelper;

class UserModel extends Model
{
    protected string $table = 'users';
    protected string $alias = 'u';

    public static function formatBasicUser(array $user): array
    {
        return [
            'id' => $user['id'],
            'name' => $user['name'],
            'surname' => $user['surname'],
            'email' => $user['email'],
            'avatar' => UrlHelper::formatUserAvatar($user['avatar']),
        ];
    }

    public static function formatBasicUserForTeam(array $user): array
    {
        return [
            'id' => $user['id'],
            'name' => $user['name'],
            'surname' => $user['surname'],
            'avatar' => UrlHelper::formatUserAvatar($user['avatar']),
        ];
    }

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findByEmail(string $email): ?array
    {
        return $this->query()->where('email', '=', $email)->first();
    }
    public function findById(string $id): ?array
    {
        return $this->query()->where('id', '=', $id)->first();
    }
    public function findAll(): array
    {
        return $this->query()->get();
    }
    public function findAllByTeamId(string $teamId): array
    {
        return $this->query()
            ->select(['u.*'])
            ->join('user_teams ut', 'ut.user_id = u.id')
            ->where('ut.team_id', '=', $teamId)
            ->get();
    }
    public function updateById(string $id, array $data): bool
    {
        return $this->query()->where('id', '=', $id)->update($data);
    }
    public function deleteById(string $id): bool
    {
        $refreshTokenModel = new UserRefreshTokenModel();
        $refreshTokenModel->deleteByUserId($id);

        $teamInvitationModel = new TeamInvitationModel();
        $teamInvitationModel->deleteByUserId($id);

        $userTeamModel = new UserTeamModel();
        $userTeams = $userTeamModel->findByUserId($id);
        foreach ($userTeams as $userTeam) {
            $taskAssignmentModel = new TaskAssignmentModel();
            $taskAssignmentModel->deleteByUserTeamId($userTeam['id']);
        }

        $userTeamModel->deleteByUserId($id);

        $groupFromUserModel = new GroupFromUserModel();
        $groupFromUserModel->deleteByUserId($id);

        $tagModel = new TagsModel();
        $tagModel->deleteByUserId($id);

        $teamModel = new TeamModel();
        $teamModel->updateCreatedBy($id, null);

        return $this->query()->where('id', '=', $id)->delete();
    }
}