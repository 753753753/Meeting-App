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
const groupChatRoutes = require('./routes/groupChatRoutes')
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ✅ Fix for COOP/COEP issues with Firebase popups
app.use((req, res, next) => {
  res.removeHeader("Cross-Origin-Opener-Policy");
  res.removeHeader("Cross-Origin-Embedder-Policy");
  next();
});

// Middleware
const allowedOrigins = ['http://localhost:5173']; // Your frontend URL

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // if you send cookies or use authentication
  })
);
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("API is running...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/Upcomingmeetings", UpcomingmeetingRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/Previousmeetings", PreviousmeetingRoutes);
app.use('/api/Personalmeetings', PersonalmeetingRoutes);
app.use('/api/adminroutes', AdminRoutes);
app.use('/api/groupChat' , groupChatRoutes);
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
