<?php

namespace App\Core;

use PDO;

class QueryBuilder
{
    protected PDO $pdo;
    protected string $table;
    protected string $alias = '';
    protected array $select = ['*'];
    protected array $where = [];
    protected array $bindings = [];
    protected ?string $orderBy = null;
    protected ?int $limit = null;
    protected array $joins = [];
    protected array $groupBy = [];

    public function __construct(string $table, string $alias = '')
    {
        $this->pdo = Database::get()->pdo();
        $this->table = $table;
        $this->alias = $alias;
    }

    public function alias(string $alias): self
    {
        $this->alias = $alias;
        return $this;
    }

    public function join(string $table, string $on): self
    {
        $this->joins[] = "JOIN $table ON $on";
        return $this;
    }

    public function leftJoin(string $table, string $on): self
    {
        $this->joins[] = "LEFT JOIN $table ON $on";
        return $this;
    }

    public function groupBy(string ...$columns): self
    {
        $this->groupBy = $columns;
        return $this;
    }

    public function select(array $columns): self
    {
        $this->select = $columns;
        return $this;
    }

    public function where(string $column, string $operator, $value): self
    {
        $this->where[] = "$column $operator ?";
        $this->bindings[] = $value;
        return $this;
    }

    public function orderBy(string $column, string $direction = 'ASC'): self
    {
        $this->orderBy = "$column $direction";
        return $this;
    }

    public function limit(int $limit): self
    {
        $this->limit = $limit;
        return $this;
    }

    public function get(): array
    {
        $sql = 'SELECT ' . implode(', ', $this->select) . ' FROM ' . $this->table;

        if ($this->alias) {
            $sql .= ' ' . $this->alias;
        }

        if (!empty($this->joins)) {
            $sql .= ' ' . implode(' ', $this->joins);
        }
        if (!empty($this->where)) {
            $sql .= ' WHERE ' . implode(' AND ', $this->where);
        }
        if (!empty($this->groupBy)) {
            $sql .= ' GROUP BY ' . implode(', ', $this->groupBy);
        }
        if ($this->orderBy) {
            $sql .= ' ORDER BY ' . $this->orderBy;
        }
        if ($this->limit !== null) {
            $sql .= ' LIMIT ' . $this->limit;
        }

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($this->bindings);
        return $stmt->fetchAll();
    }

    public function first(): ?array
    {
        $this->limit(1);
        $result = $this->get();
        return $result[0] ?? null;
    }

    public function insert(array $data): bool
    {
        $columns = implode(', ', array_keys($data));
        $placeholders = implode(', ', array_fill(0, count($data), '?'));
        $sql = "INSERT INTO {$this->table} ($columns) VALUES ($placeholders)";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute(array_values($data));
    }

    public function update(array $data): bool
    {
        if (empty($this->where)) {
            throw new \Exception("UPDATE without WHERE is not allowed.");
        }

        $sets = implode(', ', array_map(fn($col) => "$col = ?", array_keys($data)));
        $sql = "UPDATE {$this->table} SET $sets WHERE " . implode(' AND ', $this->where);
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([...array_values($data), ...$this->bindings]);
    }

    public function delete(): bool
    {
        if (empty($this->where)) {
            throw new \Exception("DELETE without WHERE is not allowed.");
        }

        $sql = "DELETE FROM {$this->table} WHERE " . implode(' AND ', $this->where);
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($this->bindings);
    }
}
