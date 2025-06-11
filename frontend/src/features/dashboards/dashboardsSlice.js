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
        setTeams: (state, action) => {
            state.teams = action.payload;
        },
        removeTeam: (state, action) => {
            state.teams = state.teams.filter(d => d.id !== action.payload);
        },
        updateTeam: (state, action) => {
            state.teams = state.teams.map(t =>
                t.id === action.payload.id ? action.payload : t
            );
        },
        addDashboardToTeam: (state, action) => {
            const { teamId, dashboard } = action.payload;
            const team = state.teams.find(t => t.id === teamId);
            if (team) {
                if (!team.dashboards) {
                    team.dashboards = [];
                }
                team.dashboards.push(dashboard);
            }
        },
        removeDashboardFromTeam: (state, action) => {
            const { teamId, dashboardId } = action.payload;
            const team = state.teams.find(t => t.id === teamId);
            if (team && team.dashboards) {
                team.dashboards = team.dashboards.filter(d => d.id !== dashboardId);
            }
        },
        updateTeamDashboard: (state, action) => {
            const dashboard = action.payload;

            const team = state.teams.find(t =>
                t.dashboards?.some(d => d.id === dashboard.id)
            );

            if (team) {
                team.dashboards = team.dashboards.map(d =>
                    d.id === dashboard.id ? dashboard : d
                );
            }
        },

        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        setDashboardsDetail: (state, action) => {
            state.dashboardsDetail = action.payload;
        },
        clearDashboardsDetail: (state) => {
            state.dashboardsDetail = null;
        }
    }
})

export const {
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
    setActiveTab,
    setDashboardsDetail,
    clearDashboardsDetail,
} = dashboardsSlice.actions;

export default dashboardsSlice.reducer;
