import React, { useState, useEffect, useMemo } from "react";
import { Container, TextInput, Title, Stack, Text, Group, ActionIcon } from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useDebouncedValue } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
    useSearchTasksQuery,
    useUpdateTaskMutation,
    useDeleteTaskMutation
} from "../features/dashboards/dashboardsApi.js";
import { setSearchQuery, clearSearchResults } from "../features/dashboards/dashboardsSlice.js";
import DashboardHeader from "../components/DashboardHeader.jsx";
import ListColumn from "../components/ListColumn.jsx";

export default function SearchDashboard() {
    const dispatch = useDispatch();
    const {searchResults, searchQuery} = useSelector(state => state.dashboards);
    const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
    const [debouncedQuery] = useDebouncedValue(localSearchQuery, 500);
    const [error, setError] = useState('');

    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();

    const shouldSearch = debouncedQuery && debouncedQuery.trim().length > 0;
    const {isLoading, isFetching} = useSearchTasksQuery(debouncedQuery, {
        skip: !shouldSearch,
    });

    useEffect(() => {
        dispatch(setSearchQuery(debouncedQuery));
        if (!shouldSearch) {
            dispatch(clearSearchResults());
        }
    }, [debouncedQuery, dispatch, shouldSearch]);

    const searchList = useMemo(() => ({
        id: 'search-results',
        name: `Search Results${debouncedQuery ? ` for "${debouncedQuery}"` : ''}`,
        tasks: searchResults || []
    }), [searchResults, debouncedQuery]);

    const handleClearSearch = () => {
        setLocalSearchQuery('');
        dispatch(clearSearchResults());
    };

    const handleTaskStatusToggle = async (taskId, newStatus) => {
        try {
            const task = searchResults?.find(t => t.id === taskId);
            if (!task) {
                setError('Task not found');
                return;
            }

            await updateTask({
                id: taskId,
                ...task,
                status: newStatus
            }).unwrap();

            setError('');
        } catch (error) {
            setError('Failed to update task status');
            console.error('Error updating task status:', error);
        }
    };

    const handleTaskDelete = async (taskId) => {
        try {
            await deleteTask(taskId).unwrap();
            setError('');
        } catch (error) {
            setError('Failed to delete task');
            console.error('Error deleting task:', error);
        }
    };

    const handleTaskUpdate = async (taskId, updatedFields) => {
        try {
            const task = searchResults?.find(t => t.id === taskId);
            if (!task) {
                setError('Task not found');
                return;
            }

            await updateTask({
                id: taskId,
                ...task,
                ...updatedFields
            }).unwrap();

            setError('');
        } catch (error) {
            setError('Failed to update task');
            console.error('Error updating task:', error);
        }
    };

    const searchDashboard = {
        name: 'Search Tasks',
        description: 'Search through all your tasks across all dashboards'
    };

    const searchListWrapped = [{
        id: 'search',
        tasks: searchResults,
    }];


    return (
        <Container size="xl">
            <Group gap="md" mb="xl">
                    <DashboardHeader
                    dashboard={searchDashboard}
                    lists={searchListWrapped}
                />

                <TextInput
                    placeholder="Search tasks by title..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    leftSection={<IconSearch size={16}/>}
                    rightSection={
                        localSearchQuery && (
                            <ActionIcon
                                variant="subtle"
                                size="sm"
                                onClick={handleClearSearch}
                            >
                                <IconX size={16}/>
                            </ActionIcon>
                        )
                    }
                    size="md"
                    style={{flex: 1, maxWidth: 400}}
                />

                {error && (
                    <Text color="red" size="sm">
                        {error}
                    </Text>
                )}

                {isLoading || isFetching ? (
                    <Text size="sm" c="dimmed">Searching...</Text>
                ) : !shouldSearch ? (
                    <Text size="sm" c="dimmed">
                        Enter a search term to find tasks across all your dashboards
                    </Text>
                ) : searchResults.length === 0 ? (
                    <Text size="sm" c="dimmed">
                        No tasks found matching "{debouncedQuery}"
                    </Text>
                ) : (
                    <Text size="sm" c="dimmed">
                        Found {searchResults.length} task{searchResults.length !== 1 ? 's' : ''} matching
                        "{debouncedQuery}"
                    </Text>
                )}
            </Group>

            {shouldSearch && searchResults.length > 0 && (
                <ListColumn
                    key={searchList.id}
                    list={searchList}
                    onError={setError}
                    onTaskStatusToggle={handleTaskStatusToggle}
                    onTaskDelete={handleTaskDelete}
                    onTaskUpdate={handleTaskUpdate}
                    renderChild={() => null}
                    renderOptionalChild={() => null}
                />
            )}
        </Container>
    );
}