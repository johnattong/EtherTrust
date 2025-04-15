import * as React from 'react';
import { styled } from '@mui/material/styles';
import Divider, { dividerClasses } from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon, { listItemIconClasses } from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import {Box, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";

const MenuItem = styled(MuiMenuItem)({
    margin: '2px 0',
});

interface ProfileMenuProps {
    name: string;
    email: string;
}

export default function ProfileMenu({ name, email }: ProfileMenuProps) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);
    const open = Boolean(anchorEl);

    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    // delete token and redirect to signin
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const handleMenuClick = (action:'account' | 'logout') => {
        switch (action) {
            case 'account':
                navigate('/account');
                break;
            case 'logout':
                handleLogout();
                break;
        }
        handleClose();
    };

    return (
        <React.Fragment>
            <Button
                aria-label="Open menu"
                onClick={handleClick}
                sx={{ borderColor: 'transparent', padding: '0 20px' }}
                ref={buttonRef}
            >
                <Avatar
                    sizes="small"
                    alt={name}
                    sx={{ width: 36, height: 36 }}
                />
                <Box sx={{ mr: 'auto' }} padding={1}>
                    <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px', textTransform: 'none', color: 'text.primary' }}>
                        {name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', textTransform: 'none' }}>
                        {email}
                    </Typography>
                </Box>
                <ExpandMoreRoundedIcon sx={{color: 'text.primary'}}/>
            </Button>
            <Menu
                anchorEl={anchorEl}
                id="menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'left', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                PaperProps={{
                    sx: {
                        width: buttonRef.current ? `${buttonRef.current.clientWidth}px` : 'auto',
                    },
                }}
                sx={{
                    [`& .${listClasses.root}`]: {
                        padding: '4px',
                    },
                    [`& .${paperClasses.root}`]: {
                        padding: 0,
                    },
                    [`& .${dividerClasses.root}`]: {
                        margin: '4px -4px',
                    },

                }}
            >
                <MenuItem onClick={() => handleMenuClick('account')}>Account Settings</MenuItem>
                <Divider />
                <MenuItem
                    onClick={() => handleMenuClick('logout')}
                    sx={{
                        [`& .${listItemIconClasses.root}`]: {
                            ml: 'auto',
                            minWidth: 0,
                        },
                    }}
                >
                    <ListItemText>Logout</ListItemText>
                    <ListItemIcon>
                        <LogoutRoundedIcon fontSize="small" />
                    </ListItemIcon>
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
}
