import './App.css'
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider, Navigate
} from 'react-router-dom';
import '@mantine/dates/styles.css';
import { MantineProvider } from '@mantine/core';
import { createTodoTheme } from "./utils/theme.js"
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles/baseline.css';
import '@mantine/core/styles/default-css-variables.css';
import '@mantine/core/styles/global.css';

import RootLayout from "./routes/RootLayout.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";

import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import TodayDashboard from "./pages/TodayDashboard.jsx";
import CustomDashboard from "./pages/CustomDashboard.jsx";
import TeamDashboardPage from "./pages/TeamDashboardPage.jsx";
import TeamMembersPage from "./pages/TeamMembersPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import TeamInvitationPage from "./pages/TeamInvitationPage.jsx";
import TagsManagement from "./pages/TagsManagement.jsx";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/">
                <Route index element={<Navigate to="dashboard/today" replace/>}/>

                <Route element={<RequireAuth/>}>
                    <Route element={<RootLayout/>}>
                        <Route path="dashboard">
                            <Route path="today" element={<TodayDashboard/>}/>
                            <Route path="tag-management" element={<TagsManagement/>}/>

                            <Route path="custom/:dashboardId" element={<CustomDashboard/>}/>
                            <Route path="team/:teamId/:dashboardId" element={<TeamDashboardPage/>}/>
                            <Route path="team-members/:teamId" element={<TeamMembersPage/>}/>
                            <Route path="team-invitation/:token" element={<TeamInvitationPage/>}/>
                        </Route>

                        <Route path="settings" element={<SettingsPage/>}/>
                    </Route>
                </Route>

                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>

                <Route path="*" element={<NotFound/>}/>
            </Route>
        )
    );

    return (
        <MantineProvider theme={createTodoTheme('dark')} defaultColorScheme="dark">
            <Notifications
                position="top-right"
                zIndex={9999}
                autoClose={4000}
                limit={3}
            />
            <RouterProvider router={router}/>
        </MantineProvider>
    )
}

export default App
