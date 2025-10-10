// test-tidb.js - UPDATED
import mysql from 'mysql2/promise';

// Replace these with your actual credentials
const dbConfig = {
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  user: '4fdx3d4x.root', // ⚠️ Replace '4fdx3d4x' with your prefix
  password: 'your_actual_password', // ⚠️ Replace with real password
  database: 'sphynx_flicks',
  port: 4000,
  ssl: {
    rejectUnauthorized: true
  }
};

async function testConnection() {
  try {
    console.log('Attempting to connect to TiDB...');
    const connection = await mysql.createConnection(dbConfig);
    console.log('✅ Successfully connected to TiDB!');
    
    // Test creating users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        username VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created successfully!');
    
    await connection.end();
    console.log('✅ All tests passed! You can now run your server.');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n💡 Troubleshooting tips:');
    console.log('1. Make sure your username has the correct prefix');
    console.log('2. Verify your password is correct');
    console.log('3. Check if your IP is whitelisted in TiDB Cloud');
    console.log('4. Ensure database "sphynx_flicks" exists');
  }
}

testConnection();