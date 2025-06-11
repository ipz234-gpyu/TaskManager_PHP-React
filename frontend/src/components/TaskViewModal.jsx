import React from 'react';
import {
    Modal,
    Group,
    Text,
    Stack,
    Box,
    Badge,
    Button,
    Checkbox,
    ScrollArea,
} from '@mantine/core';
import {
    IconEdit,
    IconTrash,
    IconCalendar,
    IconClock,
    IconAlarm,
    IconFlag,
} from '@tabler/icons-react';
import SubtaskSection from './SubtaskSection';
import { formatDate, getPriorityColor, getPriorityLabel, getStatusColor, getStatusLabel, isOverdue } from '../utils/taskUtils';

export default function TaskViewModal({
                                          opened,
                                          onClose,
                                          task,
                                          onEdit,
                                          onDelete,
                                          onStatusToggle,
                                          onError
                                      }) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group>
                    <Checkbox
                        checked={task.status === 'completed'}
                        onChange={onStatusToggle}
                        size="md"
                        color="green"
                    />
                    <Text fw={700} size="xl">{task.title}</Text>
                </Group>
            }
            size="lg"
            centered
        >
            <ScrollArea style={{ maxHeight: '70vh' }}>
                <Stack gap="md">
                    {task.description && (
                        <Group>
                            <Text size="xl">Description:</Text>
                            <Text size="xl" c="dimmed">{task.description}</Text>
                        </Group>
                    )}

                    <Group grow>
                        <Group>
                            <Text size="xl">Status:</Text>
                            <Badge size="lg" color={`${getStatusColor(task.status)}`}>
                                {getStatusLabel(task.status)}
                            </Badge>
                        </Group>
                        <Group >
                            <Text size="xl">Priority:</Text>
                            <Badge size="lg" color={getPriorityColor(task.priority)}>
                                {getPriorityLabel(task.priority)}
                            </Badge>
                        </Group>
                    </Group>

                    {(task.start_time || task.deadline || task.notification) && (
                        <Box>
                            <Text size="sm" fw={500} mb="xs">Timeline</Text>
                            <Stack gap="xs">
                                {task.start_time && (
                                    <Group gap="xs">
                                        <IconClock size={14} />
                                        <Text size="sm">Start: {formatDate(task.start_time)}</Text>
                                    </Group>
                                )}
                                {task.deadline && (
                                    <Group gap="xs">
                                        <IconCalendar size={14} color={isOverdue(task.deadline, task.status) ? 'red' : undefined} />
                                        <Text size="sm" c={isOverdue(task.deadline, task.status) ? 'red' : undefined}>
                                            Due: {formatDate(task.deadline)}
                                        </Text>
                                    </Group>
                                )}
                                {task.notification && (
                                    <Group gap="xs">
                                        <IconAlarm size={14} />
                                        <Text size="sm">Reminder: {formatDate(task.notification)}</Text>
                                    </Group>
                                )}
                            </Stack>
                        </Box>
                    )}

                    <SubtaskSection task={task} onError={onError} />

                    <Group justify="space-between" pt="md">
                        <Button
                            variant="light"
                            leftSection={<IconEdit size={16} />}
                            onClick={onEdit}
                        >
                            Edit Task
                        </Button>
                        <Button
                            variant="light"
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            onClick={onDelete}
                        >
                            Delete Task
                        </Button>
                    </Group>
                </Stack>
            </ScrollArea>
        </Modal>
    );
}