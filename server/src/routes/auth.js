import express from 'express';
const router = express.Router();
import { signup, login, logout, getMe } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

// Public routes
router.post('/signup', signup);
router.post('/signin', login);

// Protected routes
router.get('/me', auth, getMe);
router.post('/signout', auth, logout);

export default router;
