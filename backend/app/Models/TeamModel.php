<?php


namespace App\Models;

use App\Core\Model;

class TeamModel extends Model
{
    protected string $table = 'teams';
    protected string $alias = 't';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findById(string $id): ?array
    {
        return $this->query()->where('id', '=', $id)->first();
    }
    public function findAll(): array
    {
        return $this->query()->get();
    }
    public function findAllByUserId(string $userId): array
    {
        return $this->query()
            ->select(['t.id', 't.name', 't.created_by', 'ut.id AS user_team_id'])
            ->alias('t')
            ->leftJoin('user_teams ut', 'ut.team_id = t.id')
            ->where('ut.user_id', '=', $userId)
            ->get();
    }
    public function updateById(string $id, array $data): bool
    {
        return $this->query()->where('id', '=', $id)->update($data);
    }
    public function updateCreatedBy(string $userId, $newCreatedBy): bool
    {
        return $this->query()->where('created_by', '=', $userId)->update(['created_by' => $newCreatedBy]);
    }
    public function deleteById(string $id): bool
    {
        $teamInvitationModel = new TeamInvitationModel();
        $teamInvitationModel->deleteByTeamId($id);

        $userTeamModel = new UserTeamModel();
        $userTeams = $userTeamModel->findByTeamId($id);
        foreach ($userTeams as $userTeam) {
            $taskAssignmentModel = new TaskAssignmentModel();
            $taskAssignmentModel->deleteByUserTeamId($userTeam['id']);
        }

        $userTeamModel->deleteByTeamId($id);

        $groupFromTeamModel = new GroupFromTeamModel();
        $groupFromTeamModel->deleteByTeamId($id);

        return $this->query()->where('id', '=', $id)->delete();
    }
}