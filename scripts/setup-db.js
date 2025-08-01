const { execSync } = require('child_process');
const path = require('path');

console.log('Setting up database...');

try {
  // Run database migrations
  console.log('Running database migrations...');
  execSync('npx drizzle-kit push', { stdio: 'inherit' });
  
  console.log('Database setup completed successfully!');
} catch (error) {
  console.error('Error setting up database:', error.message);
  process.exit(1);
} 