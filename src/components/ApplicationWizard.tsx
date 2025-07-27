
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface WizardStep {
  id: number;
  title: string;
  description: string;
}

const ApplicationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ssn: '',
    dateOfBirth: '',
    
    // Loan Details
    loanPurpose: '',
    propertyType: '',
    loanAmount: '',
    homeValue: '',
    
    // Employment
    employmentStatus: '',
    employer: '',
    jobTitle: '',
    income: '',
    
    // Property
    propertyAddress: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const steps: WizardStep[] = [
    { id: 1, title: 'Personal Information', description: 'Basic personal details' },
    { id: 2, title: 'Loan Details', description: 'Loan amount and property info' },
    { id: 3, title: 'Employment', description: 'Income and employment details' },
    { id: 4, title: 'Property Details', description: 'Property address and details' },
    { id: 5, title: 'Assets & Debts', description: 'Financial information' },
    { id: 6, title: 'Review & Submit', description: 'Review your application' }
  ];

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const progressPercentage = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Doe"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="john.doe@example.com"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="loanPurpose">Loan Purpose</Label>
              <Select onValueChange={(value) => updateFormData('loanPurpose', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select loan purpose" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Home Purchase</SelectItem>
                  <SelectItem value="refinance">Refinance</SelectItem>
                  <SelectItem value="cash-out">Cash-Out Refinance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="propertyType">Property Type</Label>
              <Select onValueChange={(value) => updateFormData('propertyType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single-family">Single Family Home</SelectItem>
                  <SelectItem value="condo">Condominium</SelectItem>
                  <SelectItem value="townhouse">Townhouse</SelectItem>
                  <SelectItem value="multi-family">Multi-Family</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="loanAmount">Loan Amount</Label>
                <Input
                  id="loanAmount"
                  value={formData.loanAmount}
                  onChange={(e) => updateFormData('loanAmount', e.target.value)}
                  placeholder="$400,000"
                />
              </div>
              <div>
                <Label htmlFor="homeValue">Home Value</Label>
                <Input
                  id="homeValue"
                  value={formData.homeValue}
                  onChange={(e) => updateFormData('homeValue', e.target.value)}
                  placeholder="$500,000"
                />
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="employmentStatus">Employment Status</Label>
              <Select onValueChange={(value) => updateFormData('employmentStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self-employed">Self-Employed</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employer">Employer Name</Label>
                <Input
                  id="employer"
                  value={formData.employer}
                  onChange={(e) => updateFormData('employer', e.target.value)}
                  placeholder="Acme Corporation"
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => updateFormData('jobTitle', e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="income">Annual Gross Income</Label>
              <Input
                id="income"
                value={formData.income}
                onChange={(e) => updateFormData('income', e.target.value)}
                placeholder="$85,000"
              />
            </div>
          </div>
        );
      
      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Application</h3>
              <p className="text-gray-600">Please review the information below before submitting</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <p className="text-sm text-gray-600">
                  {formData.firstName} {formData.lastName} • {formData.email}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Loan Details</h4>
                <p className="text-sm text-gray-600">
                  {formData.loanPurpose} • {formData.loanAmount} • {formData.propertyType}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Employment</h4>
                <p className="text-sm text-gray-600">
                  {formData.employer} • {formData.jobTitle} • {formData.income}
                </p>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Step {currentStep}</h3>
            <p className="text-gray-600">This step is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl">Mortgage Application</CardTitle>
              <p className="text-gray-600 mt-1">
                Step {currentStep} of {steps.length}: {steps[currentStep - 1]?.title}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center space-y-2 ${
                  step.id <= currentStep ? 'text-[#0054ff]' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.id < currentStep
                      ? 'bg-green-500 text-white'
                      : step.id === currentStep
                      ? 'bg-[#0054ff] text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span className="text-xs font-medium hidden sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-8">
            {renderStepContent()}
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <Button
              onClick={nextStep}
              disabled={currentStep === steps.length}
              className="bg-[#0054ff] hover:bg-blue-600 flex items-center"
            >
              {currentStep === steps.length ? 'Submit Application' : 'Next'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationWizard;
