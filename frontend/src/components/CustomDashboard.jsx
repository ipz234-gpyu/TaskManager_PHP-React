import React, { useEffect, useState } from "react";
import { Accordion, Button, Modal, Stack, TextInput, Group } from "@mantine/core";
import AccordionControl from "./AccordionControl.jsx";
import AccordionPanelDB from "./AccordionPanelDB.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
    dashboardsApi,
    useAddCustomDashboardMutation,
    useDeleteCustomDashboardsMutation,
    useUpdateCustomDashboardMutation,
} from "../features/dashboards/dashboardsApi.js";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { useNavigate } from "react-router-dom";
import { setActiveTab } from "../features/dashboards/dashboardsSlice.js";

export default function CustomDashboard({setError}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const customDashboards = useSelector((state) => state.dashboards.customDashboards);
    const activeTab = useSelector((state) => state.dashboards.activeTab);

    useEffect(() => {
        dispatch(dashboardsApi.endpoints.getCustomDashboards.initiate());
    }, [dispatch]);

    const [addCustomDashboard, {isLoading: isAdding}] = useAddCustomDashboardMutation();
    const [opened, {open, close}] = useDisclosure(false);
    const formAddCustomDashboard = useForm({
        initialValues: {title: ''},
        validate: {title: value => value.trim().length > 0 ? null : 'Title is required'},
    });

    const addCustomDashboardHandle = async (values) => {
        try {
            await addCustomDashboard(values).unwrap();
            close();
            formAddCustomDashboard.reset();
        } catch {
            setError('Failed to add dashboard');
        }
    };

    const [deleteOpened, {open: openDelete, close: closeDelete}] = useDisclosure(false);
    const [editOpened, {open: openEdit, close: closeEdit}] = useDisclosure(false);
    const [dashboardToDelete, setDashboardToDelete] = useState(null);
    const [editedDashboard, setEditedDashboard] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [deleteCustomDashboards, {isLoading: isDeleting}] = useDeleteCustomDashboardsMutation();
    const [updateCustomDashboard, {isLoading: isUpdating}] = useUpdateCustomDashboardMutation();

    const handleDeleteClick = (dashboard) => {
        setDashboardToDelete(dashboard.id);
        openDelete();
    };

    const deleteCustomDashboard = async () => {
        if (!dashboardToDelete) return;
        await deleteCustomDashboards(dashboardToDelete).unwrap();
        closeDelete();
        if (activeTab === dashboardToDelete) {
            navigate('/dashboard/today');
            dispatch(setActiveTab('today'))
        }
    };

    const handleEditClick = (dashboard) => {
        setEditedDashboard(dashboard.id);
        setEditedName(dashboard.name);
        openEdit();
    };

    const handleUpdateDashboard = async () => {
        if (!editedDashboard || !editedName.trim()) return;

        await updateCustomDashboard({id: editedDashboard, name: editedName.trim()});
        closeEdit();
    };

    return (
        <Accordion variant="contained" chevronPosition="right" defaultValue="custom">
            <Accordion.Item value="custom">
                <AccordionControl text='DASHBOARDS' addAction={open}/>

                <Modal opened={opened} onClose={close} title="Add dashboard" centered>
                    <form onSubmit={formAddCustomDashboard.onSubmit(addCustomDashboardHandle)}>
                        <Stack>
                            <TextInput
                                label="Title"
                                placeholder="Name dashboard"
                                withAsterisk
                                {...formAddCustomDashboard.getInputProps('title')}
                            />
                            <Button type="submit" fullWidth mt="xl" loading={isAdding}>Create</Button>
                        </Stack>
                    </form>
                </Modal>

                <Modal opened={deleteOpened} onClose={closeDelete} title="Delete this dashboard" centered>
                    Are you sure you want to delete this dashboard? This action cannot be undone.
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={closeDelete} variant="default">Cancel</Button>
                        <Button onClick={deleteCustomDashboard} color="red" loading={isDeleting}>Delete</Button>
                    </Group>
                </Modal>

                <Modal opened={editOpened} onClose={closeEdit} title="Edit dashboard name" centered>
                    <TextInput
                        label="Dashboard name"
                        value={editedName}
                        onChange={(e) => setEditedName(e.currentTarget.value)}
                        placeholder="Enter dashboard name"
                        required
                    />
                    <Group mt="lg" justify="flex-end">
                        <Button onClick={closeEdit} variant="default">Cancel</Button>
                        <Button onClick={handleUpdateDashboard} color="blue" loading={isUpdating}>Save</Button>
                    </Group>
                </Modal>

                <AccordionPanelDB
                    dashboards={customDashboards}
                    urldb='custom'
                    addAction={open}
                    isLoading={isAdding}
                    handleEditClick={handleEditClick}
                    handleDeleteClick={handleDeleteClick}
                />
            </Accordion.Item>
        </Accordion>
    );
}