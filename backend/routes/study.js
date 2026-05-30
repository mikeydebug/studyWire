const express = require('express');
const router = express.Router();
const { runStudyWirePipeline } = require('../services/wireService');
const { studyRateLimiter } = require('../middleware/rateLimit');
const { validateStudyRequest } = require('../middleware/validate');

router.post('/', studyRateLimiter, validateStudyRequest, async (req, res, next) => {
  try {
    const { topic, subject, language } = req.body;
    
    // Call the Anakin Wire pipeline service
    const results = await runStudyWirePipeline(topic, subject, language);
    
    res.status(200).json({
      success: true,
      data: results,
      topic,
      generated_at: new Date().toISOString()
    });
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
