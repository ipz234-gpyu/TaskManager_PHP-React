import React from 'react';
import {
    Card,
    Text,
    Group,
    ActionIcon,
    ScrollArea,
    Modal,
    TextInput,
    Textarea,
    Button,
    Select,
    Stack
} from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { IconEdit, IconTrash, IconPlus, IconList } from '@tabler/icons-react';
import TaskCard from './TaskCard';
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

export default function ListColumn({
                                       list,
                                       onAddTask,
                                       onError,
                                       handleEditClick,
                                       handleDeleteClick,
                                   }) {
    const [opened, {open, close}] = useDisclosure(false);

    const form = useForm({
        initialValues: {
            title: '',
            description: '',
            startTime: null,
            deadline: null,
            notification: null,
            priority: '1',
            status: 'todo',
        },

        validate: {
            deadline: (value, values) =>
                (values.startTime && value && new Date(value) < new Date(values.startTime))
                    ? 'Deadline must be after start time'
                    : null,
        },
    });

    const handleSubmit = (values) => {
        onAddTask({listId: list.id, ...values});
        form.reset();
        close();
    };

    return (
        <Card
            shadow="sm"
            p="sm"
            radius="md"
            style={{
                minWidth: '24%',
                maxWidth: '50%',
                height: '80vh',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            <Group justify="space-between" align="center" mb="sm">
                <Group>
                    <IconList size={20}/>
                    <Text fw={700} size="lg">{list.name}</Text>
                </Group>
                <Group gap={1} align="center">
                    <ActionIcon size="lg" variant="subtle" radius="lg"
                                onClick={() => handleEditClick(list)}
                    >
                        <IconEdit size={20}/>
                    </ActionIcon>
                    <ActionIcon size="lg" variant="subtle" color="red" radius="lg"
                                onClick={() => handleDeleteClick(list.id)}
                    >
                        <IconTrash size={20}/>
                    </ActionIcon>
                    <ActionIcon variant="subtle" size="lg" color="green" onClick={open} radius="lg">
                        <IconPlus size={20}/>
                    </ActionIcon>
                </Group>
            </Group>

            <ScrollArea
                style={{ flex: 1 }}
                type="scroll"
                scrollbarSize={6}
                scrollHideDelay={500}
            >
                <Stack gap="sm" p="xs">
                    {list.tasks?.slice()
                        .sort((a, b) => {
                            const isCompletedA = a.status === 'completed';
                            const isCompletedB = b.status === 'completed';

                            if (isCompletedA && !isCompletedB) return 1;
                            if (!isCompletedA && isCompletedB) return -1;

                            return Number(a.priority) - Number(b.priority);
                        }).map(task => (
                            <TaskCard key={task.id} task={task} listId={list.id} onError={onError}/>
                        ))}
                </Stack>
            </ScrollArea>

            <Modal opened={opened} onClose={close} title="Add New Task" centered>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack>
                        <TextInput
                            withAsterisk
                            label="Title"
                            placeholder="Enter task title"
                            {...form.getInputProps('title')}
                        />

                        <Textarea
                            label="Description"
                            placeholder="Enter task description"
                            autosize
                            minRows={3}
                            {...form.getInputProps('description')}
                        />

                        <Group grow>
                            <DateTimePicker
                                label="Start Time"
                                placeholder="Pick date and time"
                                {...form.getInputProps('startTime')}
                            />
                            <DateTimePicker
                                label="Deadline"
                                placeholder="Pick date and time"
                                {...form.getInputProps('deadline')}
                            />
                        </Group>

                        <DateTimePicker
                            label="Notification"
                            placeholder="Set a reminder"
                            {...form.getInputProps('notification')}
                        />

                        <Select
                            label="Priority"
                            withAsterisk
                            data={[
                                {value: '2', label: 'High'},
                                {value: '1', label: 'Medium'},
                                {value: '0', label: 'Low'},
                            ]}
                            {...form.getInputProps('priority')}
                        />

                        <Select
                            label="Status"
                            withAsterisk
                            data={[
                                {value: 'pending', label: 'To Do'},
                                {value: 'inprogress', label: 'In Progress'},
                                {value: 'completed', label: 'Completed'},
                            ]}
                            {...form.getInputProps('status')}
                        />

                        <Button type="submit" fullWidth mt="md">
                            Add Task
                        </Button>
                    </Stack>
                </form>
            </Modal>
        </Card>
    );
}