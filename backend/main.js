const express = require("express")
const connectDB = require("./connectdb");
const apiRoutes = require("./routes/earthroutes");
const cors = require("cors");
const { configDotenv } = require("dotenv");
configDotenv();
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
app.use(cors());

app.use(express.json());

// Connect to DB
connectDB();

app.get("/", (req, res) => {
  res.send(`hello world`);
});
// using cors 
app.use(
  cors({
    origin: ["http://localhost:8080","https://github.com/prasad-abhay/Earth-Data-Management"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, 
  })
);

// Use API routes
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
