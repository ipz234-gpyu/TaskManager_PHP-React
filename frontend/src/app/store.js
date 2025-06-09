import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardsReducer from '../features/dashboards/dashboardsSlice';
import { authApi } from '../features/auth/authApi';
import { dashboardsApi } from '../features/dashboards/dashboardsApi';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboards: dashboardsReducer,

        [authApi.reducerPath]: authApi.reducer,
        [dashboardsApi.reducerPath]: dashboardsApi.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            dashboardsApi.middleware
        ),
});
