import React, { useEffect, useState } from 'react';
import {
    Container,
    Group,
    Button,
    ScrollArea,
    Alert,
    Loader,
    Center,
    Modal,
    TextInput
} from '@mantine/core';
import {
    IconAlertCircle,
} from '@tabler/icons-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    useGetTeamDashboardMutation,
    useAddListToTeamDashboardMutation,
    useDeleteListFromTeamDashboardMutation,
    useUpdateListInTeamDashboardMutation,
    useAddTaskToTeamListMutation,
    useUpdateTaskInTeamListMutation,
    useDeleteTaskFromTeamListMutation,
} from '../features/teamDashboard/teamDashboardApi';
import ListColumn from '../components/ListColumn.jsx';
import DashboardHeader from "../components/DashboardHeader.jsx";
import { useDisclosure } from "@mantine/hooks";
import { setActiveTab } from "../features/dashboards/dashboardsSlice.js";

export default function TeamDashboard() {
    const { teamId, dashboardId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lists = useSelector(state => state.teamDashboard.lists);
    const dashboard = useSelector(state => state.teamDashboard.dashboard);
    const [getDashboard, { isLoading, error: loadError }] = useGetTeamDashboardMutation();

    const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false);
    const [editOpened, { open: openEdit, close: closeEdit }] = useDisclosure(false);
    const [listToDelete, setListToDelete] = useState(null);
    const [editedList, setEditedList] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [addList, { isLoading: isListAdding }] = useAddListToTeamDashboardMutation();
    const [updateList, { isLoading: isListUpdating }] = useUpdateListInTeamDashboardMutation();
    const [deleteList, { isLoading: isListDeleting }] = useDeleteListFromTeamDashboardMutation();
    const [addTask, { isLoading: isTaskAdding }] = useAddTaskToTeamListMutation();
    const [updateTask] = useUpdateTaskInTeamListMutation();
    const [deleteTask] = useDeleteTaskFromTeamListMutation();

    const addListHandle = async (values) => {
        try {
            await addList({ dashboardId: dashboard.id, teamId, ...values });
        }
        catch {
            setError('Add list failed');
        }
    };

    const addTaskHandle = async (values) => {
        try {
            await addTask({ ...values, teamId });
        }
        catch {
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
            task: {...task, status: newStatus},
            teamId
        }).unwrap();
    };

    const handleTaskDelete = async (listId, taskId) => {
        await deleteTask({listId, taskId, teamId}).unwrap();
    };

    const handleTaskUpdate = async (listId, taskId, updatedTask) => {
        await updateTask({
            listId: listId,
            taskId: taskId,
            task: updatedTask,
            teamId
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
            await updateList({ listId: editedList, name: editedName, teamId });
        }
        catch {
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
            await deleteList({ listId: listToDelete, teamId });
        }
        catch {
            setError('Delete list failed');
        }
    };

    const [error, setError] = useState(null);

    useEffect(() => {
        if (!dashboardId || !teamId) {
            navigate('/not-found');
            return;
        }

        const fetchDashboard = async () => {
            try {
                await getDashboard({ teamId, dashboardId }).unwrap();
                dispatch(setActiveTab(dashboardId));
            }
            catch {
                navigate('/not-found');
            }
        };

        fetchDashboard();
    }, [dashboardId, teamId]);

    if (isLoading) return (
        <Center className="h-screen">
            <Loader color="blue" size="xl" variant="dots" />
        </Center>
    );

    if (loadError || error) return (
        <Alert icon={<IconAlertCircle />} color="red">
            {error || loadError.message}
        </Alert>
    );

    return (
        <Container size="xl" className="py-6">
            <DashboardHeader
                dashboard={dashboard}
                lists={lists}
                setError={setError}
                addListHandle={addListHandle}
                isLoading={isListAdding}
            />

            <ScrollArea style={{ height: '80vh' }}>
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