const { Sequelize } = require('sequelize');
require('dotenv').config(); // This loads the .env file

// Create a new Sequelize instance and connect to the database
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Set to true to see SQL queries in the console
});

// Test the database connection
const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully. ✅');
  } catch (error) {
    console.error('Unable to connect to the database: 🔴', error);
  }
};

// Export the sequelize instance and the test function
module.exports = { sequelize, testDbConnection };