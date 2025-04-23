
import { Box, ThemeProvider} from "@mui/material";  // Import necessary MUI pages
import SignInCard from "./pages/SignInCard.tsx";
import CssBaseline from '@mui/material/CssBaseline';
import {darkTheme} from "../themes/AppTheme.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignUpCard from "./pages/SignUpCard.tsx";
import { Navigate, Outlet } from 'react-router-dom';
import Dashboard from "./pages/dashboard.tsx";
import Account from "./pages/Account.tsx";
import {jwtDecode} from "jwt-decode";
import Find from "./pages/Find.tsx";
import Create from "./pages/Create.tsx"

interface JWTPayload { exp: number}

// check if token expired
function tokenExpired() {
    const token = localStorage.getItem("token");
    if (token) {
        try {
            return jwtDecode<JWTPayload>(token).exp * 1000 < Date.now()
        } catch{
            return true
        }
    }
}

const PrivateRoute = () => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');

    // no token
    if (!token) {
        return <Navigate to="/" />
    }
    // valid token
    else if (!tokenExpired()){
        return <Outlet/>
    }
    // expired token
    else {
        return <Navigate to="/"/>
    }
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
                            <Route path="/find" element={<Find />} />
                            <Route path="/create" element={<Create/>} />
                        </Route>
                    </Routes>
                </Box>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;