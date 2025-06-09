import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    dashboardsDetail: null,
    customDashboards: [],
    teams: [],
    activeTab: null,
};

const dashboardsSlice = createSlice({
    name: 'dashboards',
    initialState,
    reducers: {
        addCustomDashboard: (state, action) => {
            state.customDashboards.push(action.payload);
        },
        setCustomDashboards: (state, action) => {
            state.customDashboards = action.payload;
        },
        removeCustomDashboard: (state, action) => {
            state.customDashboards = state.customDashboards.filter(d => d.id !== action.payload);
        },
        updateCustomDashboard: (state, action) => {
            state.customDashboards = state.customDashboards.map(d =>
                d.id === action.payload.id ? action.payload : d
            );
        },
        addTeam: (state, action) => {
            state.teams.push(action.payload);
        },
        addTeamDashboard: (state, action) => {

        }
    }
})

export const {
    addCustomDashboard,
    setCustomDashboards,
    removeCustomDashboard,
    updateCustomDashboard,
    addTeam,
    addTeamDashboard,
} = dashboardsSlice.actions;

export default dashboardsSlice.reducer;
