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
const teamchats = require('./routes/MessageRoutes')
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
const allowedOrigins = [
  'http://localhost:5173', // for local dev
  'https://meeting-app-client.onrender.com' // live frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman) or from allowed origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // needed if sending cookies or auth
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
app.use('/api/teamchats' , teamchats);
// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
