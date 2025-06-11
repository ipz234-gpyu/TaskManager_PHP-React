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

import RootLayout from "./routes/RootLayout.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";

import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import TodayDashboard from "./pages/dashboards/TodayDashboard.jsx";
import UpcomingDashboard from "./pages/dashboards/UpcomingDashboard.jsx";
import ImportantDashboard from "./pages/dashboards/ImportantDashboard.jsx";
import CustomDashboard from "./pages/CustomDashboard.jsx";
import TeamDashboard from "./pages/TeamDashboard.jsx";
//import SettingsPage from "./pages/SettingsPage.jsx";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/">
                <Route index element={<Navigate to="dashboard/today" replace/>}/>

                    <Route element={<RequireAuth/>}>
                        <Route element={<RootLayout/>}>
                        <Route path="dashboard">
                            <Route path="today" element={<TodayDashboard/>}/>
                            <Route path="upcoming" element={<UpcomingDashboard/>}/>
                            <Route path="important" element={<ImportantDashboard />}/>

                            <Route path="custom/:dashboardId" element={<CustomDashboard/>}/>
                            <Route path="team/:teamId/:dashboardId" element={<TeamDashboard/>}/>
                        </Route>
                        {/*
                        <Route path="settings" element={<SettingsPage />} />
                        */}
                    </Route>
                </Route>

                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>

                <Route path="*" element={<NotFound/>}/>
            </Route>
        )
    );

    return (
        <div className="App">
            <MantineProvider theme={createTodoTheme('dark')} defaultColorScheme="dark">
                <RouterProvider router={router}/>
            </MantineProvider>
        </div>
    )
}

export default App
