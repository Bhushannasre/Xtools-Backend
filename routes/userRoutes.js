// import express from 'express';
// import rateLimit from 'express-rate-limit';
// import { registerUser, loginUser } from '../controller/userController.js';

// const router = express.Router();

// // Rate limiter: max 20 auth requests per IP per 15 minutes
// const authLimiter = rateLimit({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 20,
//     message: { error: 'Too many attempts. Please try again later.' },
//     standardHeaders: true,
//     legacyHeaders: false,
// });

// router.post('/register', authLimiter, registerUser);
// router.post('/login', authLimiter, loginUser);

// export default router;

import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, loginUser, forgotPassword, resetPassword } from '../controller/userController.js';

const router = express.Router();

// Rate limiter: max 20 auth requests per IP per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: { error: 'Too many attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Tighter limiter for password-reset: each hit sends a real email (cost +
// abuse surface), so this gets a smaller budget than login/register.
const passwordResetLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Too many password reset attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/forgot-password', passwordResetLimiter, forgotPassword);
router.post('/reset-password/:token', passwordResetLimiter, resetPassword);

export default router;