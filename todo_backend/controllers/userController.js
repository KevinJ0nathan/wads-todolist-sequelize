import { v4 as uuidv4 } from 'uuid';
import User from '../models/users.js';  // Import the User model
import bcrypt from 'bcryptjs';  // Import bcrypt for password hashing
import jwt from 'jsonwebtoken';  // Import jwt for token generation

export const createUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
  
      // Check if the user already exists by email
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      // Create a new user (password will be automatically hashed by the model's set method)
      const newUser = await User.create({
        uid: uuidv4(),  // Generate a new UID
        name,
        email,
        password,  // No need to hash the password here anymore
      });
  
      res.status(201).json({
        uid: newUser.uid,
        name: newUser.name,
        email: newUser.email,
      });
    } catch (error) {
      console.error('Error creating user:', error);
  
      // Handle specific Sequelize validation errors
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: 'Email already exists' });
      }
  
      res.status(500).json({ message: 'Failed to create user' });
    }
  };

// Get a single user by email
export const getUserByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get user' });
  }
};

// Update user details
export const updateUser = async (req, res) => {
  const { name, password } = req.body;

  // Extract token from Authorization header
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Authorization token is required' });
  }

  try {
    // Decode the token to get user information
    const decoded = jwt.decode(token);

    if (!decoded || !decoded.uid) {
      return res.status(401).json({ message: 'Invalid or missing token' });
    }

    const userId = decoded.uid; // Get the userId from the decoded token

    // Find the user by UID
    const user = await User.findOne({ where: { uid: userId } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user details
    user.name = name || user.name;
    // Only update the password if it's provided (not empty)
    if (password && password.trim() !== '') {
      user.password = password;
    }

    // Save the updated user details
    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the entered password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { uid: user.uid, name: user.name, email: user.email },
      process.env.JWT_SECRET,  // You should set JWT_SECRET in your environment variables
      { expiresIn: '1h' } // Token expiration (e.g., 1 hour)
    );

    // Respond with the token
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to log in' });
  }
};
