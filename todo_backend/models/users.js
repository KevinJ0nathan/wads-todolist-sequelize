import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';

import bcrypt from 'bcryptjs'; // For password hashing

const User = sequelize.define('User', {
  uid: {
    type: DataTypes.STRING,
    unique: true, // Ensure the uid is unique
    allowNull: false,  // User ID is required
    primaryKey: true, // Set the uid as the primary key
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,  // Name is required
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,  // Email is required
    unique: true,  // Ensure email is unique
    validate: {
      isEmail: true,  // Ensure email is valid
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,  // Password is required
    set(value) {
      // Hash the password before saving it
      const hashedPassword = bcrypt.hashSync(value, 10); // You can adjust the salt rounds (10 is a common value)
      this.setDataValue('password', hashedPassword);
    },
  },
});

// Method to check if the provided password matches the stored password
User.prototype.isValidPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

export default User;
