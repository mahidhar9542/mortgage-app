import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  // ===== Basic Information =====
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  middleName: {
    type: String,
    trim: true,
    maxlength: [50, 'Middle name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    maxlength: [100, 'Email cannot be more than 100 characters']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^[\d\s\-()]+$/, 'Please enter a valid phone number'],
    maxlength: [20, 'Phone number cannot be more than 20 characters']
  },
  
  // ===== Property Information =====
  loanPurpose: {
    type: String,
    required: [true, 'Loan purpose is required'],
    enum: ['purchase', 'refinance', 'cash-out'],
    default: 'purchase'
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['single_family', 'condo', 'townhouse', 'multi_family', 'other'],
    default: 'single_family'
  },
  propertyAddress: {
    street: {
      type: String,
      required: [true, 'Street address is required'],
      trim: true,
      maxlength: [200, 'Street address cannot be more than 200 characters']
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
      maxlength: [100, 'City cannot be more than 100 characters']
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
      uppercase: true,
      minlength: [2, 'State must be a 2-letter code'],
      maxlength: [2, 'State must be a 2-letter code']
    },
    zipCode: {
      type: String,
      required: [true, 'ZIP code is required'],
      match: [/^\d{5}(-\d{4})?$/, 'Please enter a valid ZIP code']
    }
  },
  propertyValue: {
    type: Number,
    required: [true, 'Property value is required'],
    min: [0, 'Property value cannot be negative']
  },
  currentMortgageBalance: {
    type: Number,
    min: [0, 'Mortgage balance cannot be negative']
  },
  
  // ===== Loan Information =====
  loanAmount: {
    type: Number,
    required: [true, 'Loan amount is required'],
    min: [0, 'Loan amount cannot be negative']
  },
  loanType: {
    type: String,
    enum: ['conventional', 'fha', 'va', 'usda', 'jumbo'],
    default: 'conventional'
  },
  
  // ===== Financial Information =====
  employmentStatus: {
    type: String,
    required: [true, 'Employment status is required'],
    enum: ['employed', 'self_employed', 'retired', 'unemployed', 'other'],
    default: 'employed'
  },
  employerName: {
    type: String,
    trim: true,
    maxlength: [100, 'Employer name cannot exceed 100 characters']
  },
  jobTitle: {
    type: String,
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  yearsAtJob: {
    type: Number,
    min: [0, 'Years at job cannot be negative']
  },
  annualIncome: {
    type: Number,
    required: [true, 'Annual income is required'],
    min: [0, 'Annual income cannot be negative']
  },
  additionalIncome: {
    type: Number,
    default: 0,
    min: [0, 'Additional income cannot be negative']
  },
  creditScore: {
    type: String,
    required: [true, 'Credit score range is required'],
    enum: ['excellent', 'very_good', 'good', 'fair', 'poor', 'unknown'],
    default: 'unknown'
  },
  
  // ===== Credit History =====
  hasBankruptcy: {
    type: Boolean,
    default: false
  },
  bankruptcyDetails: {
    type: {
      chapter: {
        type: String,
        enum: ['7', '11', '13', 'other']
      },
      dischargeDate: Date,
      explanation: String
    },
    default: null
  },
  hasForeclosure: {
    type: Boolean,
    default: false
  },
  hasLatePayments: {
    type: Boolean,
    default: false
  },
  latePaymentsDetails: {
    type: {
      count: Number,
      dates: [Date],
      explanation: String
    },
    default: null
  },
  
  // ===== Additional Information =====
  additionalNotes: {
    type: String,
    trim: true,
    maxlength: [2000, 'Additional notes cannot exceed 2000 characters']
  },
  
  // ===== Refinance-Specific Information =====
  refinanceData: {
    currentBalance: {
      type: Number,
      min: [0, 'Current balance cannot be negative']
    },
    currentRate: {
      type: Number,
      min: [0, 'Current rate cannot be negative'],
      max: [100, 'Current rate cannot exceed 100%']
    },
    currentMonthlyPayment: {
      type: Number,
      min: [0, 'Current monthly payment cannot be negative']
    },
    refinanceType: {
      type: String,
      enum: ['conventional', 'va-streamline', 'fha-streamline', 'jumbo', 'cash-out'],
      default: 'conventional'
    },
    estimatedSavings: {
      type: Number,
      min: [0, 'Estimated savings cannot be negative']
    },
    refinanceDate: {
      type: Date,
      default: Date.now
    },
    newRate: {
      type: Number,
      min: [0, 'New rate cannot be negative'],
      max: [100, 'New rate cannot exceed 100%']
    },
    newMonthlyPayment: {
      type: Number,
      min: [0, 'New monthly payment cannot be negative']
    },
    breakEvenMonths: {
      type: Number,
      min: [0, 'Break-even months cannot be negative']
    }
  },
  
  // ===== System Fields =====
  status: {
    type: String,
    enum: ['new', 'contacted', 'in_progress', 'qualified', 'closed', 'rejected'],
    default: 'new'
  },
  source: {
    type: String,
    default: 'website'
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  lastContacted: {
    type: Date
  },
  nextFollowUp: {
    type: Date
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  notes: [{
    content: {
      type: String,
      required: [true, 'Note content is required']
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false
    },
    isInternal: {
      type: Boolean,
      default: false
    }
  }],
  
  // ===== Timestamps =====
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for faster queries
leadSchema.index({ email: 1 });
leadSchema.index({ status: 1 });
leadSchema.index({ createdAt: -1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
