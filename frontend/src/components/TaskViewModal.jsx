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
                    <Text fw={600} size="lg">{task.title}</Text>
                </Group>
            }
            size="lg"
            centered
        >
            <ScrollArea style={{ maxHeight: '70vh' }}>
                <Stack gap="md">
                    {task.description && (
                        <Box>
                            <Text size="sm" fw={500} mb="xs">Description</Text>
                            <Text size="sm" c="dimmed">{task.description}</Text>
                        </Box>
                    )}

                    <Group grow>
                        <Box>
                            <Text size="sm" fw={500} mb="xs">Status</Text>
                            <Badge color={getStatusColor(task.status)} variant="light">
                                {getStatusLabel(task.status)}
                            </Badge>
                        </Box>
                        <Box>
                            <Text size="sm" fw={500} mb="xs">Priority</Text>
                            <Badge
                                color={getPriorityColor(task.priority)}
                                variant="light"
                                leftSection={<IconFlag size={12} />}
                            >
                                {getPriorityLabel(task.priority)}
                            </Badge>
                        </Box>
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