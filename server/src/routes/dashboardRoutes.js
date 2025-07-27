import express from 'express';
import {
  getUserApplications,
  getApplicationDetails,
  updateApplicationStatus,
  uploadDocument,
  getDocuments,
  deleteDocument,
  getLoanTeam,
  sendMessage,
  scheduleCall,
  downloadDisclosures,
  getCreditReport
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/documents/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image, PDF, and document files are allowed!'));
    }
  }
});

// All routes require authentication
router.use(protect);

// Application routes
router.get('/applications', getUserApplications);
router.get('/applications/:id', getApplicationDetails);
router.put('/applications/:id/status', updateApplicationStatus);

// Document routes
router.get('/documents', getDocuments);
router.post('/documents/upload', upload.single('document'), uploadDocument);
router.delete('/documents/:id', deleteDocument);

// Communication routes
router.get('/loan-team', getLoanTeam);
router.post('/message', sendMessage);
router.post('/schedule-call', scheduleCall);

// Download routes
router.get('/download/disclosures', downloadDisclosures);
router.get('/credit-report', getCreditReport);

export default router; 