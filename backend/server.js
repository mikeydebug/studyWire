// config should be required first to validate env vars
const config = require('./config');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

// Route imports
const healthRoutes = require('./routes/health');
const studyRoutes = require('./routes/study');

// Middleware imports
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Global Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

// CORS Configuration
const corsOptions = {
  origin: config.frontendUrl,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/study', studyRoutes);

// Global Error Handler
app.use(errorHandler);

// Serve Frontend Static Files for Production Deployment
const path = require('path');
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Export for Vercel Serverless or Run Locally
if (process.env.NODE_ENV !== 'production' || process.env.RENDER) {
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

module.exports = app;
