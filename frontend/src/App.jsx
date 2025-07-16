import React from "react";
import Dashboard from "./components/Dashboard";
import { AppBar, Toolbar, Typography, Container, Box } from "@mui/material";

export default function App() {
    return (
        <div>
        {/* ✅ Top AppBar */}
        <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
            <Toolbar>
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
                3D Model Viewer
            </Typography>
            </Toolbar>
        </AppBar>

        {/* ✅ Main Dashboard Area */}
        <Container sx={{ mt: 4 }}>
            <Box
            sx={{
                backgroundColor: "#f0f4ff",
                borderRadius: 2,
                padding: 3,
                boxShadow: 4,
            }}
            >
            <Dashboard />
            </Box>
        </Container>
        </div>
    );
}
