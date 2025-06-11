import React from 'react';
import {
    Container,
    Group,
    Title,
    Button,
    Paper,
    Text,
    TextInput,
    Modal,
} from '@mantine/core';
import {
    IconTable,
    IconPlus,
    IconCheck,
    IconClock,
    IconStar,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

export default function DashboardHeader({
                                            dashboard,
                                            lists,
                                            setError,
                                            addListHandle,
                                            isLoading
                                        }) {
    const allTasks = lists.flatMap(list => list.tasks || []);
    const completedTasks = allTasks.filter(task => task.status === 'completed');
    const pendingTasks = allTasks.filter(task => task.status !== 'completed');

    const [opened, {open, close}] = useDisclosure(false);
    const form = useForm({initialValues: {name: ''}});

    const handleSubmit = async (values) => {
        form.reset();
        close();
        await addListHandle({...values, priority: 0});
    };

    return (
        <Container size="xl" py="md">
            <Group justify="space-between" position="apart" align="center">
                <Group align="center" spacing="sm"  wrap="nowrap">
                    <IconTable size={28}/>
                    <Title order={1} style={{whiteSpace: 'nowrap'}}>
                        {dashboard?.name}
                    </Title>

                    <Button leftSection={<IconPlus size={18}/>} onClick={open}>
                        Add List
                    </Button>
                </Group>

                <Group spacing="xl" wrap="nowrap">
                    <Paper
                        p="xs"
                        radius="md"
                        withBorder
                    >
                        <Group spacing="xs" position="center" align="center" wrap="nowrap">
                            <IconCheck size={16} className="text-green-600"/>
                            <Text size="sm" fw={700}>
                                {completedTasks.length}
                            </Text>
                        </Group>
                    </Paper>

                    <Paper
                        p="xs"
                        radius="md"
                        withBorder
                    >
                        <Group spacing="xs" position="center" align="center" wrap="nowrap">
                            <IconClock size={16} className="text-yellow-600"/>
                            <Text size="sm" fw={700}>
                                {pendingTasks.length}
                            </Text>
                        </Group>
                    </Paper>

                    <Paper
                        p="xs"
                        radius="md"
                        withBorder
                    >
                        <Group spacing="xs" position="center" align="center" wrap="nowrap">
                            <IconStar size={16} className="text-red-600"/>
                            <Text size="sm" fw={700}>
                                {pendingTasks.filter((t) => t.priority == '2').length}
                            </Text>
                        </Group>
                    </Paper>
                </Group>
            </Group>

            <Modal opened={opened} onClose={close} title="Add List" centered>
                <form onSubmit={form.onSubmit(handleSubmit)} onLoad={isLoading}>
                    <TextInput label="List Name" required {...form.getInputProps('name')} />
                    <Button
                        type="submit"
                        fullWidth
                        mt="md"
                        disabled={!form.values.name.trim()}
                        size="sm"
                    >
                        Create
                    </Button>
                </form>
            </Modal>
        </Container>
    );
}
