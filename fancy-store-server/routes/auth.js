const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { User } = require('../models');
const { generateToken } = require('../services/jwtService');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { Name, Email, Mobile, Password } = req.body;

    const exists = await User.findOne({ where: { Email } });
    if (exists) return res.status(400).json({ message: 'Email or Mobile already registered' });

    const mobileExists = await User.findOne({ where: { Mobile } });
    if (mobileExists) return res.status(400).json({ message: 'Email or Mobile already registered' });

    const PasswordHash = await bcrypt.hash(Password, 11);
    const user = await User.create({ Name, Email, Mobile, PasswordHash });

    const token = generateToken(user);
    return res.json({ token, role: user.Role, userId: user.UserId, name: user.Name, email: user.Email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { Email, Password } = req.body;

    const user = await User.findOne({ where: { Email } });
    if (!user || !(await bcrypt.compare(Password, user.PasswordHash))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.IsBlocked) return res.status(401).json({ message: 'Account blocked' });

    const token = generateToken(user);
    return res.json({ token, role: user.Role, userId: user.UserId, name: user.Name, email: user.Email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/auth/update-admin
router.get('/update-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ where: { Email: 'admin@gmail.com' } });
    if (admin) {
      admin.PasswordHash = await bcrypt.hash('queenakka@123', 11);
      await admin.save();
    }
    return res.json('Admin password updated');
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
