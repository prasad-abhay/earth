const express = require("express");
const connectDB = require("./connectdb");
const apiRoutes = require("./routes/earthroutes");
const cors = require("cors");
const { configDotenv } = require("dotenv");

configDotenv();
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS (with correct config)
// app.use(
//   cors({
//     origin: [
//       "http://localhost:8080",
//       "https://earth-5gd40z0ct-abhay-prasads-projects-7e2e6327.vercel.app",
//     ],
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// );

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);


app.use(express.json());

// Connect to DB
connectDB();

app.get("/", (req, res) => {
  res.send(`hello world`);
});

// Use API routes
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
