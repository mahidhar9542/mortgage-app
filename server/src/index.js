import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cron from 'node-cron';
import authRoutes from './routes/auth.js';
import rateRoutes from './routes/rateRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import { updateRates } from './services/rateService.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Debug environment variables
console.log('Environment Variables:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'SET' : 'NOT SET');
console.log('JWT_EXPIRE:', process.env.JWT_EXPIRE);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/auth', authRoutes);
app.use('/api/rates', rateRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Initialize rates
const initializeRates = async () => {
  try {
    await updateRates();
    console.log('Initial rates loaded successfully');
  } catch (error) {
    console.error('Failed to initialize rates:', error);
  }
};

// Schedule daily rate updates at 6 AM
cron.schedule('0 6 * * *', async () => {
  console.log('Running scheduled rate update...');
  try {
    await updateRates();
    console.log('Scheduled rate update completed');
  } catch (error) {
    console.error('Scheduled rate update failed:', error);
  }
});

// Initialize rates on server start
initializeRates();

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/quick-close-mortgage')
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

export default app;
