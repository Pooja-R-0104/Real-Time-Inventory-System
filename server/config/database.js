const { Sequelize } = require('sequelize');
require('dotenv').config();

const dbConfig = {
  dialect: 'postgres',
  logging: false,
};

// Add SSL configuration only when in production
if (process.env.NODE_ENV === 'production') {
  dbConfig.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for some cloud providers
    },
  };
}

const sequelize = new Sequelize(process.env.DATABASE_URL, dbConfig);

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully. ✅');
  } catch (error) {
    console.error('Unable to connect to the database: 🔴', error);
  }
};

module.exports = { sequelize, testDbConnection };