<?php

namespace App\Core;

abstract class Model
{
    protected string $table;
    protected array $attributes = [];
    protected string $alias = '';

    public function __construct()
    {
        if (!isset($this->table)) {
            $class = (new \ReflectionClass($this))->getShortName();
            $this->table = strtolower(preg_replace('/Model$/', '', $class));
        }
    }

    public function query(): QueryBuilder
    {
        return new QueryBuilder($this->table, $this->alias);
    }

    public function fill(array $data): self
    {
        $this->attributes = $data;
        return $this;
    }

    public function save(): bool
    {
        return $this->query()->insert($this->attributes);
    }

    public function update(array $data, array $conditions): bool
    {
        $qb = $this->query();
        foreach ($conditions as $col => $val) {
            $qb->where($col, '=', $val);
        }
        return $qb->update($data);
    }

    public function delete(array $conditions): bool
    {
        $qb = $this->query();
        foreach ($conditions as $col => $val) {
            $qb->where($col, '=', $val);
        }
        return $qb->delete();
    }

    public function all(): array
    {
        return $this->query()->get();
    }

    public function find($id): ?array
    {
        return $this->query()->where('id', '=', $id)->first();
    }

    public function where(string $col, string $op, $val): QueryBuilder
    {
        return $this->query()->where($col, $op, $val);
    }
}
