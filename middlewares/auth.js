const jwt = require('jsonwebtoken');
const userModel = require('../models/users');
require('dotenv').config();

const authenticateUser = async(req,res,next) =>{
 
const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    // 2. Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    // 3. Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    // 4. Send response
    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      },
      token
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



}
module.exports = {authenticateUser};
