import React, { useState, useEffect } from 'react';
import { useForm, useFormContext, FormProvider } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';

declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, any>) => void;
  }
}
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import MainLayout from '@/components/layouts/MainLayout';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { formatPhoneNumber, formatCurrency, parseCurrency } from '@/lib/utils';

// Form Steps
const steps = [
  { id: 'basic', title: 'Basic Info' },
  { id: 'property', title: 'Property Details' },
  { id: 'financial', title: 'Financial Info' },
  { id: 'review', title: 'Review & Submit' },
];

// Form Types
type FormData = {
  // Step 1: Basic Info
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  preferredContact: 'email' | 'phone' | 'text';
  
  // Step 2: Property Details
  propertyType: 'primary' | 'secondary' | 'investment';
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  propertyValue: string;
  loanAmount: string;
  loanPurpose: 'purchase' | 'refinance' | 'cash-out';
  
  // Step 3: Financial Info
  employmentStatus: 'employed' | 'self-employed' | 'retired' | 'other';
  employerName?: string;
  jobTitle?: string;
  yearsAtJob?: string;
  annualIncome: string;
  monthlyHousingPayment?: string;
  creditScore: string;
  hasBankruptcy: boolean;
  hasForeclosure: boolean;
  
  // Additional Info
  additionalNotes?: string;
  
  // Consent
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
  
  // Hidden fields
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
};

// Form Components
const StepIndicator = ({ currentStep, steps }: { currentStep: number; steps: { id: string; title: string }[] }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-xs mt-1 text-center">{step.title}</span>
          </div>
        ))}
      </div>
      <Progress value={((currentStep + 1) / steps.length) * 100} className="h-2" />
    </div>
  );
};

const Step1BasicInfo = ({ control, errors }: any) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium">Basic Information</h3>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input placeholder="John" {...field} />
            </FormControl>
            <FormMessage>{errors.firstName?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input placeholder="Doe" {...field} />
            </FormControl>
            <FormMessage>{errors.lastName?.message}</FormMessage>
          </FormItem>
        )}
      />
    </div>
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type="email" placeholder="john@example.com" {...field} />
            </FormControl>
            <FormMessage>{errors.email?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone</FormLabel>
            <FormControl>
              <Input type="tel" placeholder="(123) 456-7890" {...field} />
            </FormControl>
            <FormMessage>{errors.phone?.message}</FormMessage>
          </FormItem>
        )}
      />
    </div>
  </div>
);

const Step2PropertyDetails = ({ control, errors }: any) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium">Property Details</h3>
    <FormField
      control={control}
      name="loanPurpose"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Loan Purpose</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="purchase" id="purchase" />
                </FormControl>
                <Label htmlFor="purchase">Purchase</Label>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="refinance" id="refinance" />
                </FormControl>
                <Label htmlFor="refinance">Refinance</Label>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="cash-out" id="cash-out" />
                </FormControl>
                <Label htmlFor="cash-out">Cash-Out</Label>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage>{errors.loanPurpose?.message}</FormMessage>
        </FormItem>
      )}
    />
    
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormField
        control={control}
        name="propertyType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="primary">Primary Residence</SelectItem>
                <SelectItem value="secondary">Secondary Home</SelectItem>
                <SelectItem value="investment">Investment Property</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage>{errors.propertyType?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="propertyValue"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Property Value ($)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="500,000" {...field} />
            </FormControl>
            <FormMessage>{errors.propertyValue?.message}</FormMessage>
          </FormItem>
        )}
      />
    </div>
    
    <FormField
      control={control}
      name="propertyAddress"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Property Address</FormLabel>
          <FormControl>
            <Input placeholder="123 Main St" {...field} />
          </FormControl>
          <FormMessage>{errors.propertyAddress?.message}</FormMessage>
        </FormItem>
      )}
    />
    
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
      <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input placeholder="Anytown" {...field} />
            </FormControl>
            <FormMessage>{errors.city?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <FormControl>
              <Input placeholder="CA" maxLength={2} {...field} />
            </FormControl>
            <FormMessage>{errors.state?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="zipCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ZIP Code</FormLabel>
            <FormControl>
              <Input placeholder="12345" maxLength={10} {...field} />
            </FormControl>
            <FormMessage>{errors.zipCode?.message}</FormMessage>
          </FormItem>
        )}
      />
    </div>
  </div>
);

