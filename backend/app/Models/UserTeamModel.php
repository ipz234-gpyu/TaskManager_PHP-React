<?php

namespace App\Models;

use App\Core\Model;

class UserTeamModel extends Model
{
    protected string $table = 'user_teams';
    protected string $alias = 'ut';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function isUserInTeam(string $userId, string $teamId): bool
    {
        $result = $this->query()
            ->where('user_id', '=', $userId)
            ->where('team_id', '=', $teamId)
            ->first();

        return $result !== null;
    }
    public function findById(string $id): ?array
    {
        return $this->query()->where('id', '=', $id)->first();
    }
    public function findByUserAndTeam(string $userId, string $teamId): ?array
    {
        return $this->query()
            ->where('user_id', '=', $userId)
            ->where('team_id', '=', $teamId)
            ->first();
    }
    public function findByUserId(string $userId): array
    {
        return $this->query()->where('user_id', '=', $userId)->get();
    }
    public function findByTeamId(string $teamId): array
    {
        return $this->query()->where('team_id', '=', $teamId)->get();
    }
    public function updateById(string $id, array $data): bool
    {
        return $this->query()->where('id', '=', $id)->update($data);
    }
    public function deleteById(string $id): bool
    {
        $taskAssignmentModel = new TaskAssignmentModel();
        $taskAssignmentModel->deleteByUserTeamId($id);

        return $this->query()->where('id', '=', $id)->delete();
    }
    public function deleteByUserId(string $userId): bool
    {
        $userTeams = $this->findByUserId($userId);
        foreach ($userTeams as $userTeam) {
            $this->deleteById($userTeam['id']);
        }
        return true;
    }
    public function deleteByTeamId(string $teamId): bool
    {
        $userTeams = $this->findByTeamId($teamId);
        foreach ($userTeams as $userTeam) {
            $this->deleteById($userTeam['id']);
        }
        return true;
    }
    public function deleteByUserAndTeam(string $userId, string $teamId): bool
    {
        $userTeam = $this->findByUserAndTeam($userId, $teamId);
        if ($userTeam) {
            return $this->deleteById($userTeam['id']);
        }
        return true;
    }
}