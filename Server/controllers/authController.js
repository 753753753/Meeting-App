const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({ name, email, role, password: hashedPassword });
    await newUser.save();

    // Generate token after user registration
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send success response with token and user data
    res.status(201).json({
      message: "User registered successfully",
      token,
      role,
      user: { id: newUser._id, name: newUser.name, email: newUser.email , teamLeader: user.teamLeader},
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // Generate token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    // Send success response with token and user data
    res.status(200).json({
      message: "Login successful",
      token,
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email , teamLeader: user.teamLeader},
    });
  } catch (error) {
     console.error("Login error:", err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message,     // 👈 add this
      stack: err.stack        // 👈 optional, helps debug
    });
  }
};

exports.googlelogin = async (req, res) => {
  const { email, name, uid, image } = req.body;

  let user = await User.findOne({ email });
  console.log("image", image);

  if (!user) {
    // Create new user if not found
    user = new User({ email, name, googleId: uid, image });
    await user.save();
  } else {
    // Update image if not already set
    if (!user.image && image) {
      user.image = image;
      await user.save();
    }
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

  // Send success response with token and user data
  res.status(200).json({
    message: "Login successful",
    token,
    role: user.role,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      image: user.image,
      teamLeader: user.teamLeader
    },
  });
};

exports.googleRegisterUser = async (req, res) => {
  try {
    const { name, email, uid , role , image} = req.body;

    if (!name || !email || !uid) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create user without password
      user = new User({
        name,
        email,
        role,
        googleId: uid, // store Firebase UID or Google UID
        image
      });

      await user.save();
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'User registered/logged in via Google',
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        teamLeader: user.teamLeader
      },
    });
  } catch (error) {
    console.error("Google Register Error:", error);
    res.status(500).json({ message: 'Server error', error });
  }
};
