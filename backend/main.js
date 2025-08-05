const express = require("express");
const path = require("path");
const connectDB = require("./connectdb");
const apiRoutes = require("./routes/earthroutes");
const cors = require("cors");
const { configDotenv } = require("dotenv");

configDotenv();
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to DB
connectDB();

// Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:8080", // local Vite dev server
      "https://prasad-abhay.github.io", // if ever using GitHub Pages
      "https://earth-data-management.onrender.com", // your Render frontend URL
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// ✅ Serve static frontend files from dist
app.use(express.static(path.join(__dirname, "dist")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ✅ Fallback route for client-side routing (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Use API routes
app.use("/api", apiRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
