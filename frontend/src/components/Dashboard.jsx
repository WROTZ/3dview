import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import ModelViewer from "./ModelViewer";
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    Typography,
    Container,
    CircularProgress,
    } from "@mui/material";
    import CloudUploadIcon from "@mui/icons-material/CloudUpload";

    export default function Dashboard() {
    const [models, setModels] = useState([]);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

    // ✅ Memoized fetchModels to satisfy ESLint
    const fetchModels = useCallback(async () => {
        try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/models`);
        setModels(res.data);
        } catch (err) {
        console.error("Error fetching models:", err);
        } finally {
        setLoading(false);
        }
    }, [API_URL]);

    useEffect(() => {
        fetchModels();
    }, [fetchModels]);

    // ✅ Upload a new model
    const uploadModel = async () => {
        if (!file) return alert("Please select a file");
        const formData = new FormData();
        formData.append("model", file);

        try {
        setUploading(true);
        await axios.post(`${API_URL}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setFile(null);
        await fetchModels(); // Refresh list after upload
        } catch (err) {
        console.error("Error uploading:", err);
        alert("Upload failed");
        } finally {
        setUploading(false);
        }
    };

    return (
        <Container
        maxWidth="lg"
        sx={{
            background: "linear-gradient(135deg, #e0f7fa, #e1bee7)",
            minHeight: "100vh",
            padding: "30px",
            borderRadius: "10px",
        }}
        >
        <Typography
            variant="h3"
            align="center"
            sx={{
            color: "#4a148c",
            fontWeight: "bold",
            mb: 4,
            textShadow: "1px 1px 3px rgba(0,0,0,0.2)",
            }}
        >
            3D Model Viewer
        </Typography>

        {/* ✅ Upload Section */}
        <Card
            sx={{
            maxWidth: 400,
            mx: "auto",
            mb: 4,
            p: 2,
            boxShadow: 6,
            borderRadius: 3,
            textAlign: "center",
            background: "linear-gradient(135deg, #f3e5f5, #e1f5fe)",
            }}
        >
            <CardContent>
            <Typography variant="h5" sx={{ color: "#6a1b9a", mb: 2 }}>
                Upload a 3D Model
            </Typography>
            <input
                type="file"
                accept=".glb"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ marginBottom: "10px" }}
            />
            <br />
            <Button
                variant="contained"
                color="primary"
                startIcon={<CloudUploadIcon />}
                onClick={uploadModel}
                disabled={uploading}
                sx={{
                background: "linear-gradient(45deg, #7b1fa2, #512da8)",
                "&:hover": {
                    background: "linear-gradient(45deg, #512da8, #311b92)",
                },
                }}
            >
                {uploading ? "Uploading..." : "Upload"}
            </Button>
            </CardContent>
        </Card>

        {/* ✅ Models List */}
        <Typography
            variant="h4"
            align="center"
            sx={{ color: "#4a148c", fontWeight: "bold", mb: 3 }}
        >
            Uploaded 3D Models
        </Typography>

        {loading ? (
            <Box sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress />
            <Typography variant="body1" sx={{ mt: 1 }}>
                Loading models...
            </Typography>
            </Box>
        ) : models.length === 0 ? (
            <Typography align="center" sx={{ color: "#6a1b9a", mt: 3 }}>
            No models uploaded yet. Be the first to upload!
            </Typography>
        ) : (
            <Grid container spacing={3}>
            {models.map((m) => (
                <Grid item xs={12} sm={6} md={4} key={m._id}>
                <Card
                    sx={{
                    p: 2,
                    boxShadow: 4,
                    borderRadius: 3,
                    transition: "transform 0.3s ease",
                    "&:hover": {
                        transform: "scale(1.03)",
                        boxShadow: 6,
                    },
                    }}
                >
                    <Typography
                    variant="h6"
                    sx={{ textAlign: "center", color: "#311b92", mb: 1 }}
                    >
                    {m.name}
                    </Typography>
                    <Box
                    sx={{
                        height: 300,
                        width: "100%",
                        position: "relative",
                    }}
                    >
                    <ModelViewer modelUrl={`${API_URL}${m.filePath}`} />
                    </Box>
                </Card>
                </Grid>
            ))}
            </Grid>
        )}
        </Container>
    );
}
