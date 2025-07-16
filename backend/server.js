import fs from "fs";
import path from "path";
import multer from "multer";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// ✅ Initialize App
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer storage to save files physically
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// ✅ MongoDB Connection (fixed)
mongoose
  .connect(
    "mongodb+srv://shibil:123shibil%40mB@cluster0.8z6dqvc.mongodb.net/3dmodels?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Create a Schema & Model
const modelSchema = new mongoose.Schema({
  name: String,
  filePath: String,
  uploadedAt: { type: Date, default: Date.now },
});

const Model = mongoose.model("Model", modelSchema);

// ✅ Upload Route
app.post("/upload", upload.single("model"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newModel = new Model({
      name: req.file.originalname,
      filePath: `/uploads/${req.file.filename}`,
    });

    await newModel.save();

    res.status(200).json({
      message: "Uploaded successfully",
      file: `/uploads/${req.file.filename}`,
    });
  } catch (err) {
    console.error("❌ Upload error:", err);
    res
      .status(500)
      .json({ message: "Error uploading model", error: err.message });
  }
});

// ✅ Get All Models (for Dashboard.jsx)
app.get("/models", async (req, res) => {
  try {
    const models = await Model.find().sort({ uploadedAt: -1 }); // latest first
    res.status(200).json(models);
  } catch (err) {
    console.error("❌ Error fetching models:", err);
    res.status(500).json({ message: "Error fetching models" });
  }
});

// ✅ Serve static files (to access uploads directly in browser)
app.use("/uploads", express.static("uploads"));

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
