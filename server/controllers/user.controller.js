const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // --- DIAGNOSTIC LOG ---
    console.log(`REGISTER ATTEMPT for ${email}. Received password: [${password}]`);
    // --------------------

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }
    const newUser = await User.create({ name, email, password, role });
    const userResponse = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
    res.status(201).json(userResponse);
  } catch (error) {
    console.error("!!! REGISTER ERROR:", error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // --- DIAGNOSTIC LOG ---
        console.log(`LOGIN ATTEMPT for ${email}. Received password for comparison: [${password}]`);
        // --------------------

        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log("LOGIN FAILED: User not found in database.");
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        
        // --- DIAGNOSTIC LOG ---
        console.log("LOGIN ATTEMPT: Found user in DB. Hashed password is:", user.password);
        // --------------------

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("LOGIN FAILED: bcrypt.compare returned false. Passwords do not match.");
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        
        console.log("LOGIN SUCCESS: Passwords matched.");
        const payload = { id: user.id, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({
            message: "Logged in successfully!",
            token: token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error("!!! LOGIN ERROR:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getUserProfile = async (req, res) => { /* ... unchanged ... */ };