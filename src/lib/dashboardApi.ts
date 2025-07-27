import api from './api';

// Types
export interface ApplicationData {
  id: string;
  status: 'new' | 'contacted' | 'in_progress' | 'qualified' | 'closed' | 'rejected';
  currentStep: number;
  steps: ApplicationStep[];
  loanAmount: number;
  interestRate: number;
  monthlyPayment: number;
  loanTerm: number;
  estimatedClosing: string;
  lastUpdated: string;
  propertyAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  loanPurpose?: string;
  propertyType?: string;
  assignedTo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
}

export interface ApplicationStep {
  id: string;
  title: string;
  status: 'complete' | 'current' | 'upcoming';
  completedAt?: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  status: 'approved' | 'pending' | 'rejected';
}

export interface LoanTeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface CreditReport {
  score: number;
  lastUpdated: string;
  factors: string[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Application APIs
export const getApplications = async (): Promise<ApplicationData[]> => {
  const response = await api.get<ApiResponse<ApplicationData[]>>('/api/dashboard/applications');
  return response.data.data;
};

export const getApplicationDetails = async (id: string): Promise<ApplicationData> => {
  const response = await api.get<ApiResponse<ApplicationData>>(`/api/dashboard/applications/${id}`);
  return response.data.data;
};

export const updateApplicationStatus = async (id: string, status: string) => {
  const response = await api.put(`/api/dashboard/applications/${id}/status`, { status });
  return response.data;
};

// Document APIs
export const getDocuments = async (): Promise<Document[]> => {
  const response = await api.get<ApiResponse<Document[]>>('/api/dashboard/documents');
  return response.data.data;
};

export const uploadDocument = async (file: File, applicationId: string, documentType: string) => {
  const formData = new FormData();
  formData.append('document', file);
  formData.append('applicationId', applicationId);
  formData.append('documentType', documentType);

  const response = await api.post('/api/dashboard/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteDocument = async (id: string) => {
  const response = await api.delete(`/api/dashboard/documents/${id}`);
  return response.data;
};

// Communication APIs
export const getLoanTeam = async (): Promise<LoanTeamMember[]> => {
  const response = await api.get<ApiResponse<LoanTeamMember[]>>('/api/dashboard/loan-team');
  return response.data.data;
};

export const sendMessage = async (subject: string, message: string, applicationId: string) => {
  const response = await api.post('/api/dashboard/message', {
    subject,
    message,
    applicationId,
  });
  return response.data;
};

export const scheduleCall = async (preferredDate: string, preferredTime: string, reason: string, applicationId: string) => {
  const response = await api.post('/api/dashboard/schedule-call', {
    preferredDate,
    preferredTime,
    reason,
    applicationId,
  });
  return response.data;
};

// Download APIs
export const downloadDisclosures = async () => {
  const response = await api.get('/api/dashboard/download/disclosures');
  return response.data;
};

export const getCreditReport = async (): Promise<CreditReport> => {
  const response = await api.get<ApiResponse<CreditReport>>('/api/dashboard/credit-report');
  return response.data.data;
}; 