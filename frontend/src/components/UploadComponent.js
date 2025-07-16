import React, { useState } from "react";
import axios from "axios";

const UploadComponent = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
        setMessage("Please select a file first!");
        return;
        }

        const formData = new FormData();
        formData.append("model", file);

        try {
        const res = await axios.post("http://localhost:5000/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        setMessage(`✅ Uploaded successfully: ${res.data.file}`);
        } catch (err) {
        console.error(err);
        setMessage("❌ Upload failed!");
        }
    };

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Upload 3D Model (.glb)</h2>
        <input type="file" accept=".glb" onChange={handleFileChange} />
        <button
            onClick={handleUpload}
            style={{
            marginLeft: "10px",
            padding: "8px 15px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
            }}
        >
            Upload
        </button>
        <p>{message}</p>
        </div>
    );
};

export default UploadComponent;
