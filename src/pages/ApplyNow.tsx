import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header';

const ApplyNow = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const loanPurpose = searchParams.get('purpose') || 'purchase';
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    loanAmount: '',
    propertyValue: '',
    agreeToTerms: false
  });

  const steps = [
    { id: 1, title: 'Personal Information' },
    { id: 2, title: 'Property Information' },
    { id: 3, title: 'Review & Submit' }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        loanPurpose,
        source: `${loanPurpose}-application`,
        submittedAt: new Date().toISOString()
      };

      // Submit to backend
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        toast({
          title: "Application submitted!",
          description: "Your application has been submitted successfully.",
        });
        navigate('/application-submitted');
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Unable to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="loanAmount">Loan Amount *</Label>
                <Input
                  id="loanAmount"
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                  placeholder="$300,000"
                  required
                />
              </div>
              <div>
                <Label htmlFor="propertyValue">Property Value *</Label>
                <Input
                  id="propertyValue"
                  type="number"
                  value={formData.propertyValue}
                  onChange={(e) => handleInputChange('propertyValue', e.target.value)}
                  placeholder="$400,000"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-4">Application Summary</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Loan Amount:</strong> ${formData.loanAmount}</p>
                <p><strong>Property Value:</strong> ${formData.propertyValue}</p>
                <p><strong>Loan Purpose:</strong> {loanPurpose}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked)}
                required
              />
              <Label htmlFor="agreeToTerms">I agree to the terms and conditions *</Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {loanPurpose === 'refinance' ? 'Refinance Application' : 'Purchase Application'}
            </h1>
          <p className="text-gray-600">
            Complete your application to get started with your {loanPurpose === 'refinance' ? 'refinance' : 'purchase'} loan
            </p>
      </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
              {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              Step {currentStep}: {steps[currentStep - 1].title}
            </h2>
          </div>
              </div>
              
        {/* Form */}
        <Card>
          <CardContent className="p-8">
            {renderStepContent()}
            
            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t">
                      <Button 
                        variant="outline"
                        onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center"
                      >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
                      </Button>
              
              {currentStep < steps.length ? (
                <Button onClick={nextStep} className="flex items-center">
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.agreeToTerms}
                  className="flex items-center"
                      >
                        {isSubmitting ? (
                          <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            Submit Application
                      <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplyNow; 