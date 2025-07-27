const express = require('express');
const cors = require('cors'); // ✅ Add this line
const { sequelize, testDbConnection } = require('./config/database');
const exportRoutes = require('./routes/export.routes');

// Import all models to ensure relationships are established
const User = require('./models/user.model');
const Product = require('./models/product.model');
const InventoryMovement = require('./models/inventoryMovement.model');

// Import routes
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const logRoutes = require('./routes/log.routes');

const app = express();
const PORT = 5001;

app.use(cors()); // ✅ Enable CORS here (this line must be before the routes)
app.use(express.json());

// --- Define Relationships ---
Product.hasMany(InventoryMovement, { foreignKey: 'productId' });
InventoryMovement.belongsTo(Product, { foreignKey: 'productId' });

User.hasMany(InventoryMovement, { foreignKey: 'userId' });
InventoryMovement.belongsTo(User, { foreignKey: 'userId' });

// Use the routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/export', exportRoutes);

// Function to start the server
const startServer = async () => {
  await testDbConnection();
  await sequelize.sync({ force: true });
  console.log('All models were synchronized successfully. 🔄');

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
