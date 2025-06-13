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
    TextInput,
    Box,
    Avatar,
    Tooltip,
    Text
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
    useGetUsersMutation,
} from '../features/teamDashboard/teamDashboardApi';
import ListColumn from '../components/ListColumn.jsx';
import DashboardHeader from "../components/DashboardHeader.jsx";
import { useDisclosure } from "@mantine/hooks";
import { setActiveTab } from "../features/dashboards/dashboardsSlice.js";
import AssignedSelectionListComponent from "../components/AssignedSelectionListComponent.jsx";

export default function TeamDashboardPage() {
    const {teamId, dashboardId} = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lists = useSelector(state => state.teamDashboard.lists);
    const dashboard = useSelector(state => state.teamDashboard.dashboard);
    const users = useSelector(state => state.teamDashboard.users);
    const [getDashboard, {isLoading, error: loadError}] = useGetTeamDashboardMutation();
    const [getUsers, {isLoading: isUsersLoading}] = useGetUsersMutation();

    const [deleteOpened, {open: openDelete, close: closeDelete}] = useDisclosure(false);
    const [editOpened, {open: openEdit, close: closeEdit}] = useDisclosure(false);
    const [listToDelete, setListToDelete] = useState(null);
    const [editedList, setEditedList] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [addList, {isLoading: isListAdding}] = useAddListToTeamDashboardMutation();
    const [updateList, {isLoading: isListUpdating}] = useUpdateListInTeamDashboardMutation();
    const [deleteList, {isLoading: isListDeleting}] = useDeleteListFromTeamDashboardMutation();
    const [addTask, {isLoading: isTaskAdding}] = useAddTaskToTeamListMutation();
    const [updateTask] = useUpdateTaskInTeamListMutation();
    const [deleteTask] = useDeleteTaskFromTeamListMutation();

    const addListHandle = async (values) => {
        try {
            await addList({dashboardId: dashboard.id, teamId, ...values});
        } catch {
            setError('Add list failed');
        }
    };

    const addTaskHandle = async (values) => {
        try {
            await addTask({...values, teamId});
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
            await updateList({listId: editedList, name: editedName, teamId});
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
            await deleteList({listId: listToDelete, teamId});
        } catch {
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
                await getDashboard({teamId, dashboardId}).unwrap();
                await getUsers({teamId}).unwrap();
                dispatch(setActiveTab(dashboardId));
            } catch {
                navigate('/not-found');
            }
        };

        fetchDashboard();
        const intervalId = setInterval(fetchDashboard, 100000);
        return () => clearInterval(intervalId);
    }, [dashboardId, teamId]);

    const renderChild = (task) => {
        const assignedUsers = users?.filter(user => task?.assignedUserIds?.includes(user.id));

        return (
            <Group>
                {assignedUsers?.length > 0 &&
                    <>
                        <Text size="md">
                            Assigned:
                        </Text>
                        <Tooltip.Group openDelay={300} closeDelay={100}>
                            <Avatar.Group spacing="sm">
                                {assignedUsers?.map(user => (
                                    <Tooltip withArrow key={user.id} label={`${user.name} ${user.surname}`}>
                                        <Avatar src={user.avatar} radius="xl"
                                                style={{
                                                    transition: 'transform 150ms ease',
                                                    cursor: 'pointer',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                    </Tooltip>
                                ))}
                            </Avatar.Group>
                        </Tooltip.Group>
                    </>
                }
            </Group>
        );
    };

    const renderOptionalChild = (task) => {
        return (
            <AssignedSelectionListComponent task={task} teamId={teamId}/>
        );
    };

    if (isLoading) return (
        <Center className="h-screen">
            <Loader color="blue" size="xl" variant="dots"/>
        </Center>
    );

    if (loadError || error) return (
        <Alert icon={<IconAlertCircle/>} color="red">
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