import { createApi } from '@reduxjs/toolkit/query/react';
import { setTokens, setAccessToken, logout, setUser } from './authSlice';
import { getCookie } from '../../utils/cookieHandlers';
import { baseQueryWithReauth } from './../baseApi';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: JSON.stringify(credentials),
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;

                    dispatch(setTokens({
                        access: data.data.access,
                        refresh: data.data.refresh
                    }));

                    dispatch(setUser(data.data.user));
                } catch {
                }
            },
        }),
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: JSON.stringify(credentials),
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;

                    dispatch(setTokens({
                        access: data.data.access,
                        refresh: data.data.refresh
                    }));

                    dispatch(setUser(data.data.user));
                } catch {
                }
            },
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'POST',
                body: JSON.stringify({refreshToken: getCookie('refreshToken')}),
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const {data} = await queryFulfilled;

                    dispatch(setAccessToken({
                        access: data.data.access,
                    }));

                    dispatch(setUser(data.data.user));
                } catch {
                }
            },
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
                body: JSON.stringify({ refreshToken: getCookie('refreshToken') }),
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    const { data } = await queryFulfilled;
                    if (data.status === 'success')
                    dispatch(logout());
                } catch {
                }
            },
        }),
        changeEmail: builder.mutation({
            query: (credentials) => ({
                url: '/auth/changeEmail',
                method: 'PUT',
                body: JSON.stringify(credentials),
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data.data.user));
                } catch {
                }
            },
        }),
        changePassword: builder.mutation({
            query: (credentials) => ({
                url: '/auth/changePassword',
                method: 'POST',
                body: JSON.stringify(credentials),
            }),
        }),
        deleteAccount: builder.mutation({
            query: (credentials) => ({
                url: '/auth/deleteAccount',
                method: 'POST',
                body: JSON.stringify(credentials),
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(logout());
                } catch {
                }
            },
        }),
        uploadAvatar: builder.mutation({
            query: (formData) => ({
                url: '/auth/uploadAvatar',
                method: 'POST',
                body: formData,
                formData: true,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setUser(data.data.user));
                } catch {
                }
            },
        }),

    }),
});

export const {
    useRegisterMutation,
    useLoginMutation,
    useRefreshMutation,
    useLogoutMutation,
    useChangeEmailMutation,
    useChangePasswordMutation,
    useDeleteAccountMutation,
    useUploadAvatarMutation,
} = authApi;