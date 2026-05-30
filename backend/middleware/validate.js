const { body, validationResult } = require('express-validator');

const validateStudyRequest = [
  body('topic')
    .trim()
    .notEmpty().withMessage('Topic is required')
    .isString().withMessage('Topic must be a string')
    .isLength({ max: 200 }).withMessage('Topic is too long')
    .escape(), // sanitize input
    
  body('subject')
    .trim()
    .notEmpty().withMessage('Subject is required')
    .isString().withMessage('Subject must be a string')
    .isLength({ max: 50 }).withMessage('Subject is too long')
    .escape(),

  body('language')
    .trim()
    .notEmpty().withMessage('Language is required')
    .isIn(['en', 'hi']).withMessage('Language must be "en" or "hi"'),
    
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid request data',
        errors: errors.array() 
      });
    }
    next();
  }
];

module.exports = {
  validateStudyRequest
};
