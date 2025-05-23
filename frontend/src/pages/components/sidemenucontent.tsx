
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useLocation, useNavigate } from 'react-router-dom';

const mainListItems = [
    { text: 'Home', icon: <HomeRoundedIcon />, path:'/dashboard' },
    { text: 'Fund a Loan', icon: <AttachMoneyIcon />, path:'/find' },
    { text: 'Request a Loan', icon: <AddCardRoundedIcon /> , path:'/create' },
];

// content for side drawer
export default function MenuContent() {
    const location = useLocation();
    const navigate = useNavigate();
    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {mainListItems.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                        <ListItemButton selected={location.pathname === item.path} onClick={() => navigate(item.path)}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

        </Stack>
    );
}
