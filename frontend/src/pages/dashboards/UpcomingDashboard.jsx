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
    IconCalendarUp,
    IconClock,
    IconStar,
    IconCheck,
    IconCalendar
} from '@tabler/icons-react';

function UpcomingDashboard() {
    // Мок дані для майбутніх завдань
    const upcomingTasks = [
        {
            id: 1,
            title: 'Project deadline',
            date: '2025-06-10',
            time: '23:59',
            priority: 'high',
            category: 'Work',
            daysUntil: 3
        },
        {
            id: 2,
            title: 'Doctor appointment',
            date: '2025-06-12',
            time: '10:00',
            priority: 'medium',
            category: 'Health',
            daysUntil: 5
        },
        {
            id: 3,
            title: 'Birthday party',
            date: '2025-06-15',
            time: '19:00',
            priority: 'low',
            category: 'Personal',
            daysUntil: 8
        },
        {
            id: 4,
            title: 'Quarterly review',
            date: '2025-06-20',
            time: '14:00',
            priority: 'high',
            category: 'Work',
            daysUntil: 13
        },
        {
            id: 5,
            title: 'Vacation trip',
            date: '2025-07-01',
            time: '08:00',
            priority: 'medium',
            category: 'Travel',
            daysUntil: 24
        }
    ];

    const thisWeek = upcomingTasks.filter(task => task.daysUntil <= 7);
    const nextWeek = upcomingTasks.filter(task => task.daysUntil > 7 && task.daysUntil <= 14);
    const later = upcomingTasks.filter(task => task.daysUntil > 14);

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'red';
            case 'medium': return 'yellow';
            case 'low': return 'green';
            default: return 'gray';
        }
    };

    const getUrgencyColor = (daysUntil) => {
        if (daysUntil <= 3) return 'red';
        if (daysUntil <= 7) return 'yellow';
        return 'green';
    };

    const TaskCard = ({ task }) => (
        <Card
            key={task.id}
            padding="md"
            radius="md"
            withBorder
            className="transition-all duration-200 hover:shadow-md"
        >
            <Group justify="space-between" align="flex-start">
                <div className="flex-1">
                    <Group gap="sm" align="center" className="mb-2">
                        <Text size="sm" fw={500}>
                            {task.title}
                        </Text>
                    </Group>

                    <Group gap="xs" className="mb-2">
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
                        <Badge
                            size="xs"
                            color={getUrgencyColor(task.daysUntil)}
                            variant="light"
                        >
                            {task.daysUntil} days left
                        </Badge>
                    </Group>

                    <Group gap="xs" align="center">
                        <IconCalendar size={12} />
                        <Text size="xs" c="dimmed">
                            {new Date(task.date).toLocaleDateString()}
                        </Text>
                        <IconClock size={12} />
                        <Text size="xs" c="dimmed">
                            {task.time}
                        </Text>
                    </Group>
                </div>

                <ActionIcon
                    size="sm"
                    variant="outline"
                    color="green"
                    onClick={() => console.log('Mark as done:', task.id)}
                >
                    <IconCheck size={14} />
                </ActionIcon>
            </Group>
        </Card>
    );

    const TaskSection = ({ title, tasks, icon: Icon }) => (
        <div className="mb-8">
            <Group align="center" className="mb-4">
                <Icon size={20} />
                <Title order={3}>{title}</Title>
                <Badge size="sm" variant="light">
                    {tasks.length}
                </Badge>
            </Group>

            {tasks.length > 0 ? (
                <Stack gap="sm">
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} />
                    ))}
                </Stack>
            ) : (
                <Paper p="md" radius="md" withBorder className="text-center">
                    <Text c="dimmed">No tasks in this period</Text>
                </Paper>
            )}
        </div>
    );

    return (
        <Container size="xl" className="py-6">
            <div className="mb-6">
                <Group align="center" className="mb-4">
                    <IconCalendarUp size={28} />
                    <Title order={1}>Upcoming</Title>
                    <Badge size="lg" variant="light" color="blue">
                        {upcomingTasks.length} tasks
                    </Badge>
                </Group>
                <Text c="dimmed">
                    All your upcoming tasks and deadlines
                </Text>
            </div>

            {/* Статистика */}
            <Group grow className="mb-6">
                <Paper p="md" radius="md" withBorder>
                    <Group align="center">
                        <IconClock size={20} />
                        <div>
                            <Text size="lg" fw={700}>
                                {thisWeek.length}
                            </Text>
                            <Text size="sm" c="dimmed">
                                This Week
                            </Text>
                        </div>
                    </Group>
                </Paper>

                <Paper p="md" radius="md" withBorder>
                    <Group align="center">
                        <IconCalendarUp size={20} />
                        <div>
                            <Text size="lg" fw={700}>
                                {nextWeek.length}
                            </Text>
                            <Text size="sm" c="dimmed">
                                Next Week
                            </Text>
                        </div>
                    </Group>
                </Paper>

                <Paper p="md" radius="md" withBorder>
                    <Group align="center">
                        <IconStar size={20} />
                        <div>
                            <Text size="lg" fw={700}>
                                {upcomingTasks.filter(t => t.priority === 'high').length}
                            </Text>
                            <Text size="sm" c="dimmed">
                                High Priority
                            </Text>
                        </div>
                    </Group>
                </Paper>
            </Group>

            {/* Секції завдань */}
            <TaskSection
                title="This Week"
                tasks={thisWeek}
                icon={IconClock}
            />

            <TaskSection
                title="Next Week"
                tasks={nextWeek}
                icon={IconCalendarUp}
            />

            <TaskSection
                title="Later"
                tasks={later}
                icon={IconCalendar}
            />
        </Container>
    );
}

export default UpcomingDashboard;