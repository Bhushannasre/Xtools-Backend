import express from 'express';
import rateLimit from 'express-rate-limit';
import { trackDownload } from '../controller/downloadController.js';

const router = express.Router();

const downloadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    message: { error: 'Too many download tracking requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/downloads', downloadLimiter, trackDownload);

export default router;
