import * as React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {jwtDecode} from "jwt-decode";
import SideMenu from "./components/sidemenu.tsx"
import About from "./components/about";
import MenuAppBar from "./components/appbar.tsx";

export default function Dashboard() {


    // decode data
    const token = localStorage.getItem('token');
    const data = jwtDecode(token);

    // user info
    const id = data.id;
    const name = data.name;
    const email = data.email;
    const walletAddress = data.walletAddress;

    const [about, setAbout] = React.useState(false);

    const handleAbout= () => {
        setAbout(true);
    }
    const handleCloseAbout = () => {
        setAbout(false);
    }

    const [drawerOpen, setDrawerOpen] = React.useState(true);

    const toggleDrawer = () => {
        if (drawerOpen) {
            setDrawerOpen(false);
        }
        else{
            setDrawerOpen(true);
        }
    }


    return (
        <Box sx={{ display: 'flex' }}>

            <SideMenu
                open={drawerOpen}
                onAboutClick={handleAbout}
            />
            <About open={about} closeAbout={handleCloseAbout}/>
            <MenuAppBar toggleDrawer={toggleDrawer}  open={drawerOpen} name={name} email={email}/>

            <Box component="main" sx={{ flexGrow: 1 }}>


                <Typography variant="h2">Dashboard</Typography>
                <Typography variant="h4">Object ID: {id}</Typography>
                <Typography variant="h4">Name: {name}</Typography>
                <Typography variant="h4">Email: {email}</Typography>
                <Typography variant="h4">Wallet Address: {walletAddress}</Typography>
                <Button
                    variant="contained"
                    color="secondary"

                >
                    Logout
                </Button>

            </Box>
        </Box>
    );

}