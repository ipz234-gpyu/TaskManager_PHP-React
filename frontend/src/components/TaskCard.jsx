import React, { useState } from 'react';
import {
    Paper,
    Text,
    Group,
    ActionIcon,
    Badge,
    Stack,
    Checkbox, Box,
} from '@mantine/core';
import {
    IconEdit,
    IconTrash,
    IconCalendar,
    IconClock,
    IconAlarm,
    IconSubtask,
} from '@tabler/icons-react';
import { useDisclosure } from "@mantine/hooks";
import TaskViewModal from './TaskViewModal';
import TaskEditModal from './TaskEditModal';
import { formatDate, getPriorityColor, isOverdue } from '../utils/taskUtils';

export default function TaskCard({
                                     task,
                                     listId,
                                     onError,
                                     onStatusToggle,
                                     onDelete,
                                     onUpdate,
                                     children,
                                     OptionalChild
                                 }) {
    const [viewModalOpened, {open: openViewModal, close: closeViewModal}] = useDisclosure(false);
    const [editModalOpened, {open: openEditModal, close: closeEditModal}] = useDisclosure(false);
    const [isCompleting, setIsCompleting] = useState(false);

    const handleStatusToggle = async (e) => {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (isCompleting) return;

        setIsCompleting(true);
        try {
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            await onStatusToggle(task.id, newStatus);
        } catch (error) {
            console.error('Error updating task status:', error);
            onError?.('Failed to update task status');
        } finally {
            setIsCompleting(false);
        }
    };

    const handleDelete = async () => {
        try {
            await onDelete(task.id);
        } catch (error) {
            console.error('Error deleting task:', error);
            onError?.('Failed to delete task');
        }
    };

    const handleEditSave = async (updatedTask) => {
        try {
            await onUpdate(task.id, updatedTask);
            closeEditModal();
        } catch (error) {
            console.error('Error updating task:', error);
            onError?.('Failed to update task');
        }
    };

    const handleEditClick = (e) => {
        e.stopPropagation();
        closeViewModal();
        openEditModal();
    };

    const mockSubtasks = task.subtasks || [];

    return (
        <>
            <Paper
                p="sm"
                radius="md"
                shadow="xs"
                style={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    opacity: task.status === 'completed' ? 0.7 : 1,
                    borderLeft: `4px solid var(--mantine-color-${getPriorityColor(task.priority)}-5)`,
                }}
                onClick={openViewModal}
            >
                <Group justify="apart" align="flex-start" wrap="nowrap">
                    <Group align="flex-start" gap="sm" style={{flex: 1, minWidth: 0}}>
                        <Checkbox
                            checked={task.status === 'completed'}
                            onChange={handleStatusToggle}
                            onClick={handleStatusToggle}
                            disabled={isCompleting}
                            size="md"
                            color="green"
                        />

                        <Stack gap="xs" style={{flex: 1, minWidth: 0}}>
                            <Group align="center" justify="space-between">
                                <Text
                                    size="md"
                                    fw={700}
                                    style={{
                                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                                        wordBreak: 'break-word'
                                    }}
                                >
                                    {task.title}
                                </Text>

                                <Group gap={1} align="center">
                                    <ActionIcon size="md" variant="subtle" radius="lg"
                                                onClick={handleEditClick}
                                    >
                                        <IconEdit size={20}/>
                                    </ActionIcon>
                                    {task.status === 'completed' &&
                                        <ActionIcon size="md" variant="subtle" color="red" radius="lg"
                                                    onClick={() => handleDelete()}
                                        >
                                            <IconTrash size={20}/>
                                        </ActionIcon>
                                    }
                                </Group>
                            </Group>

                            {task.description && (
                                <Text
                                    size="sm"
                                    c="dimmed"
                                    lineClamp={2}
                                    style={{wordBreak: 'break-word'}}
                                >
                                    {task.description}
                                </Text>
                            )}

                            <Group gap="xs" wrap="wrap">
                                {task.deadline && (
                                    <Badge
                                        color={isOverdue(task.deadline, task.status) ? 'red' : 'blue'}
                                        variant="light"
                                        leftSection={<IconCalendar size={16}/>}
                                    >
                                        {formatDate(task.deadline)}
                                    </Badge>
                                )}

                                {task.start_time && (
                                    <Badge
                                        color="gray"
                                        variant="light"
                                        leftSection={<IconClock size={16}/>}
                                    >
                                        {formatDate(task.start_time)}
                                    </Badge>
                                )}

                                {task.notification && (
                                    <Badge
                                        color="orange"
                                        variant="light"
                                        leftSection={<IconAlarm size={16}/>}
                                    >
                                        Reminder
                                    </Badge>
                                )}

                                {mockSubtasks.length > 0 && (
                                    <Badge
                                        size="xs"
                                        color="purple"
                                        variant="light"
                                        leftSection={<IconSubtask size={10}/>}
                                    >
                                        {mockSubtasks.length} subtasks
                                    </Badge>
                                )}
                            </Group>

                            {children !== undefined &&
                                <Box>
                                    {children}
                                </Box>
                            }
                        </Stack>
                    </Group>
                </Group>
            </Paper>

            <TaskViewModal
                opened={viewModalOpened}
                onClose={closeViewModal}
                task={task}
                onEdit={handleEditClick}
                onDelete={handleDelete}
                onStatusToggle={handleStatusToggle}
                onError={onError}
                OptionalChild={OptionalChild}
            />

            <TaskEditModal
                opened={editModalOpened}
                onClose={closeEditModal}
                task={task}
                onSave={handleEditSave}
            />
        </>
    );
}