import express from 'express';
import contactController from '../controller/contactController.js'; // ✅ correct import name

const router = express.Router();

router.post('/contact', contactController);

export default router;