const Step3FinancialInfo = ({ control, errors }: any) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium">Financial Information</h3>
    
    <FormField
      control={control}
      name="employmentStatus"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Employment Status</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select employment status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="employed">Employed</SelectItem>
              <SelectItem value="self-employed">Self-Employed</SelectItem>
              <SelectItem value="retired">Retired</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage>{errors.employmentStatus?.message}</FormMessage>
        </FormItem>
      )}
    />
    
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <FormField
        control={control}
        name="annualIncome"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Annual Income ($)</FormLabel>
            <FormControl>
              <Input type="number" placeholder="75,000" {...field} />
            </FormControl>
            <FormMessage>{errors.annualIncome?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="creditScore"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Credit Score</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select credit score range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="excellent">Excellent (800-850)</SelectItem>
                <SelectItem value="very-good">Very Good (740-799)</SelectItem>
                <SelectItem value="good">Good (670-739)</SelectItem>
                <SelectItem value="fair">Fair (580-669)</SelectItem>
                <SelectItem value="poor">Poor (300-579)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage>{errors.creditScore?.message}</FormMessage>
          </FormItem>
        )}
      />
    </div>
    
    <div className="space-y-4">
      <FormLabel>Additional Information</FormLabel>
      <div className="space-y-2">
        <FormField
          control={control}
          name="hasBankruptcy"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormLabel className="!mt-0">Have you filed for bankruptcy in the last 7 years?</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="hasForeclosure"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              </FormControl>
              <FormLabel className="!mt-0">Have you had a foreclosure in the last 7 years?</FormLabel>
            </FormItem>
          )}
        />
      </div>
    </div>
  </div>
);

const Step4Review = ({ control, formData }: { control: any; formData: FormData }) => {
  // Format currency for display
  const formatCurrency = (value: string | number | undefined) => {
    if (!value) return '$0';
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(num || 0);
  };

  // Format credit score for display
  const formatCreditScore = (value: string) => {
    const map: Record<string, string> = {
      'excellent': 'Excellent (800-850)',
      'very-good': 'Very Good (740-799)',
      'good': 'Good (670-739)',
      'fair': 'Fair (580-669)',
      'poor': 'Poor (300-579)',
    };
    return map[value] || value;
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Review Your Information</h3>
      
      <div className="space-y-8">
        {/* Basic Info Section */}
        <div>
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Basic Information</h4>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Full Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{`${formData.firstName} ${formData.lastName}`}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{formData.phone}</dd>
            </div>
          </dl>
        </div>

        {/* Property Details Section */}
        <div>
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Property Details</h4>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Loan Purpose</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{formData.loanPurpose}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Property Type</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">
                {formData.propertyType?.replace('-', ' ') || 'Not specified'}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Property Address</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.propertyAddress || 'Not specified'}
                {formData.city || formData.state || formData.zipCode ? (
                  <div>
                    {formData.city && <span>{formData.city}, </span>}
                    {formData.state && <span>{formData.state} </span>}
                    {formData.zipCode && <span>{formData.zipCode}</span>}
                  </div>
                ) : null}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Property Value</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.propertyValue ? formatCurrency(formData.propertyValue) : 'Not specified'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Financial Info Section */}
        <div>
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Financial Information</h4>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Employment Status</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">
                {formData.employmentStatus?.replace('-', ' ') || 'Not specified'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Annual Income</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.annualIncome ? formatCurrency(formData.annualIncome) : 'Not specified'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Credit Score</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.creditScore ? formatCreditScore(formData.creditScore) : 'Not specified'}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Additional Information</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {formData.hasBankruptcy ? 'Has bankruptcy in last 7 years' : 'No bankruptcy in last 7 years'}
                <br />
                {formData.hasForeclosure ? 'Has foreclosure in last 7 years' : 'No foreclosure in last 7 years'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      <FormField
        control={control}
        name="additionalNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Additional Notes</FormLabel>
            <FormControl>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Any additional information you'd like to share..."
                {...field}
              />
            </FormControl>
            <FormMessage>{control._formState.errors.additionalNotes?.message}</FormMessage>
          </FormItem>
        )}
      />
      
      <div className="pt-2">
        <p className="text-sm text-gray-600">
          By submitting this application, you agree to our{' '}
          <a href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</a> and{' '}
          <a href="/terms" className="text-primary hover:underline">Terms of Service</a>.
        </p>
      </div>
    </div>
  );
};

// Get UTM parameters from URL
const getUtmParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  return {
    source: searchParams.get('source') || 'website',
    utmSource: searchParams.get('utm_source') || undefined,
    utmMedium: searchParams.get('utm_medium') || undefined,
    utmCampaign: searchParams.get('utm_campaign') || undefined,
    utmTerm: searchParams.get('utm_term') || undefined,
    utmContent: searchParams.get('utm_content') || undefined,
  };
};

