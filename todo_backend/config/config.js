import { Sequelize } from 'sequelize';

// Create a new Sequelize instance and connect to SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',  // SQLite file where data will be stored
  logging: false,  // You can set this to true if you want to see SQL logs in your console
});

export default sequelize;
