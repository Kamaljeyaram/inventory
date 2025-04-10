module.exports = {
  database: {
    host: 'localhost',
    user: 'invuser',
    password: '12345678',
    name: 'inventory_management',
    port: 3306
  },
  // Add any other configurations like JWT, server settings, etc.
  server: {
    port: process.env.PORT || 5000
  }
};