import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
        main: "#6a1b9a", // Purple primary
        },
        secondary: {
        main: "#4a148c",
        },
    },
    });

    const container = document.getElementById("root");
    const root = createRoot(container);

    root.render(
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
    </ThemeProvider>
);
