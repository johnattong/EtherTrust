import React from "react";
import { Box, ThemeProvider} from "@mui/material";  // Import necessary MUI pages
import SignInCard from "./pages/SignInCard.tsx";
import CssBaseline from '@mui/material/CssBaseline';
import {darkTheme} from "../themes/AppTheme.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignUpCard from "./pages/SignUpCard.tsx";
import { Navigate, Outlet } from 'react-router-dom';
import Dashboard from "./pages/dashboard.tsx";
import Account from "./pages/Account.tsx";


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
                            <Route path="/account" element={<Account/>} />
                        </Route>
                    </Routes>
                </Box>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;