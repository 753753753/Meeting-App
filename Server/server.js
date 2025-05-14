const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./Config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const UpcomingmeetingRoutes = require("./routes/UpcomingmeetingRoutes");
const notesRoutes = require("./routes/notesRoutes");
const PreviousmeetingRoutes = require("./routes/PreviousmeetingRoutes");
const PersonalmeetingRoutes = require('./routes/PersonalmeetingRoutes')
const AdminRoutes = require('./routes/AdminRoutes');
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const allowedOrigins = ['http://localhost:5174']; // Your frontend URL

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // if you send cookies or use authentication
  })
); // Enable CORS
app.use(express.json()); // Parse JSON request bodies

// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/auth", authRoutes); // Login/Register
app.use("/api/Upcomingmeetings", UpcomingmeetingRoutes); // Create/Join meetings
app.use("/api/notes", notesRoutes); // Meeting notes & transcripts
app.use("/api/Previousmeetings" , PreviousmeetingRoutes )
app.use('/api/Personalmeetings' , PersonalmeetingRoutes)
app.use('/api/adminroutes' , AdminRoutes );

// Error handling middleware (optional but recommended)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
