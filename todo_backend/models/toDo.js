import { DataTypes } from 'sequelize';
import sequelize from '../config/config.js';


const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,  // Automatically increments for each new task
    primaryKey: true,     // Sets 'id' as the primary key
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,  // userId is required
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,  // Title is required
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,  // Description is optional
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,  // Default to false (incomplete)
  },
  created: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,  // Set to current timestamp by default
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,  // Can be null if no due date is provided
  },
});

export default Task;
