import React from "react";
import { Box, ThemeProvider} from "@mui/material";  // Import necessary MUI components
import SignInCard from "./components/SignInCard.tsx";
import CssBaseline from '@mui/material/CssBaseline';
import {darkTheme} from "../themes/AppTheme.tsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import SignUpCard from "./components/SignUpCard.tsx";


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
                        <Route path="/" element={<SignInCard />} />
                        <Route path="/signup" element={<SignUpCard />} />
                    </Routes>
                </Box>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;