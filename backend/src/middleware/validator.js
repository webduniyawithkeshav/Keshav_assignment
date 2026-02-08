const { body, param, query, validationResult } = require('express-validator');

/**
 * Validation middleware wrapper
 * Checks validation results and returns errors
 */
const validate = (validations) => {
    return async (req, res, next) => {
        // Run all validations
        await Promise.all(validations.map((validation) => validation.run(req)));

        // Check for errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                error: 'Validation failed',
                errors: errors.array().map((err) => ({
                    field: err.param,
                    message: err.msg,
                })),
            });
        }

        next();
    };
};

/**
 * Validation rules for authentication
 */
const authValidation = {
    register: validate([
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('password')
            .notEmpty()
            .withMessage('Password is required')
            .isLength({ min: 8 })
            .withMessage('Password must be at least 8 characters'),
    ]),
    login: validate([
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required'),
    ]),
};

/**
 * Validation rules for agents
 */
const agentValidation = {
    create: validate([
        body('name')
            .trim()
            .notEmpty()
            .withMessage('Name is required')
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters'),
        body('email')
            .trim()
            .notEmpty()
            .withMessage('Email is required')
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('phone')
            .optional()
            .trim()
            .matches(/^[0-9]{10,15}$/)
            .withMessage('Phone must be 10-15 digits'),
    ]),
    update: validate([
        param('id').isMongoId().withMessage('Invalid agent ID'),
        body('name')
            .optional()
            .trim()
            .isLength({ min: 2, max: 100 })
            .withMessage('Name must be between 2 and 100 characters'),
        body('email')
            .optional()
            .trim()
            .isEmail()
            .withMessage('Please provide a valid email')
            .normalizeEmail(),
        body('phone')
            .optional()
            .trim()
            .matches(/^[0-9]{10,15}$/)
            .withMessage('Phone must be 10-15 digits'),
        body('status')
            .optional()
            .isIn(['active', 'inactive'])
            .withMessage('Status must be active or inactive'),
    ]),
    delete: validate([param('id').isMongoId().withMessage('Invalid agent ID')]),
};

/**
 * Validation rules for records
 */
const recordValidation = {
    updateStatus: validate([
        param('id').isMongoId().withMessage('Invalid record ID'),
        body('status')
            .notEmpty()
            .withMessage('Status is required')
            .isIn(['pending', 'in_progress', 'completed', 'failed'])
            .withMessage('Invalid status value'),
        body('notes')
            .optional()
            .trim()
            .isLength({ max: 1000 })
            .withMessage('Notes cannot exceed 1000 characters'),
    ]),
};

module.exports = {
    validate,
    authValidation,
    agentValidation,
    recordValidation,
};
