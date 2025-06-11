import { createApi } from '@reduxjs/toolkit/query/react';
import {
    setLists,
    setTeamDashboard,
    addList,
    updateList,
    deleteList,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    reorderLists
} from './teamDashboardSlice.js';
import { baseQueryWithReauth } from './../baseApi';
import { updateTeamDashboard } from "../dashboards/dashboardsSlice.js";
import { dashboardsApi } from "../dashboards/dashboardsApi.js";

export const teamDashboardApi = createApi({
    reducerPath: 'teamDashboardApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getTeamDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/teamDashboard/getDashboard',
                method: 'POST',
                body: JSON.stringify({
                    dashboardId: credentials.dashboardId,
                    teamId: credentials.teamId
                })
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setTeamDashboard(data.data.dashboard));
                    dispatch(setLists(data.data.lists));
                } catch (error) {
                    console.error('Error loading team dashboard:', error);
                }
            },
        }),
        addListToTeamDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/teamDashboard/addList',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(addList(data.data.list));
                } catch (error) {
                    console.error('Error adding list to team dashboard:', error);
                }
            },
        }),
        updateListInTeamDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/teamDashboard/updateList',
                method: 'PUT',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(updateList({
                        id: arg.listId,
                        ...data.data.list
                    }));
                } catch (error) {
                    console.error('Error updating list in team dashboard:', error);
                }
            },
        }),
        deleteListFromTeamDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/teamDashboard/deleteList',
                method: 'DELETE',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled }) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(deleteList(data.data.deleteId));

                    dispatch(
                        dashboardsApi.endpoints.getTeamDashboards.initiate({
                            teamId: arg.teamId,
                            forceRefetch: true
                        })
                    );
                } catch (error) {
                    console.error('Error deleting list from team dashboard:', error);
                }
            },
        }),

        addTaskToTeamList: builder.mutation({
            query: (credentials) => ({
                url: '/teamDashboard/addTask',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled, getState}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(addTask({
                        listId: data.data.listId,
                        task: data.data.task
                    }));

                    const state = getState();
                    const activeTab = state.dashboards.activeTab;

                    const currentDashboard = state.dashboards.teamDashboards.find(d => d.id === activeTab);

                    if (currentDashboard) {
                        dispatch(updateTeamDashboard({
                            ...currentDashboard,
                            count: (currentDashboard.count || 0) + 1
                        }));
                    }
                } catch (error) {
                    console.error('Error adding task to team list:', error);
                }
            },
        }),
        updateTaskInTeamList: builder.mutation({
            query: (credentials) => ({
                url: '/teamDashboard/updateTask',
                method: 'PUT',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(updateTask({
                        listId: data.data.listId,
                        taskId: data.data.task.id,
                        updates: data.data.task
                    }));
                } catch (error) {
                    console.error('Error updating task in team list:', error);
                }
            },
        }),
        deleteTaskFromTeamList: builder.mutation({
            query: (credentials) => ({
                url: '/teamDashboard/deleteTask',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled, getState}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(deleteTask({
                        listId: data.data.listId,
                        taskId: data.data.taskId
                    }));

                    const state = getState();
                    const activeTab = state.dashboards.activeTab;

                    const currentDashboard = state.dashboards.teamDashboards.find(d => d.id === activeTab);

                    if (currentDashboard) {
                        dispatch(updateTeamDashboard({
                            ...currentDashboard,
                            count: (currentDashboard.count || 0) - 1
                        }));
                    }
                } catch (error) {
                    console.error('Error deleting task from team list:', error);
                }
            },
        }),
        moveTaskBetweenTeamLists: builder.mutation({
            query: (credentials) => ({
                url: '/teamDashboard/moveTask',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    dispatch(moveTask({
                        sourceListId: arg.sourceListId,
                        destListId: arg.destListId,
                        taskId: arg.taskId,
                        sourceIndex: arg.sourceIndex,
                        destIndex: arg.destIndex
                    }));
                } catch (error) {
                    console.error('Error moving task between team lists:', error);
                }
            },
        }),
        reorderTasksInTeamList: builder.mutation({
            query: (credentials) => ({
                url: '/teamDashboard/reorderTasks',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    dispatch(reorderTasks({
                        listId: arg.listId,
                        sourceIndex: arg.sourceIndex,
                        destIndex: arg.destIndex
                    }));
                } catch (error) {
                    console.error('Error reordering tasks in team list:', error);
                }
            },
        }),
        reorderListsInTeamDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/teamDashboard/reorderLists',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    dispatch(reorderLists({
                        sourceIndex: arg.sourceIndex,
                        destIndex: arg.destIndex
                    }));
                } catch (error) {
                    console.error('Error reordering lists in team dashboard:', error);
                }
            },
        }),
    })
});

export const {
    useGetTeamDashboardMutation,
    useAddListToTeamDashboardMutation,
    useUpdateListInTeamDashboardMutation,
    useDeleteListFromTeamDashboardMutation,
    useAddTaskToTeamListMutation,
    useUpdateTaskInTeamListMutation,
    useDeleteTaskFromTeamListMutation,
    useMoveTaskBetweenTeamListsMutation,
    useReorderTasksInTeamListMutation,
    useReorderListsInTeamDashboardMutation
} = teamDashboardApi;