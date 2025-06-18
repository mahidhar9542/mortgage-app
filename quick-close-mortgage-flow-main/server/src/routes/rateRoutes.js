import express from 'express';
import { getRates, refreshRates, getHistory } from '../controllers/rateController.js';

const router = express.Router();

// Public routes
router.get('/', getRates);
router.get('/refresh', refreshRates);
router.get('/history/:rateType', getHistory);

export default router;
