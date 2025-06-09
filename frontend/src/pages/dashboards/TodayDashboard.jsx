import React from 'react';
import {
    Container,
    Title,
    Text,
    Paper,
    Group,
    Badge,
    Stack,
    Card,
    ActionIcon,
    Divider
} from '@mantine/core';
import {
    IconCalendar,
    IconClock,
    IconStar,
    IconCheck,
    IconPlus
} from '@tabler/icons-react';

function TodayDashboard() {
    // Мок дані для демонстрації
    const todayTasks = [
        {
            id: 1,
            title: 'Review project proposal',
            time: '09:00',
            priority: 'high',
            completed: false,
            category: 'Work'
        },
        {
            id: 2,
            title: 'Team meeting',
            time: '14:00',
            priority: 'medium',
            completed: false,
            category: 'Work'
        },
        {
            id: 3,
            title: 'Grocery shopping',
            time: '18:00',
            priority: 'low',
            completed: true,
            category: 'Personal'
        },
        {
            id: 4,
            title: 'Call dentist',
            time: '16:30',
            priority: 'medium',
            completed: false,
            category: 'Health'
        },
        {
            id: 5,
            title: 'Finish React component',
            time: '20:00',
            priority: 'high',
            completed: false,
            category: 'Development'
        }
    ];

    const completedTasks = todayTasks.filter(task => task.completed);
    const pendingTasks = todayTasks.filter(task => !task.completed);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'red';
            case 'medium': return 'yellow';
            case 'low': return 'green';
            default: return 'gray';
        }
    };

    const TaskCard = ({ task }) => (
        <Card
            key={task.id}
            padding="md"
            radius="md"
            withBorder
            className={`transition-all duration-200 hover:shadow-md ${task.completed ? 'opacity-60' : ''}`}
        >
            <Group justify="space-between" align="flex-start">
                <div className="flex-1">
                    <Group gap="sm" align="center" className="mb-2">
                        <ActionIcon
                            size="sm"
                            variant={task.completed ? 'filled' : 'outline'}
                            color="green"
                            onClick={() => console.log('Toggle task:', task.id)}
                        >
                            <IconCheck size={14} />
                        </ActionIcon>
                        <Text
                            size="sm"
                            fw={500}
                            td={task.completed ? 'line-through' : 'none'}
                        >
                            {task.title}
                        </Text>
                    </Group>

                    <Group gap="xs" className="ml-8">
                        <Badge
                            size="xs"
                            color={getPriorityColor(task.priority)}
                            variant="light"
                        >
                            {task.priority}
                        </Badge>
                        <Badge size="xs" variant="outline">
                            {task.category}
                        </Badge>
                    </Group>
                </div>

                <Group gap="xs" align="center">
                    <IconClock size={14} />
                    <Text size="sm" c="dimmed">
                        {task.time}
                    </Text>
                </Group>
            </Group>
        </Card>
    );

    return (
        <Container size="xl" className="py-6">
            <div className="mb-6">
                <Group align="center" className="mb-4">
                    <IconCalendar size={28} />
                    <Title order={1}>Today</Title>
                    <Badge size="lg" variant="light" color="blue">
                        {todayTasks.length} tasks
                    </Badge>
                </Group>
                <Text c="dimmed">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </Text>
            </div>

            {/* Статистика */}
            <Group grow className="mb-6">
                <Paper p="md" radius="md" withBorder>
                    <Group align="center">
                        <IconCheck size={20} />
                        <div>
                            <Text size="lg" fw={700}>
                                {completedTasks.length}
                            </Text>
                            <Text size="sm" c="dimmed">
                                Completed
                            </Text>
                        </div>
                    </Group>
                </Paper>

                <Paper p="md" radius="md" withBorder>
                    <Group align="center">
                        <IconClock size={20} />
                        <div>
                            <Text size="lg" fw={700}>
                                {pendingTasks.length}
                            </Text>
                            <Text size="sm" c="dimmed">
                                Pending
                            </Text>
                        </div>
                    </Group>
                </Paper>

                <Paper p="md" radius="md" withBorder>
                    <Group align="center">
                        <IconStar size={20} />
                        <div>
                            <Text size="lg" fw={700}>
                                {pendingTasks.filter(t => t.priority === 'high').length}
                            </Text>
                            <Text size="sm" c="dimmed">
                                High Priority
                            </Text>
                        </div>
                    </Group>
                </Paper>
            </Group>

            {/* Завдання */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Поточні завдання */}
                <div>
                    <Group justify="space-between" className="mb-4">
                        <Title order={3}>Pending Tasks</Title>
                        <ActionIcon variant="light" size="sm">
                            <IconPlus size={16} />
                        </ActionIcon>
                    </Group>
                    <Stack gap="sm">
                        {pendingTasks.map(task => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                        {pendingTasks.length === 0 && (
                            <Paper p="xl" radius="md" withBorder className="text-center">
                                <IconCheck size={48} className="mx-auto mb-4 opacity-50" />
                                <Text c="dimmed">
                                    All tasks completed! Great job! 🎉
                                </Text>
                            </Paper>
                        )}
                    </Stack>
                </div>

                {/* Виконані завдання */}
                {completedTasks.length > 0 && (
                    <div>
                        <Title order={3} className="mb-4">
                            Completed Tasks
                        </Title>
                        <Stack gap="sm">
                            {completedTasks.map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </Stack>
                    </div>
                )}
            </div>
        </Container>
    );
}

export default TodayDashboard;