const mysql2 = require('mysql2/promise');
const config = require('./config');
const logger = require('../utils/logger');

// Create MySQL connection pool
const pool = mysql2.createPool({
  host: config.database.host,
  user: config.database.user,
  password: config.database.password,
  database: config.database.name,
  port: config.database.port || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/**
 * Initializes the database connection and creates required tables
 */
const initDatabase = async () => {
  const MAX_RETRIES = 5;
  const RETRY_DELAY = 3000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const connection = await pool.getConnection();
      logger.info('✅ Database connection established');

      await createTables(connection);
      connection.release();
      return true;

    } catch (error) {
      logger.error(`❌ DB connection failed (Attempt ${attempt}/${MAX_RETRIES}): ${error.message}`);
      if (attempt < MAX_RETRIES) {
        logger.info(`🔁 Retrying in ${RETRY_DELAY / 1000} seconds...`);
        await new Promise(res => setTimeout(res, RETRY_DELAY));
      } else {
        logger.error('🚫 Maximum retry attempts reached. Exiting...');
        throw error;
      }
    }
  }
};

/**
 * Creates all necessary tables if they don't exist
 */
const createTables = async (connection) => {
  try {
    // Create Users table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'manager', 'staff') NOT NULL DEFAULT 'staff',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        sku VARCHAR(50) NOT NULL UNIQUE,
        category VARCHAR(50) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        cost DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL DEFAULT 0,
        reorder_level INT NOT NULL DEFAULT 5,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Suppliers table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS suppliers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        contact_person VARCHAR(100),
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT,
        category VARCHAR(50),
        notes TEXT,
        active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create Orders table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_number VARCHAR(50) NOT NULL UNIQUE,
        supplier_id INT NOT NULL,
        status ENUM('pending', 'ordered', 'received', 'cancelled') NOT NULL DEFAULT 'pending',
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        expected_date DATE,
        received_date DATE,
        notes TEXT,
        total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
        created_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
        FOREIGN KEY (created_by) REFERENCES users(id)
      )
    `);

    // Create Order Items table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        unit_price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      )
    `);

    logger.info('✅ Database tables created or already exist');
  } catch (error) {
    logger.error('❌ Error creating database tables', error);
    throw error;
  }
};

module.exports = {
  pool,
  initDatabase,
};
