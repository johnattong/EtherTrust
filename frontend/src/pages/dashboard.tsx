import * as React from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import {jwtDecode} from "jwt-decode";
import SideMenu from "./components/sidemenu.tsx"
import About from "./components/about";
import MenuAppBar from "./components/appbar.tsx";
import {styled} from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import {Alert, Backdrop, Divider} from "@mui/material";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import TextField from "@mui/material/TextField";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";

export default function Dashboard() {


    // decode data
    const token = localStorage.getItem('token');
    //@ts-ignore
    const data = jwtDecode(token);

    // user info
    //@ts-ignore
    const id = data.id;
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

    const [drawerOpen, setDrawerOpen] = React.useState(true);

    const toggleDrawer = () => {
        if (drawerOpen) {
            setDrawerOpen(false);
        }
        else{
            setDrawerOpen(true);
        }
    }

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


    // get loans for user
    const getItems = async () => {
        const response = await fetch('http://localhost:3000/api/loan/mine', {
            method: 'GET',
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}`},
            credentials: "include",
        });

        const res = await response.json();
        const items = res;
        return items;
    }

    //@ts-ignore
    const [items, setItems] = React.useState<Item[]>([]);
    const [borrowItems, setBorrowItems] = React.useState<Item[]>([]);
    const [lendItems, setLendItems] = React.useState<Item[]>([]);

    React.useEffect(() => {
        const fetchItems = async () => {

            const data = await getItems();
            setItems(data);
            setBorrowItems(data.filter((item: Item) => item.borrower === email));
            setLendItems(data.filter((item: Item) => item.lender === email));
        };

        fetchItems();
    }, []);

    const [backdropOpen, setBackdropOpen] = React.useState(false);
    const [selectedLoan, setSelectedLoan] = React.useState<Item | null>(null);

    // open backdrop if loan is clicked
//@ts-ignore
    const handleBackdrop = (loan) => {
        setSelectedLoan(loan);
        setBackdropOpen(true);
    }

    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const [success, setSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState("");

    // handle repayment
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        if (!(event.currentTarget instanceof HTMLFormElement)) return;
        event.preventDefault();

        const data = new FormData(event.currentTarget);

        const repayment = parseFloat(data.get('repayment')?.toString() || '0');

        if (repayment > (selectedLoan?.amount ?? 0)) {
            setError(true);
            setErrorMessage("This amount is greater than the amount on the loan.")
            return;
        }

        // send req to partially repay loan
//@ts-ignore
        const response = await fetch(`http://localhost:3000/api/loan/repay/partial/${selectedLoan._id}`, {
            method: 'POST',
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
                amount: repayment
            }),
            credentials: "include",
        });

        const res = await response.json();

        if (response.ok) {
            setSuccess(true);
            setSuccessMessage(res.message);
            setTimeout(() => {
                setBackdropOpen(false);
            }, 1000);
        }
        else{
            setError(true);
            setErrorMessage(res.error);
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



    return (
        <Box sx={{ display: 'flex' }}>

            <SideMenu
                open={drawerOpen}
                onAboutClick={handleAbout}
            />
            <About open={about} closeAbout={handleCloseAbout}/>
            <MenuAppBar toggleDrawer={toggleDrawer}  open={drawerOpen} name={name} email={email}/>

            <Box component="main"
                 sx={{
                     flexGrow: 1,
                     overflow: 'auto',
                     pt: 10
                 }}>



                <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="center">

                  <Card variant="outlined" sx={{ flex: 1, alignSelf: 'flex-start' }}>
                    <Typography variant='h3'>
                      Your Borrowed Loans
                    </Typography>
                    <Box sx={{ height: 2, width: '100%', background: 'linear-gradient(to right, #444, transparent)' }} />
                    <Stack sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
                      <List>
                        {borrowItems.map((item, index) => (
                          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                              sx={{
                                '&.Mui-selected': {
                                  bgcolor: 'action.selected',
                                  color: 'text.primary',
                                },
                                '&.Mui-selected:hover': {
                                  bgcolor: 'action.selected',
                                },
                              }}
                              onClick={() => {handleBackdrop(item)}}
                            >
                              <ListItemText
                                primary={
                                  <Typography variant="h4" color={item.lender ? "text.primary" : "error"} noWrap={true}>
                                    {item.lender || "Not funded yet"}
                                  </Typography>
                                }
                                sx={{ pr: 6 }}
                              />
                              <ListItemText
                                primary={
                                  <Typography variant="h6" color="text.primary" noWrap={true}>
                                    ${item.amount.toFixed(2)}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2" color="text.secondary" noWrap={true}>
                                    {`${item.duration} days • ${item.interestRate}% interest`}
                                  </Typography>
                                }
                                sx={{ pr: 6 }}
                              />
                              <ListItemIcon><NavigateNextRoundedIcon/></ListItemIcon>
                            </ListItemButton>
                            <Divider />
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  </Card>

                  <Card variant="outlined" sx={{ flex: 1 }}>
                    <Typography variant='h3'>
                      Your Lent Loans
                    </Typography>
                    <Box sx={{ height: 2, width: '100%', background: 'linear-gradient(to right, #444, transparent)' }} />
                    <Stack sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
                      <List>
                        {lendItems.map((item, index) => (
                          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                              sx={{
                                '&.Mui-selected': {
                                  bgcolor: 'action.selected',
                                  color: 'text.primary',
                                },
                                '&.Mui-selected:hover': {
                                  bgcolor: 'action.selected',
                                },
                              }}
                              onClick={() => {handleBackdrop(item)}}
                            >
                              <ListItemText
                                primary={
                                  <Typography variant="h4" color={item.borrower ? "text.primary" : "error"}>
                                    {item.borrower || "No borrower yet"}
                                  </Typography>
                                }
                                sx={{ pr: 6 }}
                              />
                              <ListItemText
                                primary={
                                  <Typography variant="h6" color="text.primary">
                                    ${item.amount.toFixed(2)}
                                  </Typography>
                                }
                                secondary={
                                  <Typography variant="body2" color="text.secondary">
                                    {`${item.duration} days • ${item.interestRate}% interest`}
                                  </Typography>
                                }
                                sx={{ pr: 6 }}
                              />
                              <ListItemIcon><NavigateNextRoundedIcon/></ListItemIcon>
                            </ListItemButton>
                            <Divider />
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  </Card>
                </Stack>

                <Backdrop open={backdropOpen} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, color: '#fff' }}>
                  {selectedLoan && (
                    <Card
                        component="form"
                        //@ts-ignore
                        onSubmit={handleSubmit}
                        noValidate
                        variant="outlined"
                    >
                      <Stack spacing={2}>
                        <Typography variant="h4">Loan Details</Typography>
                        <Typography variant="body2" color="text.secondary" noWrap={true}>Loan ID: ${selectedLoan._id}</Typography>
                        <Typography variant="h6">Amount: ${selectedLoan.amount}</Typography>
                        <Typography variant="h6">Interest Rate: {selectedLoan.interestRate}%</Typography>
                        <Typography variant="h6">Duration: {selectedLoan.duration} days</Typography>
                        <Typography variant="h6">Status: {selectedLoan.status}</Typography>
                        <Typography variant="h6">Lender: {selectedLoan.lender || "N/A"}</Typography>
                        <Typography variant="h6">Borrower: {selectedLoan.borrower || "N/A"}</Typography>
                        {selectedLoan.lender === email || selectedLoan.lender === '' && (
                            <FormControl>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <FormLabel htmlFor="repayment">Repayment Amount</FormLabel>
                                </Box>
                            <TextField name="repayment"
                                       error={error}
                                       helperText={errorMessage}
                                       placeholder="1-${loan.amount.toFixed(2)}"
                                       type="number"
                                       id="repayment"
                                       autoFocus
                                       required
                                       fullWidth
                                       variant="outlined"
                                       color={'primary'}
                            />
                            <Button variant="contained" color="primary" type="submit">Repay</Button>
                            </FormControl>
                        )}
                        <Button variant="text" color="error" onClick={() => setBackdropOpen(false)}>Close</Button>
                      </Stack>
                        {success && (
                            <Alert severity="success" variant="filled">{successMessage}</Alert>
                        )}

                        {(!success && successMessage) && (
                            <Alert severity="error" variant="filled">{successMessage}</Alert>
                        )}
                    </Card>
                  )}
                </Backdrop>

            </Box>
        </Box>
    );

}