import {styled} from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import SideMenu from "./components/sidemenu.tsx";
import About from "./components/about.tsx";
import MenuAppBar from "./components/appbar.tsx";
import * as React from "react";
import {Alert, Box} from "@mui/material";
import {jwtDecode} from "jwt-decode";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

export default function Create() {

    // decode data
    const token = localStorage.getItem('token');
    const data = jwtDecode(token);

    // user info
    const id = data.id;
    const name = data.name;
    const email = data.email;
    const walletAddress = data.walletAddress;

    const [about, setAbout] = React.useState(false);
    const [isDirty, setIsDirty] = React.useState(false);

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

    const [success, setSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const amount = parseFloat(data.get('loanAmount')?.toString() || '0');
        const interestRate = parseFloat(data.get('interestRate')?.toString() || '0');
        const duration = parseInt(data.get('duration')?.toString() || '0', 10);
        try {
            const response = await fetch('http://localhost:3000/api/loan/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount, interestRate, duration }),
            });
            const res = await response.json();
            if (response.ok) {
                setSuccess(true);
                setSuccessMessage(res.message);
                setIsDirty(true);
            } else {
                setSuccess(false);
                setSuccessMessage(res.error);
            }
        } catch (err) {
            console.error(err);
            setSuccess(false);
            setSuccessMessage("There was an error creating loan.");
        }


    };

    const Card = styled(MuiCard)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        width: '100%',
        padding: theme.spacing(4),
        gap: theme.spacing(2),
        boxShadow:
            'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
        [theme.breakpoints.up('sm')]: {
            width: '450px',
        },
        ...theme.applyStyles('dark', {
            boxShadow:
                'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
        }),
    }));

    return (
        <Box sx={{ display: 'flex' }}>

            <SideMenu
                open={drawerOpen}
                onAboutClick={handleAbout}
            />
            <About open={about} closeAbout={handleCloseAbout}/>
            <MenuAppBar toggleDrawer={toggleDrawer}  open={drawerOpen} name={name} email={email}/>

            <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
                <Typography component="h2" variant="h2" sx={{ mb: 2 }}>
                    Create a Loan
                </Typography>
                <form onSubmit={handleSubmit} noValidate>
                    <Card variant="outlined">

                        <FormControl>
                            <FormLabel htmlFor="loanAmount">Enter a loan amount</FormLabel>
                            <TextField
                                id="loanAmount"
                                type="number"
                                name="loanAmount"
                                placeholder="1 - 1000000"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                  inputProps: { min: 1, max: 10000, step: 0.01 }
                                }}

                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="interestRate">Enter an interest rate</FormLabel>
                            <TextField
                                id="interestRate"
                                type="number"
                                name="interestRate"
                                placeholder="0 - 100"
                                autoComplete="off"
                                autoFocus
                                required
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                    inputProps: { min: 0, max: 100, step: 0.01 }
                                }}

                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="duration">Duration (days)</FormLabel>
                            <TextField
                                id="duration"
                                type="number"
                                name="duration"
                                placeholder="1 - 120"
                                required
                                fullWidth
                                variant="outlined"
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">days</InputAdornment>,
                                    inputProps: { min: 1, max: 120 }
                                }}

                            />
                        </FormControl>
                        <Button type="submit" variant="contained" fullWidth disabled={isDirty}>
                            Submit
                        </Button>

                        {success && (
                            <Alert severity="success" variant="filled">{successMessage}</Alert>
                        )}

                        {(!success && successMessage) && (
                            <Alert severity="error" variant="filled">{successMessage}</Alert>
                        )}
                    </Card>
                </form>
            </Box>
        </Box>
        );
}