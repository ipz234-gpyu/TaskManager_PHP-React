import { createSlice } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from "../../utils/cookieHandlers";

const initialState = {
    accessToken: null,
    expiresAt: null,
    authenticating: false,
    user: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens: (state, action) => {
            state.accessToken = action.payload.access.token;
            state.expiresAt = action.payload.access.expiresAt;
            state.authenticating = true;

            setCookie('refreshToken', action.payload.refresh.token, action.payload.refresh.expiresAt);
        },
        setAccessToken: (state, action) => {
            state.accessToken = action.payload.access.token;
            state.expiresAt = action.payload.access.expiresAt;
            state.authenticating = true;
        },
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logout: (state) => {
            state.accessToken = null;
            state.user = null;
            state.expiresAt = null;
            state.authenticating = false;

            deleteCookie('refreshToken');
        },
        setAuthenticating: (state, action) => {
            state.authenticating = action.payload;
        },
    },
});

export const {
    setAccessToken,
    setTokens,
    setUser,
    logout,
    setAuthenticating
} = authSlice.actions;

export default authSlice.reducer;
