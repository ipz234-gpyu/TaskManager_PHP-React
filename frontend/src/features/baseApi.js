import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getCookie } from "./../utils/cookieHandlers"
import { setAccessToken, logout } from './auth/authSlice';

export const baseQuery = fetchBaseQuery({
    baseUrl: 'http://backend-kurswork.local/api',

    prepareHeaders: (headers, {getState}) => {
        //headers.set('Content-Type', 'application/json');
        const token = getState().auth.accessToken;

        if (token) {
            headers.set('authorization', "Bearer " + token);
        }
        return headers;
    },
});

export const baseQueryWithReauth = async (args, api, extraOptions) => {
    if (!(args.body instanceof FormData)) {
        if (!args.headers) {
            args.headers = {};
        }
        if (!args.headers['Content-Type']) {
            args.headers['Content-Type'] = 'application/json';
        }
    }

    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        const refreshToken = getCookie('refreshToken');

        if (refreshToken) {
            const refreshResult = await baseQuery({
                url: '/auth/refresh',
                method: 'POST',
                body: JSON.stringify({refreshToken: refreshToken}),
            }, api, extraOptions);

            if (refreshResult.data?.status === "success") {
                api.dispatch(setAccessToken({access: refreshResult.data.data.access}));
                result = await baseQuery(args, api, extraOptions);
            } else {
                api.dispatch(logout());
            }
        } else {
            api.dispatch(logout());
        }
    }

    return result;
};