import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    searchResults: [],
    searchQuery: '',
    customDashboards: [],
    teams: [],
    activeTab: null,
    dashboardsDetail: null,
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
        },
        setSearchResults: (state, action) => {
            state.searchResults = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
            state.searchQuery = '';
        },

        // Нові редюсери для роботи з завданнями в результатах пошуку
        updateTaskInSearchResults: (state, action) => {
            const { taskId, updatedTask } = action.payload;
            state.searchResults = state.searchResults.map(task =>
                task.id === taskId ? { ...task, ...updatedTask } : task
            );
        },

        removeTaskFromSearchResults: (state, action) => {
            const taskId = action.payload;
            state.searchResults = state.searchResults.filter(task => task.id !== taskId);
        },

        // Редюсери для оновлення завдань у дошках команд
        updateTaskInTeamDashboards: (state, action) => {
            const { taskId, updatedTask } = action.payload;

            state.teams.forEach(team => {
                if (team.dashboards) {
                    team.dashboards.forEach(dashboard => {
                        if (dashboard.lists) {
                            dashboard.lists.forEach(list => {
                                if (list.tasks) {
                                    list.tasks = list.tasks.map(task =>
                                        task.id === taskId ? { ...task, ...updatedTask } : task
                                    );
                                }
                            });
                        }
                    });
                }
            });
        },

        removeTaskFromTeamDashboards: (state, action) => {
            const taskId = action.payload;

            state.teams.forEach(team => {
                if (team.dashboards) {
                    team.dashboards.forEach(dashboard => {
                        if (dashboard.lists) {
                            dashboard.lists.forEach(list => {
                                if (list.tasks) {
                                    list.tasks = list.tasks.filter(task => task.id !== taskId);
                                }
                            });
                        }
                    });
                }
            });
        },

        // Редюсери для оновлення завдань у користувацьких дошках
        updateTaskInCustomDashboards: (state, action) => {
            const { taskId, updatedTask } = action.payload;

            state.customDashboards.forEach(dashboard => {
                if (dashboard.lists) {
                    dashboard.lists.forEach(list => {
                        if (list.tasks) {
                            list.tasks = list.tasks.map(task =>
                                task.id === taskId ? { ...task, ...updatedTask } : task
                            );
                        }
                    });
                }
            });
        },

        removeTaskFromCustomDashboards: (state, action) => {
            const taskId = action.payload;

            state.customDashboards.forEach(dashboard => {
                if (dashboard.lists) {
                    dashboard.lists.forEach(list => {
                        if (list.tasks) {
                            list.tasks = list.tasks.filter(task => task.id !== taskId);
                        }
                    });
                }
            });
        },
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
    setSearchResults,
    setSearchQuery,
    clearSearchResults,
    updateTaskInSearchResults,
    removeTaskFromSearchResults,
    updateTaskInTeamDashboards,
    removeTaskFromTeamDashboards,
    updateTaskInCustomDashboards,
    removeTaskFromCustomDashboards,
} = dashboardsSlice.actions;

export default dashboardsSlice.reducer;