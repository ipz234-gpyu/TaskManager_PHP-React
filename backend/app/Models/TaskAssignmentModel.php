<?php

namespace App\Models;

use App\Core\Model;

class TaskAssignmentModel extends Model
{
    protected string $table = 'task_assignments';
    protected string $alias = 'ta';

    public function create(array $data): bool
    {
        return $this->query()->insert($data);
    }
    public function findByUserTeamId(string $userTeamId): array
    {
        return $this->query()->where('user_team_id', '=', $userTeamId)->get();
    }
    public function findByTaskId(string $taskId): array
    {
        return $this->query()->where('task_id', '=', $taskId)->get();
    }
    public function findByUserTeamAndTask(string $userTeamId, string $taskId): ?array
    {
        return $this->query()
            ->where('user_team_id', '=', $userTeamId)
            ->where('task_id', '=', $taskId)
            ->first();
    }
    public function findAssignedUsers(string $taskId): array
    {
        return $this->query()
            ->select(['u.id', 'u.name', 'u.surname', 'u.email', 'ut.id as user_team_id'])
            ->join('user_teams ut', 'ut.id = ta.user_team_id')
            ->join('users u', 'u.id = ut.user_id')
            ->where('ta.task_id', '=', $taskId)
            ->get();
    }
    public function findAssignedUserIds(string $taskId): array
    {
        return array_column(
            $this->query()
                ->select(['u.id'])
                ->join('user_teams ut', 'ut.id = ta.user_team_id')
                ->join('users u', 'u.id = ut.user_id')
                ->where('ta.task_id', '=', $taskId)
                ->get(),
            'id'
        );
    }
    public function findAssignedTasks(string $userTeamId): array
    {
        return $this->query()
            ->select(['t.id', 't.title', 't.description', 't.start_time', 't.deadline', 't.notification', 't.priority', 't.status', 't.parent_task_id'])
            ->join('tasks t', 't.id = ta.task_id')
            ->where('ta.user_team_id', '=', $userTeamId)
            ->orderBy('t.priority')
            ->get();
    }
    public function deleteByUserTeamId(string $userTeamId): bool
    {
        return $this->query()->where('user_team_id', '=', $userTeamId)->delete();
    }
    public function deleteByTaskId(string $taskId): bool
    {
        return $this->query()->where('task_id', '=', $taskId)->delete();
    }
    public function deleteByUserTeamAndTask(string $userTeamId, string $taskId): bool
    {
        return $this->query()
            ->where('user_team_id', '=', $userTeamId)
            ->where('task_id', '=', $taskId)
            ->delete();
    }
}