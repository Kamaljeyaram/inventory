const { pool } = require('../config/database');
const logger = require('./logger');

async function testDatabaseConnection() {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    logger.info('✅ Database connection test successful');
    
    // Try a simple query
    const [rows] = await connection.query('SELECT 1 as test');
    logger.info(`Query result: ${JSON.stringify(rows)}`);
    
    // Release the connection
    connection.release();
    return true;
  } catch (error) {
    logger.error(`❌ Database connection test failed: ${error.message}`);
    return false;
  }
}

// Run the test
testDatabaseConnection()
  .then(result => {
    console.log(`Database test ${result ? 'passed' : 'failed'}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Test execution error:', err);
    process.exit(1);
  });