import mongoose from 'mongoose';

const interestRateSchema = new mongoose.Schema({
  rateType: {
    type: String,
    required: true,
    enum: ['30-year-fixed', '15-year-fixed', '5-1-arm', '7-1-arm', '10-1-arm'],
  },
  rate: {
    type: Number,
    required: true,
  },
  apr: {
    type: Number,
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  change: {
    type: Number,
    default: 0,
  },
  points: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// Add index for faster lookups
interestRateSchema.index({ rateType: 1 }, { unique: true });

const InterestRate = mongoose.model('InterestRate', interestRateSchema);

export default InterestRate;
