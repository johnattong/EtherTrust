import React from "react";
import { Box, ThemeProvider} from "@mui/material";  // Import necessary MUI components
import SignInCard from "./components/SignInCard.tsx";
import CssBaseline from '@mui/material/CssBaseline';
import {darkTheme} from "../themes/AppTheme.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignUpCard from "./components/SignUpCard.tsx";
import { Navigate, Outlet } from 'react-router-dom';
import Dashboard from "./components/dashboard.tsx";

const PrivateRoute = () => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');

    // If no token, redirect to the sign-in page
    return token ? <Outlet /> : <Navigate to="/" />;
};


function App() {
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <BrowserRouter>
                <Box
                    display="flex"
                    justifyContent="center"  // Horizontally center
                    alignItems="center"       // Vertically center
                    minHeight="100vh"         // Full height of the viewport
                >
                    <Routes>

                        {/*public routes*/}
                        <Route path="/" element={<SignInCard />} />
                        <Route path="/signup" element={<SignUpCard />} />

                        {/*private routes*/}
                        <Route element={<PrivateRoute />} >
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>
                    </Routes>
                </Box>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;