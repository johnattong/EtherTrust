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
import {useNavigate} from "react-router-dom";
import Stack from '@mui/material/Stack';





export default function SignInCard() {
    const navigate = useNavigate();
    const [isValid, setIsValid] = React.useState(true);
    const [signIn, setSignIn] = React.useState(false);

    // submit handler... validates inputs, tries login -> shows success and navigate to dashboard if success
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const isFormValid = validateInputs();
        setIsValid(isFormValid);
        if (!isFormValid) return;

        const data = new FormData(event.currentTarget);

        const response = await fetch('http://localhost:3000/api/user/login', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email: data.get('email')?.toString(),
                password: data.get('password')?.toString(),
            }),
            credentials: "include",
        });
        if (response.ok) {
            const result = await response.json();
            localStorage.setItem('token', result.token);
            setSignIn(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        }
        else{
            setIsValid(false);
            setSignIn(false);
        }
    }

    // ensure email/password inputs are valid
    const validateInputs = (): boolean => {
        const email = document.getElementById('email') as HTMLInputElement;
        const password = document.getElementById('password') as HTMLInputElement;

        if (!validateEmail(email.value)) return false;
        if (!validatePassword(password.value)) return false;
        return true;
    }
    const validateEmail = (email: string) => {
        // Regular expression for basic email validation
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };
    const validatePassword = (password: string) => {
        // Password should have at least 8 characters, including a number and a special character
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
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
        <Stack direction="column" alignItems="center" spacing={2} sx={{ mt: 6 }}>
          <Typography variant="h4" sx={{ textAlign: 'center' }}>
            Welcome to EtherTrust
          </Typography>
          <Typography variant="body1" sx={{ textAlign: 'center', maxWidth: 525 }}>
            Our app helps people access small, affordable loans when they need them most Simple, secure, and fast!
          </Typography>
      
          {/* container for sign-in */}
          <Card variant="outlined" sx={{ width: 400, mt: 2 }}>
            <Typography component="h1" variant="h3">
              Sign In
            </Typography>
      
            <Box
              component="form"
              name="signIn"
              id="signIn"
              onSubmit={handleSubmit}
              noValidate
              sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 2 }}
            >
              <FormControl>
                <FormLabel htmlFor="email">Email</FormLabel>
                <TextField
                  id="email"
                  type="email"
                  name="email"
                  error={!isValid}
                  placeholder="username@email.com"
                  autoComplete="email"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <FormLabel htmlFor="password">Password</FormLabel>
                </Box>
                <TextField
                  name="password"
                  error={!isValid}
                  placeholder="••••••••••"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                />
              </FormControl>
              <Button type="submit" fullWidth variant="contained">
                Sign in
              </Button>
              <Typography sx={{ textAlign: 'center' }}>
                Don&apos;t have an account?{' '}
                <span>
                  <Link href="/signup" variant="body2" sx={{ alignSelf: 'center' }}>
                    Sign up
                  </Link>
                </span>
              </Typography>
              {!isValid && (
                <Alert variant="filled" severity="error">
                  Invalid email/password
                </Alert>
              )}
              {signIn && (
                <Alert variant="filled" severity="success">
                  Signed in successfully!
                </Alert>
              )}
            </Box>
          </Card>
        </Stack>
      );
    } 