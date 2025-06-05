import { createApi } from '@reduxjs/toolkit/query/react';
import { setTokens, setAccessToken, logout } from './authSlice';
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
                } catch {
                }
            },
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
                body: getCookie('refreshToken'),
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    dispatch(logout());
                } catch {
                }
            },
        }),
    }),
});

export const {useRegisterMutation, useLoginMutation, useRefreshMutation, useLogoutMutation} = authApi;
