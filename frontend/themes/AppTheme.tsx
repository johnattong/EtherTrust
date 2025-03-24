import { createTheme } from "@mui/material";

const darkTheme = createTheme({
    palette: {
        mode: "dark",  // Set the mode to "dark"
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h1: {
            fontSize: 48,
            fontWeight: 600,
            lineHeight: 1.2,
            letterSpacing: -0.5,
        },
        h2: {
            fontSize: 36,
            fontWeight: 600,
            lineHeight: 1.2,
        },
        h3: {
            fontSize: 30,
            fontWeight: 600,
            lineHeight: 1.2,
        },
        h4: {
            fontSize: 24,
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h5: {
            fontSize: 20,
            fontWeight: 600,
        },
        h6: {
            fontSize: 18,
            fontWeight: 600,
        },
        subtitle1: {
            fontSize: 18,
        },
        subtitle2: {
            fontSize: 14,
            fontWeight: 500,
        },
        body1: {
            fontSize: 14,
        },
        body2: {
            fontSize: 14,
            fontWeight: 400,
        },
        caption: {
            fontSize: 12,
            fontWeight: 400,
        },
    }
});

export { darkTheme };