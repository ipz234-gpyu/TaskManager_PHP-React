import React, { useEffect, useState } from 'react';
import {
    Container,
    Group,
    Button,
    ScrollArea,
    Alert,
    Loader,
    Center,
    Modal, TextInput, Stack
} from '@mantine/core';
import {
    IconAlertCircle,
} from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    useGetCustomDashboardMutation,
    useAddListToDashboardMutation,
    useDeleteListFromDashboardMutation,
    useUpdateListInDashboardMutation,
    useAddTaskToListMutation,
    useUpdateTaskInListMutation,
    useDeleteTaskFromListMutation,
    useLazyGetTagsQuery,
} from '../features/customDashboard/customDashboardApi';
import ListColumn from '../components/ListColumn.jsx';
import DashboardHeader from "../components/DashboardHeader.jsx";
import { useDisclosure } from "@mantine/hooks";
import { setActiveTab } from "../features/dashboards/dashboardsSlice.js";
import TagComponent from "../components/TagComponent.jsx";
import TagSelectionListComponent from "../components/TagSelectionListComponent.jsx";

export default function TodoDashboard() {
    const {dashboardId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lists = useSelector(state => state.customDashboard.lists);
    const dashboard = useSelector(state => state.customDashboard.dashboard);
    const [getDashboard, {isLoading, error: loadError}] = useGetCustomDashboardMutation();
    const [triggerGetTags] = useLazyGetTagsQuery();

    const [deleteOpened, {open: openDelete, close: closeDelete}] = useDisclosure(false);
    const [editOpened, {open: openEdit, close: closeEdit}] = useDisclosure(false);
    const [listToDelete, setListToDelete] = useState(null);
    const [editedList, setEditedList] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [addList, {isLoading: isListAdding}] = useAddListToDashboardMutation();
    const [updateList, {isLoading: isListUpdating}] = useUpdateListInDashboardMutation();
    const [deleteList, {isLoading: isListDeleting}] = useDeleteListFromDashboardMutation();
    const [addTask, {isLoading: isTaskAdding}] = useAddTaskToListMutation();
    const [updateTask] = useUpdateTaskInListMutation();
    const [deleteTask] = useDeleteTaskFromListMutation();

    const addListHandle = async (values) => {
        try {
            await addList({dashboardId: dashboard.id, ...values});
        } catch {
            setError('Add list failed');
        }
    };

    const addTaskHandle = async (values) => {
        try {
            await addTask(values);
        } catch {
            setError('Add task failed');
        }
    };

    const handleTaskStatusToggle = async (listId, taskId, newStatus) => {
        const list = lists.find(l => l.id === listId);
        const task = list?.tasks.find(t => t.id === taskId);
        if (!task) return;

        await updateTask({
            listId: listId,
            taskId: taskId,
            task: {...task, status: newStatus}
        }).unwrap();
    };

    const handleTaskDelete = async (listId, taskId) => {
        await deleteTask({listId, taskId}).unwrap();
    };

    const handleTaskUpdate = async (listId, taskId, updatedTask) => {
        await updateTask({
            listId: listId,
            taskId: taskId,
            task: updatedTask
        }).unwrap();
    };

    const handleUpdateDashboard = (list) => {
        setEditedList(list.id);
        setEditedName(list.name);
        openEdit();
    };

    const updateListHandle = async () => {
        if (!editedList || !editedName.trim()) return;

        try {
            await updateList({listId: editedList, name: editedName});
        } catch {
            setError('Update list failed');
        }
        closeEdit();
    };

    const handleDeleteClick = (value) => {
        setListToDelete(value);
        openDelete();
    };

    const deleteListHandle = async () => {
        if (!listToDelete) return;
        closeDelete();
        try {
            await deleteList({listId: listToDelete});
        } catch {
            setError('Delete list failed');
        }
    };

    const [error, setError] = useState(null);

    useEffect(() => {
        if (!dashboardId) {
            navigate('/not-found');
            return;
        }

        const fetchDashboard = async () => {
            try {
                await getDashboard(dashboardId).unwrap();
                await triggerGetTags().unwrap();
                dispatch(setActiveTab(dashboardId));
            } catch {
                navigate('/not-found');
            }
        };

        fetchDashboard();
    }, [dashboardId]);

    const renderChild = (task) => {
        return (
            <Group wrap gap="xs">
                {task?.tags?.map(tag => (
                    <TagComponent tag={tag} key={tag.id} />
                    ))}
            </Group>
        );
    };

    const renderOptionalChild = (task) => {
        return (
            <TagSelectionListComponent task={task}/>
        );
    };

    if (isLoading) return (
        <Center className="h-screen">
            <Loader color="blue" size="xl" variant="dots"/>
        </Center>
    );
    if (loadError || error) return <Alert icon={<IconAlertCircle/>} color="red">{error || loadError.message}</Alert>;

    return (
        <Container size="xl" className="py-6">
            <DashboardHeader
                dashboard={dashboard}
                lists={lists}
                setError={setError}
                addListHandle={addListHandle}
                isLoading={isListAdding}
            />

            <ScrollArea style={{height: '80vh'}}>
                <Group spacing="md" grow wrap="nowrap">
                    {lists.map(list => (
                        <ListColumn
                            key={list.id}
                            list={list}
                            handleEditClick={handleUpdateDashboard}
                            handleDeleteClick={handleDeleteClick}
                            onAddTask={addTaskHandle}
                            onError={setError}
                            // Task handlers
                            onTaskStatusToggle={(taskId, newStatus) => handleTaskStatusToggle(list.id, taskId, newStatus)}
                            onTaskDelete={(taskId) => handleTaskDelete(list.id, taskId)}
                            onTaskUpdate={(taskId, updatedTask) => handleTaskUpdate(list.id, taskId, updatedTask)}

                            renderChild={renderChild}
                            renderOptionalChild={renderOptionalChild}
                        />
                    ))}
                </Group>
            </ScrollArea>

            <Modal opened={deleteOpened} onClose={closeDelete} title="Delete this list" centered>
                Are you sure you want to delete this list? This action cannot be undone.
                <Group mt="lg" justify="flex-end">
                    <Button onClick={closeDelete} variant="default">Cancel</Button>
                    <Button onClick={deleteListHandle} color="red" loading={isListDeleting}>Delete</Button>
                </Group>
            </Modal>

            <Modal opened={editOpened} onClose={closeEdit} title="Edit list name" centered>
                <TextInput
                    label="List name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.currentTarget.value)}
                    placeholder="Enter list name"
                    required
                />
                <Group mt="lg" justify="flex-end">
                    <Button onClick={closeEdit} variant="default">Cancel</Button>
                    <Button onClick={updateListHandle} color="blue" loading={isListUpdating}>Save</Button>
                </Group>
            </Modal>
        </Container>
    );
}