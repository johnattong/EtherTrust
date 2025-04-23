import {Alert, Backdrop, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import * as React from "react";
import {styled} from "@mui/material/styles";
import MuiCard from "@mui/material/Card";
import Button from "@mui/material/Button";


interface Props {
    open: boolean;
    close: () => void;
}

//backdrop where user can change password
export default function changePassword({open, close}: Props) {
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [wrongPassword, setWrongPassword] = React.useState(false);
    const [wrongPasswordMessage, setWrongPasswordMessage] = React.useState('');
    const [matchError, setMatchError] = React.useState(false);
    const [matchErrorMessage, setMatchErrorMessage] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');

    const token = localStorage.getItem('token');


    const validatePassword = (password: string) => {
        // Password should have at least 8 characters, including a number and a special character
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    };

    const validateInputs = () => {
        const password = document.getElementById('password') as HTMLInputElement;
        const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement;

        let isValid = true;


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


        return isValid;

    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        if (!(event.currentTarget instanceof HTMLFormElement)) return;
        event.preventDefault();
        if (!validateInputs()) return;

        const data = new FormData(event.currentTarget);

        const response = await fetch('http://localhost:3000/api/user/change-password', {
            method: 'POST',
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({
                currentPassword: data.get('currentPassword')?.toString(),
                newPassword: data.get('password')?.toString(),
            }),
            credentials: "include",
        });


        if (response.ok){
            setMatchError(false);
            setPasswordError(false);
            setWrongPassword(false);
            setMatchErrorMessage('');
            setPasswordErrorMessage('');
            setWrongPasswordMessage('');
            setSuccess(true);
            setSuccessMessage('Successfully changed password!');
            setTimeout(() => {
                close();
            }, 1000);

        }
        else{
            const status = response.status;
            const result = await response.json();
            if (status == 401){
                setWrongPassword(true);
                setWrongPasswordMessage(result.error)
            }
            else if (status == 400){
                setPasswordError(true);
                setPasswordErrorMessage('Passwords must be at least 8 characters long, include at least 1 digit, and include at least 1 special character (@$!%*?&).');
            }
            else{
                setSuccess(false);
                setSuccessMessage(result.error);
            }
        }
    }

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
        <Backdrop
            sx={(theme) => ({ zIndex: theme.zIndex.drawer + 2 })}
            open={open}
        >
            <Card
                component="form"
                //@ts-ignore
                onSubmit={handleSubmit}
                noValidate
                variant="outlined"
            >
                <Typography variant="h3">Change Password</Typography>

                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="password">Current Password</FormLabel>
                    </Box>
                    <TextField
                        name="currentPassword"
                        error={wrongPassword}
                        helperText={wrongPasswordMessage}
                        placeholder="••••••••••"
                        type="password"
                        id="currentPassword"
                        autoComplete="current-password"
                        autoFocus
                        required
                        fullWidth
                        variant="outlined"
                        color={wrongPassword ? 'error' : 'primary'}
                    />
                </FormControl>
                <FormControl>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <FormLabel htmlFor="password">New Password</FormLabel>
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

                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button variant="contained" color="error" onClick={close} fullWidth>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" fullWidth>
                    Change Password
                  </Button>
                </Box>

                {success && (
                    <Alert severity="success" variant="filled">{successMessage}</Alert>
                )}

                {(!success && successMessage) && (
                    <Alert severity="error" variant="filled">{successMessage}</Alert>
                )}


            </Card>
        </Backdrop>

);
}