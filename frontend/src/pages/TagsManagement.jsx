import React, { useEffect, useState } from 'react';
import {
    Container,
    Title,
    Group,
    Button,
    Card,
    Text,
    Badge,
    ActionIcon,
    Modal,
    TextInput,
    ColorInput,
    Stack,
    Loader,
    Center,
    Grid,
    Box,
    Flex,
} from '@mantine/core';
import {
    IconPlus,
    IconEdit,
    IconTrash,
    IconAlertCircle,
    IconTag,
} from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { useDispatch, useSelector } from 'react-redux';
import {
    useLazyGetTagsQuery,
    useCreateTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation,
} from '../features/customDashboard/customDashboardApi';

export default function TagsManagement() {
    const dispatch = useDispatch();
    const tags = useSelector((state) => state.customDashboard.tags);

    const [triggerGetTags, { isLoading: isLoadingTags }] = useLazyGetTagsQuery();
    const [createTag, { isLoading: isCreating }] = useCreateTagMutation();
    const [updateTag, { isLoading: isUpdating }] = useUpdateTagMutation();
    const [deleteTag, { isLoading: isDeleting }] = useDeleteTagMutation();

    const [createOpened, { open: openCreate, close: closeCreate }] = useDisclosure(false);
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
    const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);

    const [tagName, setTagName] = useState('');
    const [tagColor, setTagColor] = useState('#3b82f6');
    const [editingTag, setEditingTag] = useState(null);
    const [deletingTag, setDeletingTag] = useState(null);

    useEffect(() => {
        const loadTags = async () => {
            try {
                await triggerGetTags().unwrap();
            } catch (err) {
                notifications.show({
                    title: 'Error',
                    message: 'Failed to load tags',
                    color: 'red',
                    icon: <IconAlertCircle />,
                });
            }
        };

        loadTags();
    }, [triggerGetTags]);

    const resetForm = () => {
        setTagName('');
        setTagColor('#3b82f6');
        setEditingTag(null);
    };

    const handleCreateTag = async () => {
        if (!tagName.trim()) {
            notifications.show({
                title: 'Validation Error',
                message: 'Tag name is required',
                color: 'red',
                icon: <IconAlertCircle />,
            });
            return;
        }

        try {
            closeCreate();
            resetForm();
            await createTag({ name: tagName.trim(), color: tagColor }).unwrap();
        } catch (err) {
            notifications.show({
                title: 'Create Tag Failed',
                message: err?.data?.message || 'Could not create tag',
                color: 'red',
                icon: <IconAlertCircle />,
            });
        }
    };

    const handleEditClick = (tag) => {
        setEditingTag(tag);
        setTagName(tag.name);
        setTagColor(tag.color);
        openEdit();
    };

    const handleUpdateTag = async () => {
        if (!tagName.trim()) {
            notifications.show({
                title: 'Validation Error',
                message: 'Tag name is required',
                color: 'red',
                icon: <IconAlertCircle />,
            });
            return;
        }

        try {
            await updateTag({
                tagId: editingTag.id,
                name: tagName.trim(),
                color: tagColor,
            }).unwrap();
            closeEdit();
            resetForm();
        } catch (err) {
            notifications.show({
                title: 'Update Failed',
                message: err?.data?.message || 'Could not update tag',
                color: 'red',
                icon: <IconAlertCircle />,
            });
        }
    };

    const handleDeleteClick = (tag) => {
        setDeletingTag(tag);
        openDelete();
    };

    const handleDeleteTag = async () => {
        try {
            await deleteTag({ tagId: deletingTag.id }).unwrap();
            closeDelete();
            setDeletingTag(null);
        } catch (err) {
            notifications.show({
                title: 'Delete Failed',
                message: err?.data?.message || 'Could not delete tag',
                color: 'red',
                icon: <IconAlertCircle />,
            });
        }
    };

    const handleCloseCreate = () => {
        closeCreate();
        resetForm();
    };

    const handleCloseEdit = () => {
        closeEdit();
        resetForm();
    };

    const handleCloseDelete = () => {
        closeDelete();
        setDeletingTag(null);
    };

    if (isLoadingTags) {
        return (
            <Center className="h-screen">
                <Loader color="blue" size="xl" variant="dots" />
            </Center>
        );
    }

    return (
        <Container size="lg" className="py-6">
            <Group justify="space-between" mb="xl">
                <Title order={1} size="h2">
                    <Group gap="sm">
                        <IconTag size={32} />
                        Tag Management
                    </Group>
                </Title>
                <Button
                    leftSection={<IconPlus size={16} />}
                    onClick={openCreate}
                    color="blue"
                >
                    Create Tag
                </Button>
            </Group>

            {tags.length === 0 ? (
                <Card shadow="sm" padding="xl" radius="md" withBorder>
                    <Center>
                        <Stack align="center" gap="md">
                            <IconTag size={48} color="gray" />
                            <Title order={3} c="dimmed">No tags yet</Title>
                            <Text c="dimmed" ta="center">
                                Create your first tag to organize your tasks
                            </Text>
                            <Button
                                leftSection={<IconPlus size={20} />}
                                onClick={openCreate}
                                variant="light"
                            >
                                Create Tag
                            </Button>
                        </Stack>
                    </Center>
                </Card>
            ) : (
                <Grid>
                    {tags.map((tag) => (
                        <Grid.Col key={tag.id} span={{ base: 12, sm: 6, md: 4 }}>
                            <Card shadow="sm" padding="md" radius="md" withBorder>
                                <Flex justify="space-between" align="flex-start" mb="sm">
                                    <Badge
                                        color={tag.color}
                                        variant="filled"
                                        size="lg"
                                    >
                                        {tag.name}
                                    </Badge>
                                    <Group gap="xs">
                                        <ActionIcon
                                            variant="subtle"
                                            color="blue"
                                            onClick={() => handleEditClick(tag)}
                                            size="lg"
                                        >
                                            <IconEdit size={20} />
                                        </ActionIcon>
                                        <ActionIcon
                                            variant="subtle"
                                            color="red"
                                            onClick={() => handleDeleteClick(tag)}
                                            size="lg"
                                        >
                                            <IconTrash size={20} />
                                        </ActionIcon>
                                    </Group>
                                </Flex>
                                <Box>
                                    <Text size="sm" c="dimmed">
                                        Color: {tag.color}
                                    </Text>
                                </Box>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            )}

            {/* Create Tag Modal */}
            <Modal
                opened={createOpened}
                onClose={handleCloseCreate}
                title="Create New Tag"
                centered
            >
                <Stack>
                    <TextInput
                        label="Tag Name"
                        placeholder="Enter tag name"
                        value={tagName}
                        onChange={(e) => setTagName(e.currentTarget.value)}
                        required
                    />
                    <ColorInput
                        label="Tag Color"
                        placeholder="Choose color"
                        value={tagColor}
                        onChange={setTagColor}
                        format="hex"
                        swatches={[
                            '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
                            '#8b5cf6', '#f97316', '#06b6d4', '#84cc16',
                            '#f43f5e', '#6366f1', '#14b8a6', '#facc15',
                        ]}
                    />
                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={handleCloseCreate}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCreateTag}
                            loading={isCreating}
                            color="blue"
                        >
                            Create
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* Edit Tag Modal */}
            <Modal
                opened={editOpened}
                onClose={handleCloseEdit}
                title="Edit Tag"
                centered
            >
                <Stack>
                    <TextInput
                        label="Tag Name"
                        placeholder="Enter tag name"
                        value={tagName}
                        onChange={(e) => setTagName(e.currentTarget.value)}
                        required
                    />
                    <ColorInput
                        label="Tag Color"
                        placeholder="Choose color"
                        value={tagColor}
                        onChange={setTagColor}
                        format="hex"
                        swatches={[
                            '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
                            '#8b5cf6', '#f97316', '#06b6d4', '#84cc16',
                            '#f43f5e', '#6366f1', '#14b8a6', '#facc15',
                        ]}
                    />
                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={handleCloseEdit}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleUpdateTag}
                            loading={isUpdating}
                            color="blue"
                        >
                            Save
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* Delete Tag Modal */}
            <Modal
                opened={deleteOpened}
                onClose={handleCloseDelete}
                title="Delete Tag"
                centered
            >
                <Stack>
                    <Text>
                        Are you sure you want to delete the tag{' '}
                        <Badge color={deletingTag?.color} variant="filled">
                            {deletingTag?.name}
                        </Badge>
                        ?
                    </Text>
                    <Text size="sm" c="dimmed">
                        This tag will be removed from all tasks. This action cannot be undone.
                    </Text>
                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={handleCloseDelete}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteTag}
                            loading={isDeleting}
                            color="red"
                        >
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Container>
    );
}