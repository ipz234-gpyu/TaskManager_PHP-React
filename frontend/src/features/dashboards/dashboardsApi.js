import { createApi } from '@reduxjs/toolkit/query/react';
import {
    addCustomDashboard,
    setCustomDashboards,
    removeCustomDashboard,
    updateCustomDashboard,
    addTeam,
    setTeams,
    removeTeam,
    updateTeam,
    addDashboardToTeam,
    removeDashboardFromTeam,
    updateTeamDashboard,
} from './dashboardsSlice.js';
import { setCustomDashboard } from '../customDashboard/customDashboardSlice.js'
import { setTeamDashboard } from '../teamDashboard/teamDashboardSlice.js'
import { baseQueryWithReauth } from './../baseApi';

export const dashboardsApi = createApi({
    reducerPath: 'dashboardsApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        addCustomDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/dashboard/addCustomDashboard',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(addCustomDashboard(data.data.dashboard));
                } catch {
                }
            },
        }),
        getCustomDashboards: builder.query({
            query: () => ({
                url: '/dashboard/getCustomDashboards',
                method: 'GET',
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setCustomDashboards(data.data.dashboards));
                } catch {
                }
            },
        }),
        deleteCustomDashboards: builder.mutation({
            query: (credentials) => ({
                url: '/dashboard/deleteCustomDashboard',
                method: 'DELETE',
                body: JSON.stringify({id: credentials})
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(removeCustomDashboard(data.data.deleteId));
                } catch {
                }
            },
        }),
        updateCustomDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/dashboard/updateCustomDashboard',
                method: 'PUT',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled, getState}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(updateCustomDashboard(data.data.dashboard));

                    if (data.data.dashboard.id === getState().dashboards.activeTab) {
                        dispatch(setCustomDashboard(data.data.dashboard))
                    }
                } catch {
                }
            },
        }),
        addTeam: builder.mutation({
            query: (credentials) => ({
                url: '/dashboard/addTeam',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(addTeam(data.data.team));
                } catch {
                }
            },
        }),
        getTeams: builder.query({
            query: () => ({
                url: '/dashboard/getTeams',
                method: 'GET',
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(setTeams(data.data.teams));
                } catch {
                }
            },
        }),
        deleteTeam: builder.mutation({
            query: (credentials) => ({
                url: '/dashboard/deleteTeam',
                method: 'DELETE',
                body: JSON.stringify({id: credentials})
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(removeTeam(data.data.deleteId));
                } catch {
                }
            },
        }),
        updateTeam: builder.mutation({
            query: (credentials) => ({
                url: '/dashboard/updateTeam',
                method: 'PUT',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(updateTeam(data.data.team));
                } catch {
                }
            },
        }),
        addTeamDashboard: builder.mutation({
            query: (credentials) => ({
                url: '/dashboard/addTeamDashboard',
                method: 'POST',
                body: JSON.stringify(credentials)
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(addDashboardToTeam({
                        teamId: data.data.teamId,
                        dashboard: data.data.dashboard
                    }));
                } catch {
                }
            },
        }),
        deleteTeamDashboard: builder.mutation({
            query: ({teamId, dashboardId}) => ({
                url: '/dashboard/deleteTeamDashboard',
                method: 'DELETE',
                body: JSON.stringify({teamId, dashboardId})
            }),
            async onQueryStarted({teamId, dashboardId}, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    dispatch(removeDashboardFromTeam({
                        teamId,
                        dashboardId
                    }));
                } catch {
                }
            },
        }),
        updateTeamDashboard: builder.mutation({
            query: ({teamId, dashboardId, name}) => ({
                url: '/dashboard/updateTeamDashboard',
                method: 'PUT',
                body: JSON.stringify({teamId, dashboardId, name})
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled, getState}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(updateTeamDashboard(data.data.dashboard));

                    if (data.data.dashboard.id === getState().dashboards.activeTab) {
                        dispatch(setTeamDashboard(data.data.dashboard))
                    }
                } catch {
                }
            },
        }),
    })
});

export const {
    useAddCustomDashboardMutation,
    useGetCustomDashboardsQuery,
    useDeleteCustomDashboardsMutation,
    useUpdateCustomDashboardMutation,
    useAddTeamMutation,
    useGetTeamsQuery,
    useDeleteTeamMutation,
    useUpdateTeamMutation,
    useAddTeamDashboardMutation,
    useDeleteTeamDashboardMutation,
    useUpdateTeamDashboardMutation
} = dashboardsApi;