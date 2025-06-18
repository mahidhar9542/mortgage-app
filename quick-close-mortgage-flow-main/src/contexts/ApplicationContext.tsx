import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

interface ApplicationData {
  // Step 1: Basic Information
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'text';
  bestTimeToCall: 'morning' | 'afternoon' | 'evening' | 'anytime';
  
  // Step 2: Property Information
  propertyAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  propertyType: 'single_family' | 'condo' | 'townhouse' | 'multi_family' | 'other';
  propertyUse: 'primary' | 'secondary' | 'investment';
  
  // Step 3: Loan Information
  loanType: 'purchase' | 'refinance' | 'cash_out' | 'home_equity';
  loanAmount: string;
  estimatedHomeValue: string;
  currentMortgageBalance: string;
  
  // Step 4: Financial Information
  employmentStatus: 'employed' | 'self_employed' | 'retired' | 'unemployed' | 'other';
  annualIncome: string;
  creditScore: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';
  
  // Additional Information
  hasBankruptcy: boolean;
  hasForeclosure: boolean;
  hasLatePayments: boolean;
  
  // Metadata
  leadId?: string;
}

interface ApplicationContextType {
  data: ApplicationData;
  currentStep: number;
  steps: { id: number; name: string; status: 'complete' | 'current' | 'upcoming' }[];
  updateData: (data: Partial<ApplicationData>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  submitApplication: () => Promise<{ success: boolean; message?: string }>;
  isLoading: boolean;
  error: string | null;
}

const initialState: ApplicationData = {
  // Step 1
  firstName: '',
  middleName: '',
  lastName: '',
  email: '',
  phone: '',
  preferredContact: 'email',
  bestTimeToCall: 'afternoon',
  
  // Step 2
  propertyAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
  },
  propertyType: 'single_family',
  propertyUse: 'primary',
  
  // Step 3
  loanType: 'purchase',
  loanAmount: '',
  estimatedHomeValue: '',
  currentMortgageBalance: '',
  
  // Step 4
  employmentStatus: 'employed',
  annualIncome: '',
  creditScore: 'good',
  
  // Additional Information
  hasBankruptcy: false,
  hasForeclosure: false,
  hasLatePayments: false,
};

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<ApplicationData>(() => {
    const savedData = localStorage.getItem('mortgageApplication');
    return savedData ? JSON.parse(savedData) : initialState;
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const steps = [
    { id: 1, name: 'Basic Information', status: 'current' },
    { id: 2, name: 'Property Details', status: 'upcoming' },
    { id: 3, name: 'Loan Information', status: 'upcoming' },
    { id: 4, name: 'Financial Details', status: 'upcoming' },
    { id: 5, name: 'Review & Submit', status: 'upcoming' },
  ];

  // Update step status based on current step
  const updateStepStatus = (step: number) => {
    return steps.map((s) => ({
      ...s,
      status:
        s.id < step ? 'complete' : s.id === step ? 'current' : 'upcoming',
    }));
  };

  const [currentSteps, setCurrentSteps] = useState(updateStepStatus(currentStep));

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mortgageApplication', JSON.stringify(data));
  }, [data]);

  // Update step status when currentStep changes
  useEffect(() => {
    setCurrentSteps(updateStepStatus(currentStep));
  }, [currentStep]);

  const updateData = (newData: Partial<ApplicationData>) => {
    setData((prev) => ({
      ...prev,
      ...newData,
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => {
        const nextStep = prev + 1;
        setCurrentSteps(updateStepStatus(nextStep));
        return nextStep;
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => {
        const prevStep = prev - 1;
        setCurrentSteps(updateStepStatus(prevStep));
        return prevStep;
      });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
      setCurrentSteps(updateStepStatus(step));
    }
  };

  const submitApplication = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Submit basic info first to create a lead
      if (!data.leadId) {
        const basicInfo = {
          firstName: data.firstName,
          middleName: data.middleName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          preferredContact: data.preferredContact,
          bestTimeToCall: data.bestTimeToCall,
        };
        
        const response = await api.post('/api/leads', basicInfo);
        
        // Update the lead ID in the local data
        updateData({ leadId: response.data.data._id });
      }
      
      // Update the lead with all the collected data
      await api.put(`/api/leads/${data.leadId}`, data);
      
      // Clear the form data from localStorage
      localStorage.removeItem('mortgageApplication');
      
      // Navigate to success page
      navigate('/application-submitted');
      
      return { success: true };
    } catch (error: any) {
      console.error('Error submitting application:', error);
      const errorMessage = error.response?.data?.message || 'Failed to submit application. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ApplicationContext.Provider
      value={{
        data,
        currentStep,
        steps: currentSteps,
        updateData,
        nextStep,
        prevStep,
        goToStep,
        submitApplication,
        isLoading,
        error,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplication = (): ApplicationContextType => {
  const context = useContext(ApplicationContext);
  if (context === undefined) {
    throw new Error('useApplication must be used within an ApplicationProvider');
  }
  return context;
};
