import SideMenu from "./components/sidemenu.tsx";
import MenuAppBar from "./components/appbar.tsx";
import ChangePassword from "./components/changePassword.tsx";
import { Box, Card, Divider, Typography } from '@mui/material';
import {jwtDecode} from "jwt-decode";
import About from "./components/about.tsx";
import * as React from "react";
import {styled} from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';


export default function Account() {
    // decode data
    const token = localStorage.getItem('token');
    const data = jwtDecode(token);

    // user info
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
    const [changePasswordOpen, setChangePasswordOpen] = React.useState(false);

    const handleCloseChangePassword = () => {
        setChangePasswordOpen(false);
    }

    const toggleDrawer = () => {
        if (drawerOpen) {
            setDrawerOpen(false);
        }
        else{
            setDrawerOpen(true);
        }
    }

    const Card = styled(MuiCard)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'flex-start',
        width: 'fit-content',
        padding: theme.spacing(4),
        gap: theme.spacing(2),
        boxShadow:
            'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
        [theme.breakpoints.up('sm')]: {
            width: 'fit-content',
        },
        ...theme.applyStyles('dark', {
            boxShadow:
                'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
        }),
    }));

    const mainListItems = [
        {text : "Name:", desc: name, icon: null },
        {text : "Email:", desc: email, icon: null },
        {text : "Wallet Address:", desc: walletAddress, icon: null },
        {text : "Password:", desc: "•••••••••••••", icon: <NavigateNextRoundedIcon/> }


    ]

    return (
        <Box sx={{ display: 'flex' }}>
            <SideMenu
                open={drawerOpen}
                onAboutClick={handleAbout}
            />
            <About open={about} closeAbout={handleCloseAbout}/>
            <ChangePassword open={changePasswordOpen} close={handleCloseChangePassword} />
            <MenuAppBar toggleDrawer={toggleDrawer}  open={drawerOpen} name={name} email={email}/>

            <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
                <Typography component="h2" variant="h2" sx={{ mb: 2 }}>
                    Account Settings
                </Typography>
                <Card variant="outlined">
                    <Stack sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
                        <List>
                            {mainListItems.map((item, index) => (
                                <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                                    <ListItemButton
                                      selected={index === 3}
                                      onClick={() => {
                                        if (index === mainListItems.length - 1) {
                                          setChangePasswordOpen(true);
                                        }
                                      }}
                                      sx={{
                                        '&.Mui-selected': {
                                          bgcolor: 'action.selected',
                                          color: 'text.primary',
                                        },
                                        '&.Mui-selected:hover': {
                                          bgcolor: 'action.selected',
                                        },
                                      }}
                                    >
                                        <ListItemText secondary={item.text} secondaryTypographyProps={{ variant: 'h6', noWrap: true }} sx={{ pr: 2 }} />
                                        <ListItemText primary={item.desc} primaryTypographyProps={{ variant: 'h4', noWrap: true }} sx={{ pr: 2 }} />
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                    </ListItemButton>
                                    {index < mainListItems.length - 1 && <Divider />}
                                </ListItem>

                            ))}
                        </List>

                    </Stack>
                </Card>
            </Box>



        </Box>
    );
}
