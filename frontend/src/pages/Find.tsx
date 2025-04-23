import {styled} from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import SideMenu from "./components/sidemenu.tsx";
import About from "./components/about.tsx";
import MenuAppBar from "./components/appbar.tsx";
import * as React from "react";
import {Box, Typography, Button, Backdrop, Alert} from "@mui/material";
import {jwtDecode} from "jwt-decode";

export default function Find() {
    // decode data
    const token = localStorage.getItem('token');
    //@ts-ignore
    const data = jwtDecode(token);

    // user info
    //@ts-ignore
    const name = data.name;
    //@ts-ignore
    const email = data.email;
    //@ts-ignore
    const walletAddress = data.walletAddress;

    const [about, setAbout] = React.useState(false);

    const handleAbout= () => {
        setAbout(true);
    }
    const handleCloseAbout = () => {
        setAbout(false);
    }

    // states for UI elements
    const [drawerOpen, setDrawerOpen] = React.useState(true);

    const [backdropOpen, setBackdropOpen] = React.useState(false);
    const [alertMessage, setAlertMessage] = React.useState('');
    const [success, setSuccess] = React.useState(false);

    // list of items fetched from the API
    interface Item {
        _id: string;
        borrower: string;
        lender: string;
        amount: number;
        interestRate: number;
        duration: number;
        status: string;
        createdAt: string;
    }

        // fetch all available loans
    const getItems = async () => {
        const response = await fetch('http://localhost:3000/api/loan/all', {
            method: 'GET',
            headers: { "Content-Type": "application/json"},
            credentials: "include",
        });

        const res = await response.json();
        const items = res;
        console.log(items);
        return items;
    }

    const [items, setItems] = React.useState<Item[]>([]);

    React.useEffect(() => {
        const fetchItems = async () => {

            const data = await getItems();
            console.log(data);
            setItems(data);
        };

        fetchItems();
    }, []);

    // if lender chooses a loan to fund -> send req to backend
//@ts-ignore
    const fundLoan = async (loanId) => {
        console.log(loanId);
        const response = await fetch(`http://localhost:3000/api/loan/fund/${loanId}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        const result = await response.json();
        setBackdropOpen(true);

        // set an alert for success/fail
        if (response.ok){
            setAlertMessage(result.message || 'Loan funded!');
            setSuccess(true);
        }
        else{
            setSuccess(false);
            setAlertMessage(result.message || result.error);
        }


        setTimeout(() => {
            setBackdropOpen(false);
            window.location.reload();
        }, 3000);
    };



    const toggleDrawer = () => {
        if (drawerOpen) {
            setDrawerOpen(false);
        }
        else{
            setDrawerOpen(true);
        }
    }

    // card style
    const Card = styled(MuiCard)(({ theme }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'flex-start',
        width: '100%',
        padding: theme.spacing(4),
        gap: theme.spacing(2),
        boxShadow:
            'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
        [theme.breakpoints.up('sm')]: {
            width: '100%',
        },
        ...theme.applyStyles('dark', {
            boxShadow:
                'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
        }),
        height: '100%',
    }));
    // @ts-ignore
    return (
        <Box sx={{ display: 'flex' }}>
            <SideMenu
                open={drawerOpen}
                onAboutClick={handleAbout}
            />
            <About open={about} closeAbout={handleCloseAbout}/>
            <MenuAppBar toggleDrawer={toggleDrawer}  open={drawerOpen} name={name} email={email}/>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    overflow: 'auto',
                }}
            >



                <Grid container spacing={2} sx={{ p: 2 }}>
                    {items.filter(item => item.lender === null).map(item => (
                        //@ts-ignore
                        <Grid item xs={12} sm={6} md={4} lg={3} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Card variant="outlined">
                                <Typography variant="h6">
                                    {`$${item.amount} at ${item.interestRate}% for ${item.duration} days`}
                                </Typography>
                                <Box sx={{
                                    height: 2,
                                    width: '100%',
                                    background: 'linear-gradient(to right, #444, transparent)'
                                }} />
                                <Typography variant="body2">
                                    {`Borrower: ${item.borrower || 'None'}`}
                                </Typography>
                                <Typography variant="body2" color="text.warning">
                                    {`Status: ${item.status}`}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {new Date(item.createdAt).toLocaleString()}
                                </Typography>
                                <Button variant='outlined' onClick={() => fundLoan(item._id)}>Fund</Button>


                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Backdrop open={backdropOpen} sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}>
                    {success && (
                        <Alert severity="success" variant="filled">{alertMessage}</Alert>
                    )}

                    {(!success) && (
                        <Alert severity="error" variant="filled">{alertMessage}</Alert>
                    )}
                </Backdrop>
            </Box>
        </Box>
    );

}