import React, { useState } from 'react';
import {
    Box,
    Text,
    Group,
    Stack,
    Paper,
    Checkbox,
    ActionIcon,
    TextInput,
    Collapse,
} from '@mantine/core';
import {
    IconChevronDown,
    IconChevronRight,
    IconPlus,
    IconX,
} from '@tabler/icons-react';
import { useForm } from "@mantine/form";

export default function SubtaskSection({ task, onError }) {
    const [subtasksExpanded, setSubtasksExpanded] = useState(false);
    const mockSubtasks = task.subtasks || [];

    const subtaskForm = useForm({
        initialValues: {
            title: '',
        },
        validate: {
            title: (value) => (!value ? 'Subtask title is required' : null),
        },
    });

    const handleAddSubtask = async (values) => {
        try {
            // TODO: Implement API call for adding subtask
            // await addSubtask({ parentId: task.id, ...values }).unwrap();
            console.log('Adding subtask:', values);
            subtaskForm.reset();
        } catch (error) {
            onError('Failed to add subtask');
        }
    };

    const handleSubtaskToggle = async (subtaskId) => {
        try {
            // TODO: Implement API call for toggling subtask
            console.log('Toggling subtask:', subtaskId);
        } catch (error) {
            onError('Failed to update subtask');
        }
    };

    const handleDeleteSubtask = async (subtaskId) => {
        try {
            // TODO: Implement API call for deleting subtask
            console.log('Deleting subtask:', subtaskId);
        } catch (error) {
            onError('Failed to delete subtask');
        }
    };

    return (
        <Box>
            <Group justify="space-between" mb="xs">
                <Text size="sm" fw={500}>Subtasks ({mockSubtasks.length})</Text>
                <ActionIcon
                    variant="subtle"
                    size="sm"
                    onClick={() => setSubtasksExpanded(!subtasksExpanded)}
                >
                    {subtasksExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                </ActionIcon>
            </Group>

            <Collapse in={subtasksExpanded}>
                <Stack gap="xs">
                    {mockSubtasks.map((subtask, index) => (
                        <Paper key={index} p="xs" withBorder>
                            <Group justify="space-between">
                                <Group gap="xs">
                                    <Checkbox
                                        size="sm"
                                        onChange={() => handleSubtaskToggle(subtask.id)}
                                    />
                                    <Text size="sm">{subtask.title}</Text>
                                </Group>
                                <ActionIcon
                                    size="xs"
                                    variant="subtle"
                                    color="red"
                                    onClick={() => handleDeleteSubtask(subtask.id)}
                                >
                                    <IconX size={12} />
                                </ActionIcon>
                            </Group>
                        </Paper>
                    ))}

                    <form onSubmit={subtaskForm.onSubmit(handleAddSubtask)}>
                        <Group gap="xs">
                            <TextInput
                                placeholder="Add subtask..."
                                size="sm"
                                style={{ flex: 1 }}
                                {...subtaskForm.getInputProps('title')}
                            />
                            <ActionIcon type="submit" color="green" variant="light">
                                <IconPlus size={16} />
                            </ActionIcon>
                        </Group>
                    </form>
                </Stack>
            </Collapse>
        </Box>
    );
}