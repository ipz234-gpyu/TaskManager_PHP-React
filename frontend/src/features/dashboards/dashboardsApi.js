import { createApi } from '@reduxjs/toolkit/query/react';
import { addCustomDashboard, setCustomDashboards, removeCustomDashboard, updateCustomDashboard } from './dashboardsSlice.js';
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
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;
                    dispatch(updateCustomDashboard(data.data.dashboard));
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
    useUpdateCustomDashboardMutation
} = dashboardsApi;