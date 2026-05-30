require('dotenv').config();

const config = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  anakin: {
    apiKey: process.env.ANAKIN_API_KEY,
    conceptAgentId: process.env.ANAKIN_CONCEPT_AGENT_ID,
    analogyAgentId: process.env.ANAKIN_ANALOGY_AGENT_ID,
    quizAgentId: process.env.ANAKIN_QUIZ_AGENT_ID,
    pyqAgentId: process.env.ANAKIN_PYQ_AGENT_ID,
    planAgentId: process.env.ANAKIN_PLAN_AGENT_ID
  }
};

// Validate environment variables at startup - crash fast if missing
const requiredKeys = [
  'ANAKIN_API_KEY',
  'ANAKIN_CONCEPT_AGENT_ID',
  'ANAKIN_ANALOGY_AGENT_ID',
  'ANAKIN_QUIZ_AGENT_ID',
  'ANAKIN_PYQ_AGENT_ID',
  'ANAKIN_PLAN_AGENT_ID'
];

for (const key of requiredKeys) {
  if (!process.env[key]) {
    console.error(`FATAL ERROR: Environment variable ${key} is missing.`);
    process.exit(1);
  }
}

module.exports = config;
