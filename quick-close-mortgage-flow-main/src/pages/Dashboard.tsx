
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { 
  Loader2, 
  MessageSquare, 
  Phone, 
  Download, 
  CreditCard, 
  Home, 
  ArrowUpRight, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  Upload
} from 'lucide-react';

// Types
type ApplicationStatus = 'not_started' | 'in_progress' | 'under_review' | 'approved' | 'funded' | 'rejected';

type ApplicationStep = {
  id: string;
  title: string;
  status: 'complete' | 'current' | 'upcoming';
  completedAt?: string;
};

type ApplicationData = {
  id: string;
  status: ApplicationStatus;
  currentStep: number;
  steps: ApplicationStep[];
  loanAmount: number;
  interestRate: number;
  monthlyPayment: number;
  loanTerm: number;
  estimatedClosing: string;
  lastUpdated: string;
};

// Mock data for the application steps
const applicationSteps: ApplicationStep[] = [
  { id: 'personal_info', title: 'Personal Information', status: 'complete' },
  { id: 'property_details', title: 'Property Details', status: 'complete' },
  { id: 'financial_info', title: 'Financial Information', status: 'current' },
  { id: 'document_upload', title: 'Document Upload', status: 'upcoming' },
  { id: 'review', title: 'Review & Submit', status: 'upcoming' },
  { id: 'approval', title: 'Approval', status: 'upcoming' },
];

// Mock loan data
const mockLoanData = {
  id: 'LOAN-2023-4567',
  status: 'in_progress' as ApplicationStatus,
  currentStep: 2,
  steps: applicationSteps,
  loanAmount: 400000,
  interestRate: 6.75,
  monthlyPayment: 2594,
  loanTerm: 30,
  estimatedClosing: '2023-12-15',
  lastUpdated: new Date().toISOString(),
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate API call to fetch application data
    const fetchApplicationData = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch this from your API
        // const response = await fetch('/api/application');
        // const data = await response.json();
        
        // Using mock data for now
        setTimeout(() => {
          setApplicationData(mockLoanData);
          // Calculate progress based on completed steps
          const completedSteps = mockLoanData.steps.filter(step => step.status === 'complete').length;
          const totalSteps = mockLoanData.steps.length;
          setProgress(Math.round((completedSteps / totalSteps) * 100));
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching application data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load application data. Please try again later.',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchApplicationData();
    } else {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'funded':
        return <Badge className="bg-purple-100 text-purple-800">Funded</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Not Approved</Badge>;
      default:
        return <Badge>Not Started</Badge>;
    }
  };

  const getStatusIcon = (status: 'complete' | 'current' | 'upcoming') => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'current':
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case 'upcoming':
        return <div className="h-5 w-5 rounded-full border-2 border-gray-300" />;
      default:
        return null;
    }
  };

  if (loading || !applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Valued Customer'}!
              </h1>
              <p className="text-gray-600">
                Here's the latest update on your mortgage application
              </p>
            </div>
            <Button onClick={logout} variant="outline">
              Sign Out
            </Button>
          </div>
          
          {/* Application Status Card */}
          <Card className="mt-6 border-l-4 border-blue-500">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">Application #{applicationData.id}</CardTitle>
                  <CardDescription>
                    Last updated: {format(new Date(applicationData.lastUpdated), 'MMMM d, yyyy')}
                  </CardDescription>
                </div>
                {getStatusBadge(applicationData.status)}
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium">{progress}% Complete</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div className="space-y-4 pt-2">
                  <h3 className="font-medium text-gray-900">Next Steps</h3>
                  <ul className="space-y-4">
                    {applicationData.steps.map((step, index) => (
                      <li key={step.id} className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                          {getStatusIcon(step.status)}
                        </div>
                        <div className="ml-3">
                          <p className={`text-sm font-medium ${
                            step.status === 'current' ? 'text-blue-600' : 'text-gray-700'
                          }`}>
                            {step.title}
                          </p>
                          {step.completedAt && (
                            <p className="text-xs text-gray-500">
                              Completed on {format(new Date(step.completedAt), 'MMM d, yyyy')}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t">
                  <Button 
                    className="w-full sm:w-auto" 
                    onClick={() => navigate('/apply-now')}
                  >
                    {applicationData.status === 'not_started' ? 'Start Application' : 'Continue Application'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Document Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Required Documents</CardTitle>
                <CardDescription>
                  Upload the following documents to complete your application
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    'Pay stubs (last 30 days)',
                    'W-2 forms (last 2 years)',
                    'Bank statements (last 2 months)',
                    'Government-issued ID',
                    'Proof of income (if self-employed)'
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                        <span className="text-sm font-medium">{doc}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        Upload
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Loan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Amount:</span>
                  <span className="font-semibold">
                    ${applicationData.loanAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interest Rate:</span>
                  <span className="font-semibold">
                    {applicationData.interestRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly Payment:</span>
                  <span className="font-semibold">
                    ${applicationData.monthlyPayment.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loan Term:</span>
                  <span className="font-semibold">
                    {applicationData.loanTerm} years
                  </span>
                </div>
                <div className="pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Closing:</span>
                    <span className="font-semibold text-green-600">
                      {format(new Date(applicationData.estimatedClosing), 'MMMM d, yyyy')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Your Loan Officer
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule a Call
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="w-4 h-4 mr-2" />
                  Download Disclosures
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Credit Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <Home className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">1234 Oak Street</p>
                    <p className="text-sm text-gray-600">Beverly Hills, CA 90210</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Single Family • 3 bed, 2 bath • 2,100 sq ft
                    </p>
                    <Badge variant="secondary" className="mt-2">
                      Primary Residence
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Loan Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">SM</span>
                    </div>
                    <div>
                      <p className="font-medium">Sarah Martinez</p>
                      <p className="text-sm text-gray-600">Loan Officer</p>
                      <p className="text-sm text-blue-600">(555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-medium">MJ</span>
                    </div>
                    <div>
                      <p className="font-medium">Michael Johnson</p>
                      <p className="text-sm text-gray-600">Loan Processor</p>
                      <p className="text-sm text-blue-600">(555) 123-4568</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
