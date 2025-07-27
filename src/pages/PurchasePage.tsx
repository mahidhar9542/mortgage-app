import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Calculator, 
  DollarSign, 
  Shield, 
  CheckCircle, 
  Phone, 
  ArrowRight,
  TrendingUp,
  Users,
  Award,
  Star,
  Clock,
  FileText,
  Search,
  Upload,
  User,
  Building,
  CreditCard,
  MapPin,
  FileCheck,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Info,
  MessageSquare,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const mortgageProducts = [
  { type: '30-Year Fixed', interestRate: 6.25, apr: 6.3, exampleMonthly: 1231, bestFor: 'Long-term homeowners' },
  { type: '15-Year Fixed', interestRate: 5.75, apr: 5.9, exampleMonthly: 1647, bestFor: 'Pay off faster' },
  { type: 'FHA Loan', interestRate: 6.125, apr: 6.834, exampleMonthly: 1215, bestFor: 'Lower credit scores' },
  { type: 'VA Loan', interestRate: 6.25, apr: 6.439, exampleMonthly: 1231, bestFor: 'Veterans & service members' }
];

const faqs = [
  { question: 'What documents do I need?', answer: 'Pay stubs, ID, bank statements, and more.' },
  { question: 'How long is pre-approval valid?', answer: 'Typically 60-90 days.' },
  { question: 'Can I change my loan later?', answer: 'Yes, you can refinance or change terms later.' },
  { question: 'How long does the application process take?', answer: 'About 15-20 minutes for the initial application.' }
];

