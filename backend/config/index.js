require('dotenv').config();

const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  anakin: {
    apiKey: process.env.ANAKIN_API_KEY,
    agentId: process.env.ANAKIN_AGENT_ID
  }
};

// Validate environment variables at startup - crash fast if missing
const requiredKeys = [
  'ANAKIN_API_KEY',
  'ANAKIN_AGENT_ID'
];

for (const key of requiredKeys) {
  // Allow skipping strict validation if we are in MOCK_API mode
  if (!process.env[key] && process.env.MOCK_API !== 'true') {
    console.error(`FATAL ERROR: Environment variable ${key} is missing.`);
    process.exit(1);
  }
}

module.exports = config;
