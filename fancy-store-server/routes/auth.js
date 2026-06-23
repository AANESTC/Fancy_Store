const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const { User } = require('../models');
const { generateToken } = require('../services/jwtService');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    // Accept both lowercase (frontend) and capitalized field names
    const Name = req.body.Name || req.body.name;
    const Email = req.body.Email || req.body.email;
    const Mobile = req.body.Mobile || req.body.mobile;
    const Password = req.body.Password || req.body.password;

    if (!Email) return res.status(400).json({ message: 'Email is required' });

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
    // Accept both lowercase (frontend) and capitalized field names
    const Email = req.body.Email || req.body.email;
    const Password = req.body.Password || req.body.password;

    if (!Email) return res.status(400).json({ message: 'Email is required' });

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
