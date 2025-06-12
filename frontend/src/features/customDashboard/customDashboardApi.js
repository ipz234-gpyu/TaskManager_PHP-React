import { createApi } from '@reduxjs/toolkit/query/react';
import {
    setLists,
    setCustomDashboard,
    addList,
    updateList,
    deleteList,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderTasks,
    reorderLists,
    setTags, addTagToTask, removeTagFromTask, addTag, updateTag, deleteTag
} from './customDashboardSlice.js';
import { baseQueryWithReauth } from './../baseApi';
import { updateCustomDashboard } from "../dashboards/dashboardsSlice.js";
import { dashboardsApi } from "../dashboards/dashboardsApi.js";

export const customDashboardApi = createApi({
    reducerPath: 'customDashboardApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        getCustomDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/customDashboard/getDashboard',
                method: 'POST',
                body: JSON.stringify({dashboardId: credentials})
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setCustomDashboard(data.data.dashboard));
                    dispatch(setLists(data.data.lists));
                } catch (error) {
                    console.error('Error loading dashboard:', error);
                }
            },
        }),
        addListToDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/customDashboard/addList',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(addList(data.data.list));
                } catch (error) {
                    console.error('Error adding list:', error);
                }
            },
        }),
        updateListInDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/customDashboard/updateList',
                method: 'PUT',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(updateList({
                        id: arg.id,
                        ...data.data.list
                    }));
                } catch (error) {
                    console.error('Error updating list:', error);
                }
            },
        }),
        deleteListFromDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/customDashboard/deleteList',
                method: 'DELETE',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled }) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(deleteList(data.data.deleteId));

                    dispatch(
                        dashboardsApi.endpoints.getCustomDashboards.initiate({
                            forceRefetch: true
                        })
                    );
                } catch (error) {
                    console.error('Error deleting list:', error);
                }
            },
        }),

        addTaskToList: builder.mutation({
            query: (credentials) => ({
                url: '/customDashboard/addTask',
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

                    const currentDashboard = state.dashboards.customDashboards.find(d => d.id === activeTab);

                    if (currentDashboard) {
                        dispatch(updateCustomDashboard({
                            ...currentDashboard,
                            count: (currentDashboard.count || 0) + 1
                        }));
                    }
                } catch (error) {
                    console.error('Error adding task:', error);
                }
            },
        }),
        updateTaskInList: builder.mutation({
            query: (credentials) => ({
                url: '/customDashboard/updateTask',
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
                    console.error('Error updating task:', error);
                }
            },
        }),
        deleteTaskFromList: builder.mutation({
            query: (credentials) => ({
                url: '/customDashboard/deleteTask',
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

                    const currentDashboard = state.dashboards.customDashboards.find(d => d.id === activeTab);

                    if (currentDashboard) {
                        dispatch(updateCustomDashboard({
                            ...currentDashboard,
                            count: (currentDashboard.count || 0) - 1
                        }));
                    }
                } catch (error) {
                    console.error('Error deleting task:', error);
                }
            },
        }),
        moveTaskBetweenLists: builder.mutation({
            query: (credentials) => ({
                url: '/customDashboard/moveTask',
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
                    console.error('Error moving task:', error);
                }
            },
        }),
        reorderTasksInList: builder.mutation({
            query: (credentials) => ({
                url: '/customDashboard/reorderTasks',
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
                    console.error('Error reordering tasks:', error);
                }
            },
        }),
        reorderListsInDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/customDashboard/reorderLists',
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
                    console.error('Error reordering lists:', error);
                }
            },
        }),

        getTags: builder.query({
            query: () => ({
                url: '/task/getTags',
                method: 'GET',
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setTags(data.data.tags));
                } catch (error) {
                    console.error('Error loading tags:', error);
                }
            },
        }),
        removeTagFromTask: builder.mutation({
            query: (credentials) => ({
                url: '/task/removeTagFromTask',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(removeTagFromTask(data.data));
                } catch (error) {
                    console.error('Error deleting task:', error);
                }
            },
        }),
        addTagToTask: builder.mutation({
            query: (credentials) => ({
                url: '/task/addTagToTask',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(addTagToTask(data.data));
                } catch (error) {
                    console.error('Error deleting task:', error);
                }
            },
        }),
        createTag: builder.mutation({
            query: (credentials) => ({
                url: '/task/createTag',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(addTag(data.data.tag));
                } catch (error) {
                    console.error('Error creating tag:', error);
                }
            },
        }),
        updateTag: builder.mutation({
            query: (credentials) => ({
                url: '/task/updateTag',
                method: 'PUT',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(updateTag({
                        id: arg.tagId,
                        ...data.data.tag
                    }));
                } catch (error) {
                    console.error('Error updating tag:', error);
                }
            },
        }),
        deleteTag: builder.mutation({
            query: (credentials) => ({
                url: '/task/deleteTag',
                method: 'DELETE',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(deleteTag(data.data.deletedId));
                } catch (error) {
                    console.error('Error deleting tag:', error);
                }
            },
        }),

    })
});

export const {
    useGetCustomDashboardMutation,
    useAddListToDashboardMutation,
    useUpdateListInDashboardMutation,
    useDeleteListFromDashboardMutation,
    useAddTaskToListMutation,
    useUpdateTaskInListMutation,
    useDeleteTaskFromListMutation,
    useMoveTaskBetweenListsMutation,
    useReorderTasksInListMutation,
    useReorderListsInDashboardMutation,
    useLazyGetTagsQuery,
    useRemoveTagFromTaskMutation,
    useAddTagToTaskMutation,
    useCreateTagMutation,
    useUpdateTagMutation,
    useDeleteTagMutation,
} = customDashboardApi;