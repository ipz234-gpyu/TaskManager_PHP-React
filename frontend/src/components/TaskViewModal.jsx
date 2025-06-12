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
    ScrollArea, Title,
} from '@mantine/core';
import {
    IconEdit,
    IconTrash,
    IconCalendar,
    IconClock,
    IconAlarm,
} from '@tabler/icons-react';
import SubtaskSection from './SubtaskSection';
import {
    formatDate,
    getPriorityColor,
    getPriorityLabel,
    getStatusColor,
    getStatusLabel,
} from '../utils/taskUtils';

export default function TaskViewModal({
                                          opened,
                                          onClose,
                                          task,
                                          onEdit,
                                          onDelete,
                                          onStatusToggle,
                                          onError,
                                          OptionalChild
                                      }) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={
                <Group align="center">
                    <Checkbox
                        checked={task.status === 'completed'}
                        onChange={onStatusToggle}
                        size="lg"
                        color="green"
                    />
                    <Title order={2}>{task.title}</Title>
                    <Badge size="lg" color={`${getStatusColor(task.status)}`}>
                        {getStatusLabel(task.status)}
                    </Badge>
                    <Badge size="lg" color={getPriorityColor(task.priority)}>
                        {getPriorityLabel(task.priority)}
                    </Badge>
                </Group>
            }
            size="lg"
            centered
        >
            <ScrollArea style={{maxHeight: '80vh'}}>
                <Group grow>
                    <Stack gap={10}>
                        {task.description && (
                            <Box style={{ wordBreak: 'break-word' }}>
                                <Title order={3}>Description:</Title>
                                <Text size="sm">{task.description}</Text>
                            </Box>
                        )}

                        {(task.start_time || task.deadline || task.notification) && (
                            <Box>
                                <Title order={3}>Timeline:</Title>
                                <Stack gap="xs">
                                    {task.start_time && (
                                        <Group align="center" gap="xs">
                                            <IconClock size={20}/>
                                            <Text size="lg">Start: {formatDate(task.start_time)}</Text>
                                        </Group>
                                    )}
                                    {task.deadline && (
                                        <Group align="center" gap="xs">
                                            <IconCalendar size={20}/>
                                            <Text size="lg">Due: {formatDate(task.deadline)}</Text>
                                        </Group>
                                    )}
                                    {task.notification && (
                                        <Group align="center" gap="xs">
                                            <IconAlarm size={20}/>
                                            <Text size="lg">Reminder: {formatDate(task.notification)}</Text>
                                        </Group>
                                    )}
                                </Stack>
                            </Box>
                        )}
                    </Stack>
                    {OptionalChild &&
                        <Stack>
                            {OptionalChild}
                        </Stack>
                    }
                </Group>

                <SubtaskSection task={task} onError={onError}/>

            </ScrollArea>
            <Group justify="flex-end" pt="md">
                <Button
                    variant="light"
                    leftSection={<IconEdit size={20}/>}
                    onClick={onEdit}
                >
                    Edit Task
                </Button>
                <Button
                    variant="light"
                    color="red"
                    leftSection={<IconTrash size={20}/>}
                    onClick={onDelete}
                >
                    Delete Task
                </Button>
            </Group>
        </Modal>
    );
}