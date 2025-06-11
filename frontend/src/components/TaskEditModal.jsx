import React from 'react';
import {
    Modal,
    Stack,
    TextInput,
    Textarea,
    Button,
    Select,
    Group,
    ActionIcon,
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from "@mantine/form";
import { IconX } from '@tabler/icons-react';

export default function TaskEditModal({ opened, onClose, task, onSave }) {
    const editForm = useForm({
        initialValues: {
            title: task.title || '',
            description: task.description || '',
            startTime: task.start_time ? new Date(task.start_time) : null,
            deadline: task.deadline ? new Date(task.deadline) : null,
            notification: task.notification ? new Date(task.notification) : null,
            priority: task.priority?.toString() || '1',
            status: task.status || 'pending',
        },
        validate: {
            title: (value) => (!value ? 'Title is required' : null),
            deadline: (value, values) =>
                (values.startTime && value && new Date(value) < new Date(values.startTime))
                    ? 'Deadline must be after start time'
                    : null,
        },
    });

    const handleSubmit = async (values) => {
        const updatedTask = {
            ...task,
            title: values.title,
            description: values.description,
            priority: parseInt(values.priority),
            status: values.status,
            start_time: values.startTime ? new Date(values.startTime).toISOString() : null,
            deadline: values.deadline ? new Date(values.deadline).toISOString() : null,
            notification: values.notification ? new Date(values.notification).toISOString() : null,
        };

        await onSave(updatedTask);
    };

    const clearDateField = (fieldName) => {
        editForm.setFieldValue(fieldName, null);
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Edit Task"
            size="lg"
            centered
        >
            <form onSubmit={editForm.onSubmit(handleSubmit)}>
                <Stack gap="md">
                    <TextInput
                        withAsterisk
                        label="Title"
                        placeholder="Enter task title"
                        {...editForm.getInputProps('title')}
                    />

                    <Textarea
                        label="Description"
                        placeholder="Enter task description"
                        autosize
                        minRows={3}
                        {...editForm.getInputProps('description')}
                    />

                    <Group grow>
                        <div style={{ position: 'relative' }}>
                            <DateTimePicker
                                label="Start Time"
                                placeholder="Pick date and time"
                                {...editForm.getInputProps('startTime')}
                            />
                            {editForm.values.startTime && (
                                <ActionIcon
                                    variant="subtle"
                                    color="gray"
                                    size="sm"
                                    onClick={() => clearDateField('startTime')}
                                    style={{
                                        position: 'absolute',
                                        top: '28px',
                                        right: '8px',
                                        zIndex: 10
                                    }}
                                >
                                    <IconX size={14} />
                                </ActionIcon>
                            )}
                        </div>

                        <div style={{ position: 'relative' }}>
                            <DateTimePicker
                                label="Deadline"
                                placeholder="Pick date and time"
                                {...editForm.getInputProps('deadline')}
                            />
                            {editForm.values.deadline && (
                                <ActionIcon
                                    variant="subtle"
                                    color="gray"
                                    size="sm"
                                    onClick={() => clearDateField('deadline')}
                                    style={{
                                        position: 'absolute',
                                        top: '28px',
                                        right: '8px',
                                        zIndex: 10
                                    }}
                                >
                                    <IconX size={14} />
                                </ActionIcon>
                            )}
                        </div>
                    </Group>

                    <div style={{ position: 'relative' }}>
                        <DateTimePicker
                            label="Notification"
                            placeholder="Set a reminder"
                            {...editForm.getInputProps('notification')}
                        />
                        {editForm.values.notification && (
                            <ActionIcon
                                variant="subtle"
                                color="gray"
                                size="sm"
                                onClick={() => clearDateField('notification')}
                                style={{
                                    position: 'absolute',
                                    top: '28px',
                                    right: '8px',
                                    zIndex: 10
                                }}
                            >
                                <IconX size={14} />
                            </ActionIcon>
                        )}
                    </div>

                    <Group grow>
                        <Select
                            label="Priority"
                            withAsterisk
                            data={[
                                { value: '2', label: 'High' },
                                { value: '1', label: 'Medium' },
                                { value: '0', label: 'Low' },
                            ]}
                            {...editForm.getInputProps('priority')}
                        />

                        <Select
                            label="Status"
                            withAsterisk
                            data={[
                                { value: 'pending', label: 'To Do' },
                                { value: 'inprogress', label: 'In Progress' },
                                { value: 'completed', label: 'Completed' },
                            ]}
                            {...editForm.getInputProps('status')}
                        />
                    </Group>

                    <Group justify="space-between" pt="md">
                        <Button variant="light" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            Save Changes
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}