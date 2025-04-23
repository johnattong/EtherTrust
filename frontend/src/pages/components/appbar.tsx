import {AppBar, IconButton, Stack, Toolbar, Typography} from "@mui/material";
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SpaceDashboardRoundedIcon from '@mui/icons-material/SpaceDashboardRounded';
import ProfileMenu from "./profilemenu.tsx";


const drawerWidth = 240;

interface AppBarProps {
    toggleDrawer: () => void;
    open: boolean;
    name: string;
    email: string;
}

// top app bar... includes button to close drawer, and profile button
export default function MenuAppBar({toggleDrawer, open, name, email}: AppBarProps) {


    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                backgroundColor: "background.paper",
                backgroundImage: 'none',
                borderBottom: '1px solid',
                borderColor: 'divider',
                top: 'var(--template-frame-height, 0px)',
                transition: (theme) => theme.transitions.create(['margin-left', 'width'], {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                ...(open && {
                    width: `calc(100% - ${drawerWidth}px)`,
                    ml:`${drawerWidth}px`,
                }),
            }}
        >
            <Toolbar variant='regular'>
                <Stack
                    direction="row"
                    alignItems="center"
                    sx={{
                        flexGrow: 1,
                        width: '100%',
                        gap: 1,
                    }}
                >
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ justifyContent: 'center', mr: 'auto' }}
                    >
                        <IconButton aria-label="menu" onClick={toggleDrawer}>
                            <MenuRoundedIcon fontSize={'large'}/>
                        </IconButton>

                        <Typography variant="h4" component="h1" sx={{ color: 'text.primary' }}>
                            EtherTrust
                        </Typography>
                        <SpaceDashboardRoundedIcon fontSize={'large'} color={'primary'}/>

                    </Stack>

                </Stack>

                <ProfileMenu name={name} email={email} />
            </Toolbar>
        </AppBar>
    );
}