const PurchasePage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    ssn: '',
    dateOfBirth: '',
    
    // Income Info
    employer: '',
    monthlyIncome: '',
    jobTitle: '',
    employmentLength: '',
    
    // Bank Info
    bankName: '',
    accountType: '',
    accountNumber: '',
    
    // Property Info
    propertyAddress: '',
    purchasePrice: '',
    propertyType: '',
    downPayment: '',
    
    // Documents
    idProof: null,
    payStubs: [],
    bankStatements: [],
    purchaseAgreement: null,
    taxReturns: []
  });

  const [showApplication, setShowApplication] = useState(false);
  const [calculator, setCalculator] = useState({ homePrice: '', downPayment: '', interestRate: '6.25', loanTerm: '30' });
  const [contact, setContact] = useState({ name: '', email: '', message: '' });

  const steps = [
    { id: 1, title: 'Account Setup', description: 'Create your account or sign in' },
    { id: 2, title: 'Personal Information', description: 'Basic personal details' },
    { id: 3, title: 'Income & Employment', description: 'Employment and income details' },
    { id: 4, title: 'Bank Information', description: 'Banking and financial details' },
    { id: 5, title: 'Property Details', description: 'Property and purchase information' },
    { id: 6, title: 'Document Upload', description: 'Upload required documents' },
    { id: 7, title: 'Review & Submit', description: 'Review and submit application' }
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (files) {
      if (field === 'payStubs' || field === 'bankStatements' || field === 'taxReturns') {
        setFormData(prev => ({ 
          ...prev, 
          [field]: [...Array.from(files)]
        }));
      } else {
        setFormData(prev => ({ 
          ...prev, 
          [field]: files[0]
        }));
      }
    }
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

  const calculateMonthly = () => {
    const L = parseFloat(calculator.homePrice) - parseFloat(calculator.downPayment);
    const r = parseFloat(calculator.interestRate) / 100 / 12;
    const n = parseInt(calculator.loanTerm) * 12;
    if (!L || !r || !n) return 0;
    return Math.round((L * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Welcome to MortgagePro</h2>
              <p className="text-gray-600">Start your home buying journey with zero closing costs</p>
            </div>
            
            <Card className="border-2 border-dashed border-blue-200 hover:border-blue-300 transition-colors">
              <CardContent className="p-8 text-center">
                <User className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">New to MortgagePro?</h3>
                <p className="text-gray-600 mb-6">Create your account to get started</p>
                <Link to="/auth/signup">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Create Account
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-2 border-dashed border-green-200 hover:border-green-300 transition-colors">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Already have an account?</h3>
                <p className="text-gray-600 mb-6">Sign in to continue your application</p>
                <Link to="/auth/signin">
                  <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                    Sign In
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Personal Information</h2>
              <p className="text-gray-600">Tell us about yourself</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div>
                <Label htmlFor="ssn">Social Security Number *</Label>
                <div className="relative">
                  <Input
                    id="ssn"
                    type={showPassword ? "text" : "password"}
                    value={formData.ssn}
                    onChange={(e) => handleInputChange('ssn', e.target.value)}
                    placeholder="XXX-XX-XXXX"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Income & Employment</h2>
              <p className="text-gray-600">Tell us about your employment and income</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="employer">Employer Name *</Label>
                <Input
                  id="employer"
                  value={formData.employer}
                  onChange={(e) => handleInputChange('employer', e.target.value)}
                  placeholder="Enter employer name"
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder="Enter your job title"
                />
              </div>
              <div>
                <Label htmlFor="monthlyIncome">Monthly Income *</Label>
                <Input
                  id="monthlyIncome"
                  type="number"
                  value={formData.monthlyIncome}
                  onChange={(e) => handleInputChange('monthlyIncome', e.target.value)}
                  placeholder="Enter monthly income"
                />
              </div>
              <div>
                <Label htmlFor="employmentLength">Employment Length *</Label>
                <Select value={formData.employmentLength} onValueChange={(value) => handleInputChange('employmentLength', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employment length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="2-5">2-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10-plus">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Income Documentation Required</h4>
                    <p className="text-blue-700 text-sm mt-1">
                      You'll need to upload your recent pay stubs (last 2 months) and W-2 forms in the next step.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Bank Information</h2>
              <p className="text-gray-600">Tell us about your banking details</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="bankName">Bank Name *</Label>
                <Input
                  id="bankName"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange('bankName', e.target.value)}
                  placeholder="Enter bank name"
                />
              </div>
              <div>
                <Label htmlFor="accountType">Account Type *</Label>
                <Select value={formData.accountType} onValueChange={(value) => handleInputChange('accountType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                    <SelectItem value="both">Both</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="accountNumber">Account Number (Last 4 digits) *</Label>
                <Input
                  id="accountNumber"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  placeholder="Enter last 4 digits"
                  maxLength={4}
                />
              </div>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900">Security Notice</h4>
                    <p className="text-green-700 text-sm mt-1">
                      We only need the last 4 digits of your account number for verification. Your full account details are never stored.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Property Details</h2>
              <p className="text-gray-600">Tell us about the property you want to purchase</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Label htmlFor="propertyAddress">Property Address *</Label>
                <Input
                  id="propertyAddress"
                  value={formData.propertyAddress}
                  onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                  placeholder="Enter full property address"
                />
              </div>
              <div>
                <Label htmlFor="purchasePrice">Purchase Price *</Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={formData.purchasePrice}
                  onChange={(e) => handleInputChange('purchasePrice', e.target.value)}
                  placeholder="Enter purchase price"
                />
              </div>
              <div>
                <Label htmlFor="downPayment">Down Payment *</Label>
                <Input
                  id="downPayment"
                  type="number"
                  value={formData.downPayment}
                  onChange={(e) => handleInputChange('downPayment', e.target.value)}
                  placeholder="Enter down payment amount"
                />
              </div>
              <div>
                <Label htmlFor="propertyType">Property Type *</Label>
                <Select value={formData.propertyType} onValueChange={(value) => handleInputChange('propertyType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single-family">Single Family Home</SelectItem>
                    <SelectItem value="condo">Condominium</SelectItem>
                    <SelectItem value="townhouse">Townhouse</SelectItem>
                    <SelectItem value="multi-family">Multi-Family</SelectItem>
                    <SelectItem value="manufactured">Manufactured Home</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {formData.purchasePrice && formData.downPayment && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Loan Summary</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Purchase Price:</span>
                      <span className="float-right font-semibold">${parseInt(formData.purchasePrice).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Down Payment:</span>
                      <span className="float-right font-semibold">${parseInt(formData.downPayment).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Loan Amount:</span>
                      <span className="float-right font-semibold">${(parseInt(formData.purchasePrice) - parseInt(formData.downPayment)).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Down Payment %:</span>
                      <span className="float-right font-semibold">{((parseInt(formData.downPayment) / parseInt(formData.purchasePrice)) * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Document Upload</h2>
              <p className="text-gray-600">Upload the required documents for your application</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Identity Documents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="idProof">Government ID (Passport/Driver's License) *</Label>
                      <Input
                        id="idProof"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('idProof', e.target.files)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5" />
                    <span>Income Documents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="payStubs">Recent Pay Stubs (Last 2 months) *</Label>
                      <Input
                        id="payStubs"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('payStubs', e.target.files)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="taxReturns">Tax Returns (Last 2 years) - Optional</Label>
                      <Input
                        id="taxReturns"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('taxReturns', e.target.files)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="w-5 h-5" />
                    <span>Bank Documents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bankStatements">Bank Statements (Last 2-3 months) *</Label>
                      <Input
                        id="bankStatements"
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('bankStatements', e.target.files)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Property Documents</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="purchaseAgreement">Purchase Agreement/Sale Contract *</Label>
                      <Input
                        id="purchaseAgreement"
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('purchaseAgreement', e.target.files)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">Document Requirements</h4>
                    <ul className="text-yellow-700 text-sm mt-1 space-y-1">
                      <li>• All documents must be clear and legible</li>
                      <li>• Accepted formats: PDF, JPG, JPEG, PNG</li>
                      <li>• Maximum file size: 10MB per file</li>
                      <li>• Required documents are marked with *</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-2">Review & Submit</h2>
              <p className="text-gray-600">Review your application before submitting</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span>{formData.firstName} {formData.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{formData.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phone:</span>
                    <span>{formData.phone}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Employment & Income</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employer:</span>
                    <span>{formData.employer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Title:</span>
                    <span>{formData.jobTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Income:</span>
                    <span>${formData.monthlyIncome}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Address:</span>
                    <span className="text-right">{formData.propertyAddress}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Price:</span>
                    <span>${formData.purchasePrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Down Payment:</span>
                    <span>${formData.downPayment}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Documents Uploaded</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID Proof:</span>
                    <Badge variant={formData.idProof ? "default" : "secondary"}>
                      {formData.idProof ? "Uploaded" : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pay Stubs:</span>
                    <Badge variant={formData.payStubs.length > 0 ? "default" : "secondary"}>
                      {formData.payStubs.length > 0 ? `${formData.payStubs.length} files` : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bank Statements:</span>
                    <Badge variant={formData.bankStatements.length > 0 ? "default" : "secondary"}>
                      {formData.bankStatements.length > 0 ? `${formData.bankStatements.length} files` : "Missing"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purchase Agreement:</span>
                    <Badge variant={formData.purchaseAgreement ? "default" : "secondary"}>
                      {formData.purchaseAgreement ? "Uploaded" : "Missing"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-900">Ready to Submit</h4>
                    <p className="text-green-700 text-sm mt-1">
                      Your application will be reviewed by our team. You'll receive a confirmation email and can track your application status in your dashboard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Hero Section */}
      <section className="sticky top-0 z-40 bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Buy Your Dream Home</h1>
          <p className="text-xl mb-6">Get pre-approved, compare rates, and close confidently</p>
          <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300" onClick={() => setShowApplication(true)}>
            Start Your Application
          </Button>
        </div>
      </section>

      {/* Only show the rest if not in application mode */}
      {!showApplication && <>
        {/* Step-by-Step Process */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <Card>
                <CardContent className="py-8">
                  <CheckCircle className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Step 1: Pre-Approval</h3>
                  <p className="text-gray-600 text-sm">Get pre-approved online in minutes</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-8">
                  <Home className="w-10 h-10 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Step 2: Find Your Home</h3>
                  <p className="text-gray-600 text-sm">Shop with confidence and submit offers</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-8">
                  <FileText className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold mb-1">Step 3: Close the Loan</h3>
                  <p className="text-gray-600 text-sm">Finalize paperwork and move in</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mortgage Products Table */}
        <section className="py-12 bg-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Compare Mortgage Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr className="bg-blue-50">
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Interest Rate</th>
                    <th className="px-4 py-2 text-left">APR</th>
                    <th className="px-4 py-2 text-left">Monthly Payment</th>
                    <th className="px-4 py-2 text-left">Best For</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {mortgageProducts.map((p, i) => (
                    <tr key={i} className="border-b">
                      <td className="px-4 py-2 font-semibold">{p.type}</td>
                      <td className="px-4 py-2">{p.interestRate}%</td>
                      <td className="px-4 py-2">{p.apr}%</td>
                      <td className="px-4 py-2">${p.exampleMonthly}/mo</td>
                      <td className="px-4 py-2 text-sm">{p.bestFor}</td>
                      <td className="px-4 py-2">
                        <Button size="sm" variant="outline" onClick={() => setShowApplication(true)}>
                          Select & Apply
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Mortgage Calculator */}
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Mortgage Calculator</h2>
            <Card>
              <CardContent className="py-8 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Home Price</Label>
                    <Input type="number" value={calculator.homePrice} onChange={e => setCalculator({ ...calculator, homePrice: e.target.value })} placeholder="$300,000" />
                  </div>
                  <div>
                    <Label>Down Payment</Label>
                    <Input type="number" value={calculator.downPayment} onChange={e => setCalculator({ ...calculator, downPayment: e.target.value })} placeholder="$60,000" />
                  </div>
                  <div>
                    <Label>Interest Rate (%)</Label>
                    <Input type="number" value={calculator.interestRate} onChange={e => setCalculator({ ...calculator, interestRate: e.target.value })} />
                  </div>
                  <div>
                    <Label>Loan Term (years)</Label>
                    <Input type="number" value={calculator.loanTerm} onChange={e => setCalculator({ ...calculator, loanTerm: e.target.value })} />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <span className="text-lg font-semibold">Estimated Monthly Payment: </span>
                  <span className="text-2xl text-blue-600 font-bold">${calculateMonthly() || 0}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-12 bg-gray-100">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Us?</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <Shield className="w-10 h-10 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">No Hidden Fees</h3>
                <p className="text-gray-600 text-sm">Transparent pricing, zero closing costs</p>
              </div>
              <div>
                <Clock className="w-10 h-10 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Fast Closings</h3>
                <p className="text-gray-600 text-sm">Close in as little as 14 days</p>
              </div>
              <div>
                <Users className="w-10 h-10 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Expert Support</h3>
                <p className="text-gray-600 text-sm">Dedicated loan officers</p>
              </div>
              <div>
                <Award className="w-10 h-10 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Top Rated</h3>
                <p className="text-gray-600 text-sm">Thousands of 5-star reviews</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 bg-white">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible>
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={String(i)}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Contact/Support Section */}
        <section className="py-12 bg-gray-100">
          <div className="max-w-3xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6 text-center">Contact & Support</h2>
            <Card>
              <CardContent className="py-8 space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={contact.name} onChange={e => setContact({ ...contact, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Message</Label>
                  <Input value={contact.message} onChange={e => setContact({ ...contact, message: e.target.value })} />
                </div>
                <Button className="mt-4">Send Message</Button>
                <div className="text-center text-sm text-gray-500 mt-4">
                  <Mail className="inline w-4 h-4 mr-1" /> support@mortgagepro.com &nbsp;|&nbsp;
                  <MessageSquare className="inline w-4 h-4 mr-1" /> (555) 123-LOAN
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </>}

      {/* Application Progress Form (7-step) - only show when triggered */}
      {showApplication && (
        <section className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4">
            {/* Place your existing application progress form here, untouched */}
            {renderStepContent()}
            
            {/* Navigation Buttons */}
            <div className="flex justify-between mt-12">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Link to="/application-submitted">
                  <Button className="flex items-center space-x-2 bg-green-600 hover:bg-green-700">
                    <span>Submit Application</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default PurchasePage; 