import React, { useState } from 'react';
import { Paper, Text, Group, ActionIcon, Menu } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
//import EditTaskModal from './EditTaskModal';
import { useUpdateTaskInListMutation, useDeleteTaskFromListMutation } from '../features/customDashboard/customDashboardApi';

export default function TaskCard({ task, listId, onError }) {
    const [updateTask] = useUpdateTaskInListMutation();
    const [deleteTask] = useDeleteTaskFromListMutation();
    const [editOpen, setEditOpen] = useState(false);

    return (
        <Paper p="xs">
            <Group position="apart">
                <Text size="sm">{task.title}</Text>
                <Menu>
                    <Menu.Item icon={<IconEdit size={14} />} onClick={() => setEditOpen(true)}>Edit</Menu.Item>
                    <Menu.Item icon={<IconTrash size={14} />} color="red" onClick={() => deleteTask({ listId, taskId: task.id }).unwrap().catch(() => onError('Delete task failed'))}>Delete</Menu.Item>
                </Menu>
            </Group>

        </Paper>
    );
}
