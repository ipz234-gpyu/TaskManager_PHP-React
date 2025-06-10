import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import dashboardsReducer from '../features/dashboards/dashboardsSlice';
import customDashboardReducer from '../features/customDashboard/customDashboardSlice.js';
import { authApi } from '../features/auth/authApi';
import { dashboardsApi } from '../features/dashboards/dashboardsApi';
import { customDashboardApi } from '../features/customDashboard/customDashboardApi.js';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboards: dashboardsReducer,
        customDashboard: customDashboardReducer,

        [authApi.reducerPath]: authApi.reducer,
        [dashboardsApi.reducerPath]: dashboardsApi.reducer,
        [customDashboardApi.reducerPath]: customDashboardApi.reducer,
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            dashboardsApi.middleware,
            customDashboardApi.middleware,
        ),
});
