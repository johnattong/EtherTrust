import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import {Alert} from "@mui/material";




export default function SignUpCard() {


    // input error states
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [nameError, setNameError] = React.useState(false);
    const [nameErrorMessage, setNameErrorMessage] = React.useState('');
    const [matchError, setMatchError] = React.useState(false);
    const [matchErrorMessage, setMatchErrorMessage] = React.useState('');
    const [walletError, setWalletError] = React.useState(false);
    const [walletErrorMessage, setWalletErrorMessage] = React.useState('');

    // successful register alert
    const [success, setSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');

    // validate inputs, send request, if ok -> redirect to sign in to login, else show alert
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // if invalid do not send request
        if (!validateInputs()) return;

        const data = new FormData(event.currentTarget);
        const rawName = data.get('name')?.toString() || '';
        const capitalizedName = rawName
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');

        // send register request to backend
        const response = await fetch('http://localhost:3000/api/user/register', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: capitalizedName,
                email: data.get('email')?.toString(),
                password: data.get('password')?.toString(),
                walletAddress: data.get('walletAddress')?.toString(),
            }),
            credentials: "include",
        });

        // set alert and redirect to sign-in
        if (response.ok) {
            setSuccess(true);
            setSuccessMessage("Signup successful! Redirecting to sign-in...");
            setTimeout(() => {
                window.location.href = '/'
            }, 5000);
        }
        else{
            setSuccess(false);
            setSuccessMessage("Signup failed! Something went wrong...");
            window.location.reload();
        }
    };


    // ensure all inputs are valid
    const validateInputs = () => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;
        const name = document.getElementById('name') as HTMLInputElement;
        const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;
        const walletAddress = document.getElementById('walletAddress') as HTMLInputElement;

        let isValid = true;

        // email check
        if (!validateEmail(email.value)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email.');
            isValid = false;
        }
        else {
            setEmailError(false);
            setEmailErrorMessage('');
            isValid = true;
        }

        // password check
        if (!validatePassword(password.value)) {
            setPasswordError(true);
            setPasswordErrorMessage('Passwords must be at least 8 characters long, include at least 1 digit, and include at least 1 special character (@$!%*?&).');
            isValid = false;
        }
        else {

            // check for password confirmation
            if (confirmPassword.value !== password.value) {
                setMatchError(true);
                setMatchErrorMessage('Passwords do not match.');
                isValid = false;
                setPasswordError(true);
                setPasswordErrorMessage('');
            }
            else {
                setMatchError(false);
                setMatchErrorMessage('');
                isValid = true;
                setPasswordError(false);
                setPasswordErrorMessage('');
            }
        }


        // name check
        if (!validateName(name.value)) {
            setNameError(true);
            setNameErrorMessage('Please enter a valid name. Can only include letters, hyphens( - ) or apostrophes( \' ).');
            isValid = false;
        }
        else{
            setNameError(false);
            setNameErrorMessage('');
            isValid = true;
        }

        // wallet check
        if (!validateWallet(walletAddress.value)) {
            setWalletError(true);
            setWalletErrorMessage('Please enter a valid wallet address. It must begin with "0x" and have 40 characters follow.');
            isValid = false;
        }
        else{
            setWalletError(false);
            setWalletErrorMessage('');
            isValid = true;
        }

        return isValid;

    }
    const validateEmail = (email: string) => {
        // Regular expression for basic email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };
    const validateName = (name: string) => {
        const nameRegex = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
        return nameRegex.test(name);
    };
    const validatePassword = (password: string) => {
        // Password should have at least 8 characters, including a number and a special character
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };
    const validateWallet = (address: string) => {
        const walletRegex = /^0x[a-fA-F0-9]{40}$/;
        return walletRegex.test(address);
    };

    // card stylings
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

        // container for sign-up
        <Card
            variant="outlined"
        >
            <Typography
                component="h1"
                variant="h3">Sign Up</Typography>


            <Box
                component="form"
                name="signUp"
                id="signUp"
                onSubmit={handleSubmit}
                noValidate
                sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
                <FormControl>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <TextField
                        id="name"
                        type="name"
                        name="name"
                        error={nameError}
                        helperText={nameErrorMessage}
                        placeholder="First Last"
                        autoComplete="name"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={nameError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        error={emailError}
                        helperText={emailErrorMessage}
                        placeholder="username@email.com"
                        autoComplete="email"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={emailError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                    </Box>
                    <TextField
                        name="password"
                        error={passwordError}
                        helperText={passwordErrorMessage}
                        placeholder="••••••••••"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={passwordError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
                    </Box>
                    <TextField
                        name="confirmPassword"
                        error={matchError}
                        helperText={matchErrorMessage}
                        placeholder="••••••••••"
                        type="password"
                        id="confirmPassword"
                        autoComplete="current-password"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={matchError ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="walletAddress">Wallet Address</FormLabel>
                    </Box>
                    <TextField
                        name="walletAddress"
                        error={walletError}
                        helperText={walletErrorMessage}
                        placeholder="0x........."
                        type="text"
                        id="walletAddress"
                        autoComplete="off"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={walletError ? 'error' : 'primary'}
                    />
                </FormControl>
                <Button type="submit" fullWidth variant="contained">
                    Sign Up
                </Button>
                <Typography sx={{ textAlign: 'center' }}>
                    Already have an account?{' '}

            <Link
                href="/"
                variant="body2"
                sx={{ alignSelf: 'center' }}
            >
              Sign in
            </Link>

                </Typography>

                {success && (
                    <Alert severity="success" variant="filled">{successMessage}</Alert>
                )}

                {(!success && successMessage) && (
                    <Alert severity="error" variant="filled">{successMessage}</Alert>
                )}

            </Box>

        </Card>
    );
}
