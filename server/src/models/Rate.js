import mongoose from 'mongoose';

const rateSchema = new mongoose.Schema({
  term: {
    type: Number,
    required: true,
    enum: [30, 20, 15, 10, 7, 5],
    description: 'Term of the mortgage in years'
  },
  type: {
    type: String,
    required: true,
    enum: ['fixed', 'arm'],
    description: 'Type of mortgage rate (fixed or adjustable)'
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
    description: 'Interest rate percentage'
  },
  apr: {
    type: Number,
    required: true,
    min: 0,
    description: 'Annual Percentage Rate (APR) including fees'
  },
  points: {
    type: Number,
    required: true,
    min: 0,
    description: 'Discount points paid to lower the interest rate'
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
    description: 'When this rate was last updated'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Compound index for unique rate terms and types
rateSchema.index({ term: 1, type: 1 }, { unique: true });

// Virtual for displaying the term with type
rateSchema.virtual('displayTerm').get(function() {
  return `${this.term}-Year ${this.type.toUpperCase() === 'ARM' ? 'ARM' : 'Fixed'}`;
});

const Rate = mongoose.model('Rate', rateSchema);

export default Rate;
