const fs = require('fs');
const path = require('path');

// Load .env file for local development
// In GitHub Actions, this file won't exist, and that's fine (vars come from system env)
const dotenv = require('dotenv');
dotenv.config();

// Define the content of the environment file
const envConfigFile = `
export const environment = {
  production: ${process.env.NODE_ENV === 'production'},
  apiUrl: '${process.env.API_URL || ""}'
};
`;

// Define target paths
// Note: We write to both to ensure the compiler always has the value regardless of build mode
const targetPath = path.join(__dirname, './src/environments/environment.ts');
const targetPathDev = path.join(__dirname, './src/environments/environment.development.ts');

// Write the files
fs.writeFile(targetPath, envConfigFile, function (err) {
  if (err) console.log(err);
  console.log(`Output generated at ${targetPath}`);
});

fs.writeFile(targetPathDev, envConfigFile, function (err) {
  if (err) console.log(err);
  console.log(`Output generated at ${targetPathDev}`);
});