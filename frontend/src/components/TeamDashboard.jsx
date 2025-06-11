import React, { useEffect, useState } from "react";
import { Accordion, Button, Modal, Stack, TextInput, Group } from "@mantine/core";
import AccordionControl from "./AccordionControl.jsx";
import AccordionPanelDB from "./AccordionPanelDB.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
    dashboardsApi,
    useAddTeamMutation,
    useDeleteTeamMutation,
    useUpdateTeamMutation,
    useAddTeamDashboardMutation,
    useDeleteTeamDashboardMutation,
    useUpdateTeamDashboardMutation
} from "../features/dashboards/dashboardsApi.js";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";

export default function TeamDashboard({setError}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const activeTab = useSelector((state) => state.dashboards.activeTab);
    const teams = useSelector((state) => state.dashboards.teams);

    useEffect(() => {
        dispatch(dashboardsApi.endpoints.getTeams.initiate());
    }, [dispatch]);

    // Team operations
    const [addTeam, {isLoading: isAdding}] = useAddTeamMutation();
    const [deleteTeam, {isLoading: isDeleting}] = useDeleteTeamMutation();
    const [updateTeam, {isLoading: isUpdating}] = useUpdateTeamMutation();

    // Team dashboard operations
    const [addTeamDashboard, {isLoading: isDashboardAdding}] = useAddTeamDashboardMutation();
    const [deleteTeamDashboard, {isLoading: isDashboardDeleting}] = useDeleteTeamDashboardMutation();
    const [updateTeamDashboard, {isLoading: isDashboardUpdating}] = useUpdateTeamDashboardMutation();

    // Modal states for teams
    const [opened, {open, close}] = useDisclosure(false);
    const [deleteOpened, {open: openDelete, close: closeDelete}] = useDisclosure(false);
    const [editOpened, {open: openEdit, close: closeEdit}] = useDisclosure(false);

    // Modal states for team dashboards
    const [dashboardOpened, {open: openDashboard, close: closeDashboard}] = useDisclosure(false);
    const [dashboardDeleteOpened, {open: openDashboardDelete, close: closeDashboardDelete}] = useDisclosure(false);
    const [dashboardEditOpened, {open: openDashboardEdit, close: closeDashboardEdit}] = useDisclosure(false);

    // State for operations
    const [teamToDelete, setTeamToDelete] = useState(null);
    const [editedTeam, setEditedTeam] = useState(null);
    const [editedTeamName, setEditedTeamName] = useState('');
    const [currentTeamId, setCurrentTeamId] = useState(null);
    const [dashboardToDelete, setDashboardToDelete] = useState(null);
    const [editedDashboard, setEditedDashboard] = useState(null);
    const [editedDashboardName, setEditedDashboardName] = useState('');

    // Forms
    const formAddTeam = useForm({
        initialValues: {name: ''},
        validate: {name: value => value.trim().length > 0 ? null : 'Name is required'},
    });

    const formAddTeamDashboard = useForm({
        initialValues: {name: ''},
        validate: {name: value => value.trim().length > 0 ? null : 'Name is required'},
    });

    // Team handlers
    const addTeamHandle = async (values) => {
        try {
            await addTeam(values).unwrap();
            close();
            formAddTeam.reset();
        } catch {
            setError('Failed to add team');
        }
    };

    const handleDeleteTeamClick = (team) => {
        setTeamToDelete(team.id);
        openDelete();
    };

    const deleteTeamHandle = async () => {
        if (!teamToDelete) return;
        try {
            await deleteTeam(teamToDelete).unwrap();
            closeDelete();
            if (activeTab === `team-${teamToDelete}`) {
                navigate('/dashboard/today');
            }
        } catch {
            setError('Failed to delete team');
        }
    };

    const handleEditTeamClick = (team) => {
        setEditedTeam(team.id);
        setEditedTeamName(team.name);
        openEdit();
    };

    const handleUpdateTeam = async () => {
        if (!editedTeam || !editedTeamName.trim()) return;
        try {
            await updateTeam({id: editedTeam, name: editedTeamName.trim()}).unwrap();
            closeEdit();
        } catch {
            setError('Failed to update team');
        }
    };

    // Team dashboard handlers
    const handleAddDashboardClick = (teamId) => {
        setCurrentTeamId(teamId);
        openDashboard();
    };

    const addTeamDashboardHandle = async (values) => {
        if (!currentTeamId) return;
        try {
            await addTeamDashboard({teamId: currentTeamId, ...values}).unwrap();
            closeDashboard();
            formAddTeamDashboard.reset();
        } catch {
            setError('Failed to add team dashboard');
        }
    };

    const handleEditDashboardClick = (dashboard, teamId) => {
        setCurrentTeamId(teamId);
        setEditedDashboard(dashboard.id);
        setEditedDashboardName(dashboard.name);
        openDashboardEdit();
    };

    const handleUpdateDashboard = async () => {
        if (!editedDashboard || !editedDashboardName.trim() || !currentTeamId) return;
        try {
            await updateTeamDashboard({
                teamId: currentTeamId,
                dashboardId: editedDashboard,
                name: editedDashboardName.trim()
            }).unwrap();
            closeDashboardEdit();
        } catch {
            setError('Failed to update dashboard');
        }
    };

    const handleDeleteDashboardClick = (dashboard, teamId) => {
        setCurrentTeamId(teamId);
        setDashboardToDelete(dashboard.id);
        openDashboardDelete();
    };

    const deleteDashboardHandle = async () => {
        if (!dashboardToDelete || !currentTeamId) return;
        try {
            await deleteTeamDashboard({
                teamId: currentTeamId,
                dashboardId: dashboardToDelete
            }).unwrap();
            closeDashboardDelete();
            if (activeTab === dashboardToDelete) {
                navigate('/dashboard/today');
            }
        } catch {
            setError('Failed to delete dashboard');
        }
    };

    return (
        <Accordion
            variant="contained"
            chevronPosition="right"
            multiple
        >
            <Accordion.Item value="teams-header">
                <AccordionControl
                    text='TEAMS'
                    addAction={open}
                />

                <Modal opened={opened} onClose={close} title="Add team" centered>
                    <form onSubmit={formAddTeam.onSubmit(addTeamHandle)}>
                        <Stack>
                            <TextInput
                                label="Name"
                                placeholder="Team name"
                                withAsterisk
                                {...formAddTeam.getInputProps('name')}
                            />
                            <Button type="submit" fullWidth mt="xl" loading={isAdding}>Create</Button>
                        </Stack>
                    </form>
                </Modal>

                <Modal opened={deleteOpened} onClose={closeDelete} title="Delete this team" centered>
                    Are you sure you want to delete this team? This action cannot be undone.
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={closeDelete} variant="default">Cancel</Button>
                        <Button onClick={deleteTeamHandle} color="red" loading={isDeleting}>Delete</Button>
                    </Group>
                </Modal>

                <Modal opened={editOpened} onClose={closeEdit} title="Edit team name" centered>
                    <TextInput
                        label="Team name"
                        value={editedTeamName}
                        onChange={(e) => setEditedTeamName(e.currentTarget.value)}
                        placeholder="Enter team name"
                        required
                    />
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={closeEdit} variant="default">Cancel</Button>
                        <Button onClick={handleUpdateTeam} color="blue" loading={isUpdating}>Save</Button>
                    </Group>
                </Modal>

                <Modal opened={dashboardOpened} onClose={closeDashboard} title="Add dashboard" centered>
                    <form onSubmit={formAddTeamDashboard.onSubmit(addTeamDashboardHandle)}>
                        <Stack>
                            <TextInput
                                label="Name"
                                placeholder="Dashboard name"
                                withAsterisk
                                {...formAddTeamDashboard.getInputProps('name')}
                            />
                            <Button type="submit" fullWidth mt="xl" loading={isDashboardAdding}>Create</Button>
                        </Stack>
                    </form>
                </Modal>

                <Modal opened={dashboardDeleteOpened} onClose={closeDashboardDelete} title="Delete this dashboard" centered>
                    Are you sure you want to delete this dashboard? This action cannot be undone.
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={closeDashboardDelete} variant="default">Cancel</Button>
                        <Button onClick={deleteDashboardHandle} color="red" loading={isDashboardDeleting}>Delete</Button>
                    </Group>
                </Modal>

                <Modal opened={dashboardEditOpened} onClose={closeDashboardEdit} title="Edit dashboard name" centered>
                    <TextInput
                        label="Dashboard name"
                        value={editedDashboardName}
                        onChange={(e) => setEditedDashboardName(e.currentTarget.value)}
                        placeholder="Enter dashboard name"
                        required
                    />
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={closeDashboardEdit} variant="default">Cancel</Button>
                        <Button onClick={handleUpdateDashboard} color="blue" loading={isDashboardUpdating}>Save</Button>
                    </Group>
                </Modal>

                <Accordion.Panel>
                    <Accordion multiple>
                        {teams.length > 0 ? (
                            teams?.map((team) => (
                                <Accordion.Item value={`team-${team.id}`} key={team.id}>
                                    <AccordionControl
                                        text={team.name}
                                        addAction={() => handleAddDashboardClick(team.id)}
                                        deleteAction={team.isAdmin ? () => handleDeleteTeamClick(team) : undefined}
                                        editAction={team.isAdmin ? () => handleEditTeamClick(team) : undefined}
                                    />

                                    <AccordionPanelDB
                                        dashboards={team.dashboards}
                                        urldb={`team/${team.id}`}
                                        addAction={() => handleAddDashboardClick(team.id)}
                                        handleEditClick={(dashboard) => handleEditDashboardClick(dashboard, team.id)}
                                        handleDeleteClick={(dashboard) => handleDeleteDashboardClick(dashboard, team.id)}
                                    />
                                </Accordion.Item>
                            ))
                        ) : (
                            <Button
                                variant="light"
                                size="xs"
                                fullWidth
                                leftSection={<IconPlus size={16}/>}
                                onClick={open}
                                mt="sm"
                            >
                                Create Team
                            </Button>
                        )}
                    </Accordion>
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}