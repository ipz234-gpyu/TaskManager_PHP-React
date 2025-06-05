import './App.css'
import {
    Route,
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider, Navigate
} from 'react-router-dom';
import RootLayout from "./routes/RootLayout.jsx";
import NotFound from "./pages/NotFound.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import RequireAuth from "./routes/RequireAuth.jsx";

function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/">
                <Route element={<RequireAuth/>}>
                    <Route path="home" index element={<HomePage/>}/>
                </Route>

                <Route path="/" element={<Navigate to="/home" replace/>}/>
                <Route path="login" element={<LoginPage/>}/>
                <Route path="register" element={<RegisterPage/>}/>

                <Route path="*" element={<NotFound/>}/>
            </Route>
        )
    );

    return (
        <div className="App">
            <RouterProvider router={router}/>
        </div>
    )
}

export default App
