require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');

const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Routes
app.use('/api/health', healthRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  } else {
    console.error(err.message);
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
