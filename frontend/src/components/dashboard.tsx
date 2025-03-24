import * as React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {Alert} from "@mui/material";
import {jwtDecode} from "jwt-decode";
import {useNavigate} from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    // delete token and redirect to signin
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // decode data
    const token = localStorage.getItem('token');
    const data = jwtDecode(token);

    // user info
    const id = data.id;
    const name = data.name;
    const email = data.email;
    const walletAddress = data.walletAddress;

    // placeholder to show functionality...
    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h2">Dashboard</Typography>
            <Typography variant="h4">Object ID: {id}</Typography>
            <Typography variant="h4">Name: {name}</Typography>
            <Typography variant="h4">Email: {email}</Typography>
            <Typography variant="h4">Wallet Address: {walletAddress}</Typography>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleLogout}
            >
                Logout
            </Button>
        </Box>
    );

}