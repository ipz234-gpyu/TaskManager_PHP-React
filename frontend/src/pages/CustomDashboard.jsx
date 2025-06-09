import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    Button,
    TextInput,
    Textarea,
    Modal,
    Select,
    Alert
} from '@mantine/core';
import {
    IconDashboard,
    IconPlus,
    IconEdit,
    IconTrash,
    IconCheck,
    IconClock,
    IconAlertCircle,
    IconSettings
} from '@tabler/icons-react';

function CustomDashboard() {
    const { dashboardId } = useParams();
    const [dashboard, setDashboard] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [modalOpened, setModalOpened] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [taskForm, setTaskForm] = useState({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        dueDate: ''
    });

    // Завантаження даних дашборда та завдань
    useEffect(() => {
        loadDashboardData();
        loadTasks();
    }, [dashboardId]);

    const loadDashboardData = () => {
        try {
            const savedDashboards = JSON.parse(localStorage.getItem('customDashboards') || '[]');
            const currentDashboard = savedDashboards.find(d => d.id === dashboardId);

            if (currentDashboard) {
                setDashboard(currentDashboard);
            } else {
                // Якщо дашборд не знайдено, створюємо базовий
                setDashboard({
                    id: dashboardId,
                    label: dashboardId.charAt(0).toUpperCase() + dashboardId.slice(1).replace(/-/g, ' '),
                    count: 0,
                    isCustom: true
                });
            }
        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    };

    const loadTasks = () => {
        try {
            const savedTasks = JSON.parse(localStorage.getItem(`tasks_${dashboardId}`) || '[]');
            setTasks(savedTasks);
        } catch (error) {
            console.error('Error loading tasks:', error);
            setTasks([]);
        }
    };

    const saveTasks = (newTasks) => {
        try {
            localStorage.setItem(`tasks_${dashboardId}`, JSON.stringify(newTasks));
            setTasks(newTasks);

            // Оновлюємо кількість завдань в дашборді
            const savedDashboards = JSON.parse(localStorage.getItem('customDashboards') || '[]');
            const updatedDashboards = savedDashboards.map(d =>
                d.id === dashboardId
                    ? { ...d, count: newTasks.filter(t => !t.completed).length }
                    : d
            );
            localStorage.setItem('customDashboards', JSON.stringify(updatedDashboards));
        } catch (error) {
            console.error('Error saving tasks:', error);
        }
    };

    const handleAddTask = () => {
        setEditingTask(null);
        setTaskForm({
            title: '',
            description: '',
            priority: 'medium',
            category: '',
            dueDate: ''
        });
        setModalOpened(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setTaskForm({
            title: task.title,
            description: task.description || '',
            priority: task.priority,
            category: task.category || '',
            dueDate: task.dueDate || ''
        });
        setModalOpened(true);
    };

    const handleSaveTask = () => {
        if (!taskForm.title.trim()) return;

        const newTask = {
            id: editingTask ? editingTask.id : Date.now(),
            title: taskForm.title.trim(),
            description: taskForm.description.trim(),
            priority: taskForm.priority,
            category: taskForm.category.trim(),
            dueDate: taskForm.dueDate,
            completed: editingTask ? editingTask.completed : false,
            createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        let newTasks;
        if (editingTask) {
            newTasks = tasks.map(t => t.id === editingTask.id ? newTask : t);
        } else {
            newTasks = [...tasks, newTask];
        }

        saveTasks(newTasks);
        setModalOpened(false);
    };

    const handleToggleTask = (taskId) => {
        const newTasks = tasks.map(task =>
            task.id === taskId
                ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
                : task
        );
        saveTasks(newTasks);
    };

    const handleDeleteTask = (taskId) => {
        if (confirm('Are you sure you want to delete this task?')) {
            const newTasks = tasks.filter(task => task.id !== taskId);
            saveTasks(newTasks);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'red';
            case 'medium': return 'yellow';
            case 'low': return 'green';
            default: return 'gray';
        }
    };

    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);

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
                            onClick={() => handleToggleTask(task.id)}
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

                    {task.description && (
                        <Text size="xs" c="dimmed" className="ml-8 mb-2">
                            {task.description}
                        </Text>
                    )}

                    <Group gap="xs" className="ml-8">
                        <Badge
                            size="xs"
                            color={getPriorityColor(task.priority)}
                            variant="light"
                        >
                            {task.priority}
                        </Badge>
                        {task.category && (
                            <Badge size="xs" variant="outline">
                                {task.category}
                            </Badge>
                        )}
                        {task.dueDate && (
                            <Group gap={2}>
                                <IconClock size={12} />
                                <Text size="xs" c="dimmed">
                                    {new Date(task.dueDate).toLocaleDateString()}
                                </Text>
                            </Group>
                        )}
                    </Group>
                </div>

                <Group gap="xs">
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        onClick={() => handleEditTask(task)}
                    >
                        <IconEdit size={14} />
                    </ActionIcon>
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="red"
                        onClick={() => handleDeleteTask(task.id)}
                    >
                        <IconTrash size={14} />
                    </ActionIcon>
                </Group>
            </Group>
        </Card>
    );

    if (!dashboard) {
        return (
            <Container size="xl" className="py-6">
                <Alert icon={<IconAlertCircle size="1rem" />} title="Dashboard not found" color="red">
                    The requested dashboard could not be found.
                </Alert>
            </Container>
        );
    }

    return (
        <>
            <Container size="xl" className="py-6">
                <div className="mb-6">
                    <Group align="center" className="mb-4">
                        <IconDashboard size={28} />
                        <Title order={1}>{dashboard.label}</Title>
                        <Badge size="lg" variant="light" color="blue">
                            {tasks.length} tasks
                        </Badge>
                    </Group>
                    <Text c="dimmed">
                        Custom dashboard for {dashboard.label.toLowerCase()}
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
                            <IconAlertCircle size={20} />
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
                            <Button
                                variant="light"
                                size="sm"
                                leftSection={<IconPlus size={16} />}
                                onClick={handleAddTask}
                            >
                                Add Task
                            </Button>
                        </Group>
                        <Stack gap="sm">
                            {pendingTasks.map(task => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                            {pendingTasks.length === 0 && (
                                <Paper p="xl" radius="md" withBorder className="text-center">
                                    <IconCheck size={48} className="mx-auto mb-4 opacity-50" />
                                    <Text c="dimmed" className="mb-4">
                                        {tasks.length === 0
                                            ? "No tasks yet. Add your first task!"
                                            : "All tasks completed! Great job! 🎉"
                                        }
                                    </Text>
                                    <Button
                                        variant="light"
                                        leftSection={<IconPlus size={16} />}
                                        onClick={handleAddTask}
                                    >
                                        Add Task
                                    </Button>
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

            {/* Модальне вікно для додавання/редагування завдання */}
            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title={editingTask ? 'Edit Task' : 'Add New Task'}
                size="md"
            >
                <Stack gap="md">
                    <TextInput
                        label="Task Title"
                        placeholder="Enter task title"
                        value={taskForm.title}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                        required
                    />

                    <Textarea
                        label="Description"
                        placeholder="Enter task description (optional)"
                        value={taskForm.description}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                        minRows={2}
                    />

                    <Select
                        label="Priority"
                        value={taskForm.priority}
                        onChange={(value) => setTaskForm(prev => ({ ...prev, priority: value }))}
                        data={[
                            { value: 'low', label: 'Low' },
                            { value: 'medium', label: 'Medium' },
                            { value: 'high', label: 'High' }
                        ]}
                    />

                    <TextInput
                        label="Category"
                        placeholder="Enter category (optional)"
                        value={taskForm.category}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, category: e.target.value }))}
                    />

                    <TextInput
                        label="Due Date"
                        type="date"
                        value={taskForm.dueDate}
                        onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    />

                    <Group justify="flex-end" gap="sm">
                        <Button variant="outline" onClick={() => setModalOpened(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveTask} disabled={!taskForm.title.trim()}>
                            {editingTask ? 'Update' : 'Add'} Task
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}

export default CustomDashboard;