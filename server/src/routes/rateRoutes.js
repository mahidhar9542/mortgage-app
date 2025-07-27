import express from 'express';
import { getRates, refreshRates, getHistory } from '../controllers/rateController.js';
import { updateRates } from '../services/rateService.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getRates);
router.get('/refresh', refreshRates);
router.get('/history/:rateType', getHistory);

router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Valid email address is required'
      });
    }

    // In a real application, you would save this to a database
    // For now, we'll just log it and return success
    console.log(`Rate alert subscription: ${email}`);
    
    res.json({
      success: true,
      message: 'Successfully subscribed to rate alerts'
    });
  } catch (error) {
    console.error('Rate alert subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to rate alerts'
    });
  }
});

// Protected routes
router.use(protect);
router.use(authorize('admin'));

router.post('/update', updateRates);

export default router;