export default function ApplyNow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [savedFormData, setSavedFormData] = useState<Partial<FormData> | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Load saved form data from localStorage
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('mortgageApplication');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setSavedFormData(parsedData);
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const methods = useForm<FormData>({
    defaultValues: {
      // Basic Info
      firstName: savedFormData?.firstName || '',
      middleName: savedFormData?.middleName || '',
      lastName: savedFormData?.lastName || '',
      email: savedFormData?.email || '',
      phone: savedFormData?.phone || '',
      preferredContact: savedFormData?.preferredContact || 'email',
      
      // Property Details
      propertyType: savedFormData?.propertyType || 'primary',
      propertyAddress: savedFormData?.propertyAddress || '',
      city: savedFormData?.city || '',
      state: savedFormData?.state || '',
      zipCode: savedFormData?.zipCode || '',
      propertyValue: savedFormData?.propertyValue || '',
      loanAmount: savedFormData?.loanAmount || '',
      loanPurpose: savedFormData?.loanPurpose || 'purchase',
      
      // Financial Info
      employmentStatus: savedFormData?.employmentStatus || 'employed',
      employerName: savedFormData?.employerName || '',
      jobTitle: savedFormData?.jobTitle || '',
      yearsAtJob: savedFormData?.yearsAtJob || '',
      annualIncome: savedFormData?.annualIncome || '',
      monthlyHousingPayment: savedFormData?.monthlyHousingPayment || '',
      creditScore: savedFormData?.creditScore || '',
      hasBankruptcy: savedFormData?.hasBankruptcy || false,
      hasForeclosure: savedFormData?.hasForeclosure || false,
      
      // Additional
      additionalNotes: savedFormData?.additionalNotes || '',
      agreeToTerms: savedFormData?.agreeToTerms || false,
      agreeToMarketing: savedFormData?.agreeToMarketing || false,
      
      // UTM params
      ...getUtmParams(),
    },
  });
  
  // Save form data to localStorage on change
  const { watch } = methods;
  const formValues = watch();
  
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('mortgageApplication', JSON.stringify(formValues));
    }
  }, [formValues, isLoading]);

  const { handleSubmit, trigger, formState: { errors } } = methods;
  const formData = methods.watch();

  // Get fields for the current step for validation
  const getStepFields = (step: number): (keyof FormData)[] => {
    switch (step) {
      case 0: // Basic Info
        return ['firstName', 'lastName', 'email', 'phone'];
      case 1: // Property Details
        return ['propertyType', 'propertyAddress', 'city', 'state', 'zipCode', 'propertyValue', 'loanAmount'];
      case 2: // Financial Info
        return ['employmentStatus', 'annualIncome', 'creditScore'];
      default:
        return [];
    }
  };

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    if (currentStep < steps.length - 1) {
      // If not on the last step, validate current step and proceed
      const fields = getStepFields(currentStep);
      const isValid = await trigger(fields as any);
      
      if (isValid) {
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      }
      return;
    }
    
    // If on the last step, submit the form
    try {
      setIsSubmitting(true);
      
      // Prepare the payload
      const payload = {
        // Basic Info
        firstName: data.firstName.trim(),
        middleName: data.middleName?.trim(),
        lastName: data.lastName.trim(),
        email: data.email.trim(),
        phone: formatPhoneNumber(data.phone),
        preferredContact: data.preferredContact,
        
        // Property Details
        property: {
          type: data.propertyType,
          address: data.propertyAddress.trim(),
          city: data.city.trim(),
          state: data.state,
          zipCode: data.zipCode,
          value: parseCurrency(data.propertyValue) || 0,
          loanAmount: parseCurrency(data.loanAmount) || 0,
          loanPurpose: data.loanPurpose,
        },
        
        // Financial Info
        employment: {
          status: data.employmentStatus,
          employerName: data.employerName?.trim(),
          jobTitle: data.jobTitle?.trim(),
          yearsAtJob: data.yearsAtJob ? parseInt(data.yearsAtJob) : undefined,
          annualIncome: parseCurrency(data.annualIncome) || 0,
          monthlyHousingPayment: data.monthlyHousingPayment ? parseCurrency(data.monthlyHousingPayment) : undefined,
        },
        
        credit: {
          score: data.creditScore ? parseInt(data.creditScore) : undefined,
          hasBankruptcy: data.hasBankruptcy,
          hasForeclosure: data.hasForeclosure,
        },
        
        // Additional Info
        additionalNotes: data.additionalNotes?.trim(),
        
        // Marketing Preferences
        marketingConsent: data.agreeToMarketing,
        
        // Tracking
        source: data.source,
        utm: {
          source: data.utmSource,
          medium: data.utmMedium,
          campaign: data.utmCampaign,
          term: data.utmTerm,
          content: data.utmContent,
        },
      };
      
      // Submit to the API
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit application');
      }
      
      // Clear saved form data on successful submission
      localStorage.removeItem('mortgageApplication');
      
      // Track successful submission
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'lead_submitted', {
          event_category: 'conversion',
          event_label: 'Mortgage Application Submitted',
          value: 1,
        });
      }
      
      // Redirect to thank you page
      navigate('/thank-you');
      
    } catch (error) {
      console.error('Error submitting application:', error);
      
      // Track error
      if (typeof window.gtag !== 'undefined') {
        window.gtag('event', 'form_error', {
          event_category: 'error',
          event_label: 'Application Submission Failed',
          value: 1,
        });
      }
      
      toast({
        title: 'Error',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Input handlers
  const handleCurrencyInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) return; // Only allow one decimal point
    if (parts[1] && parts[1].length > 2) return; // Only allow 2 decimal places
    
    // Format with commas
    const number = parseFloat(value) || 0;
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(number);
    
    e.target.value = formatted;
  };
  
  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formatted = '';
    
    if (value.length > 0) {
      formatted = `(${value.substring(0, 3)}`;
      if (value.length > 3) {
        formatted += `) ${value.substring(3, 6)}`;
        if (value.length > 6) {
          formatted += `-${value.substring(6, 10)}`;
        }
      }
    }
    
    e.target.value = formatted;
  };
  
  const handleCreditScoreInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value === '' || (parseInt(value) >= 300 && parseInt(value) <= 850)) {
      e.target.value = value;
    }
  };

  // Handle previous step
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Show loading state while loading saved form data
  if (isLoading) {
    return (
      <MainLayout title="Loading Application | Quick Close Mortgage">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Loading your application...</h2>
            <p className="text-gray-600 mt-2">Please wait while we load your saved progress.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Render the current step
  const renderStep = () => {
    const commonProps = {
      control: methods.control,
      errors: errors,
      onCurrencyInput: handleCurrencyInput,
      onPhoneInput: handlePhoneInput,
      onCreditScoreInput: handleCreditScoreInput,
    };
    
    switch (currentStep) {
      case 0:
        return <Step1BasicInfo {...commonProps} />;
      case 1:
        return <Step2PropertyDetails {...commonProps} />;
      case 2:
        return <Step3FinancialInfo {...commonProps} />;
      case 3:
        return <Step4Review {...commonProps} formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Get Pre-Approved in Minutes
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-xl text-blue-100">
              Start your mortgage application today and get a decision in as little as 24 hours.
              Competitive rates and personalized service.
            </p>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="px-6 pt-6">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-700">{step.title}</span>
                </div>
              ))}
            </div>
            <div className="relative pt-1">
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                <div 
                  style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600 transition-all duration-500"
                ></div>
              </div>
            </div>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-8">
              {/* Form Content */}
              <div className="space-y-8">
                {renderStep()}
              </div>
              
              {/* Navigation Buttons */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <div>
                    {currentStep > 0 && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={prevStep}
                        disabled={isSubmitting}
                        className="px-6 py-3 text-base font-medium"
                      >
                        Back
                      </Button>
                    )}
                  </div>
                  <div>
                    {currentStep < steps.length - 1 ? (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-8 py-3 text-base font-medium bg-blue-600 hover:bg-blue-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing...
                          </>
                        ) : 'Continue'}
                      </Button>
                    ) : (
                      <Button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-8 py-3 text-base font-medium bg-green-600 hover:bg-green-700"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Submit Application
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
        
        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">TRUSTED BY THOUSANDS OF HOMEOWNERS</p>
          <div className="flex flex-wrap justify-center items-center gap-8 mt-4">
            <div className="text-gray-400 font-medium">★ ★ ★ ★ ★ 4.9/5 from 2,000+ reviews</div>
            <div className="text-gray-400 font-medium">🔒 256-bit SSL Secure</div>
            <div className="text-gray-400 font-medium">🏆 NMLS #123456</div>
          </div>
        </div>
      </div>
    </div>
  );
}
