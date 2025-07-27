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
  Upload,
  Trash2
} from 'lucide-react';
import { 
  getApplications, 
  getApplicationDetails, 
  getDocuments, 
  getLoanTeam, 
  downloadDisclosures, 
  getCreditReport,
  deleteDocument,
  ApplicationData,
  Document,
  LoanTeamMember,
  CreditReport
} from '@/lib/dashboardApi';
import { MessageModal } from '@/components/dashboard/MessageModal';
import { ScheduleCallModal } from '@/components/dashboard/ScheduleCallModal';
import { DocumentUploadModal } from '@/components/dashboard/DocumentUploadModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user: currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loanTeam, setLoanTeam] = useState<LoanTeamMember[]>([]);
  const [creditReport, setCreditReport] = useState<CreditReport | null>(null);
  const [progress, setProgress] = useState(0);
  
  // Modal states
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [scheduleCallModalOpen, setScheduleCallModalOpen] = useState(false);
  const [documentUploadModalOpen, setDocumentUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        console.log('Starting dashboard data fetch...');
        setLoading(true);
        
        // Fetch all dashboard data in parallel
        console.log('Fetching applications...');
        const applications = await getApplications().catch((error) => {
          console.error('Error fetching applications:', error);
          return [];
        });
        console.log('Applications fetched:', applications);

        console.log('Fetching documents...');
        const docs = await getDocuments().catch((error) => {
          console.error('Error fetching documents:', error);
          return [];
        });
        console.log('Documents fetched:', docs);

        console.log('Fetching loan team...');
        const team = await getLoanTeam().catch((error) => {
          console.error('Error fetching loan team:', error);
          return [];
        });
        console.log('Loan team fetched:', team);

        console.log('Fetching credit report...');
        const credit = await getCreditReport().catch((error) => {
          console.error('Error fetching credit report:', error);
          return null;
        });
        console.log('Credit report fetched:', credit);

        // Use the first application or create mock data
        if (applications.length > 0) {
          try {
            console.log('Fetching application details for:', applications[0].id);
            const firstApp = applications[0];
            const detailedApp = await getApplicationDetails(firstApp.id);
            console.log('Application details fetched:', detailedApp);
            setApplicationData(detailedApp);
            
            // Calculate progress
            const completedSteps = detailedApp.steps.filter(step => step.status === 'complete').length;
            const totalSteps = detailedApp.steps.length;
            setProgress(Math.round((completedSteps / totalSteps) * 100));
          } catch (error) {
            console.error('Error fetching application details:', error);
            // Create mock data if application details fail
            const mockApplication: ApplicationData = {
              id: 'MOCK-APP-001',
              status: 'new',
              currentStep: 0,
              steps: [
                { id: 'personal_info', title: 'Personal Information', status: 'upcoming' },
                { id: 'property_details', title: 'Property Details', status: 'upcoming' },
                { id: 'financial_info', title: 'Financial Information', status: 'upcoming' },
                { id: 'document_upload', title: 'Document Upload', status: 'upcoming' },
                { id: 'review', title: 'Review & Submit', status: 'upcoming' },
                { id: 'approval', title: 'Approval', status: 'upcoming' },
              ],
              loanAmount: 0,
              interestRate: 0,
              monthlyPayment: 0,
              loanTerm: 30,
              estimatedClosing: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              lastUpdated: new Date().toISOString(),
            };
            setApplicationData(mockApplication);
            setProgress(0);
          }
        } else {
          console.log('No applications found, creating mock data...');
          // Create mock data for new users
          const mockApplication: ApplicationData = {
            id: 'MOCK-APP-001',
            status: 'new',
            currentStep: 0,
            steps: [
              { id: 'personal_info', title: 'Personal Information', status: 'upcoming' },
              { id: 'property_details', title: 'Property Details', status: 'upcoming' },
              { id: 'financial_info', title: 'Financial Information', status: 'upcoming' },
              { id: 'document_upload', title: 'Document Upload', status: 'upcoming' },
              { id: 'review', title: 'Review & Submit', status: 'upcoming' },
              { id: 'approval', title: 'Approval', status: 'upcoming' },
            ],
            loanAmount: 0,
            interestRate: 0,
            monthlyPayment: 0,
            loanTerm: 30,
            estimatedClosing: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            lastUpdated: new Date().toISOString(),
          };
          setApplicationData(mockApplication);
          setProgress(0);
        }

        setDocuments(docs);
        setLoanTeam(team);
        setCreditReport(credit);
        console.log('Dashboard data fetch completed successfully');
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data. Please try again later.',
          variant: 'destructive',
        });
        
        // Set fallback data even on error
        const fallbackApplication: ApplicationData = {
          id: 'FALLBACK-APP-001',
          status: 'new',
          currentStep: 0,
          steps: [
            { id: 'personal_info', title: 'Personal Information', status: 'upcoming' },
            { id: 'property_details', title: 'Property Details', status: 'upcoming' },
            { id: 'financial_info', title: 'Financial Information', status: 'upcoming' },
            { id: 'document_upload', title: 'Document Upload', status: 'upcoming' },
            { id: 'review', title: 'Review & Submit', status: 'upcoming' },
            { id: 'approval', title: 'Approval', status: 'upcoming' },
          ],
          loanAmount: 0,
          interestRate: 0,
          monthlyPayment: 0,
          loanTerm: 30,
          estimatedClosing: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          lastUpdated: new Date().toISOString(),
        };
        setApplicationData(fallbackApplication);
        setProgress(0);
        setDocuments([]);
        setLoanTeam([]);
        setCreditReport(null);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    if (currentUser) {
      console.log('Current user found, fetching dashboard data...', currentUser);
      fetchDashboardData();
    } else {
      console.log('No current user, redirecting to signin...');
      navigate('/auth/signin');
    }
  }, [currentUser, navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      case 'qualified':
        return <Badge className="bg-green-100 text-green-800">Qualified</Badge>;
      case 'closed':
        return <Badge className="bg-purple-100 text-purple-800">Closed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Not Approved</Badge>;
      default:
        return <Badge>New</Badge>;
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

  const handleDownloadDisclosures = async () => {
    try {
      const result = await downloadDisclosures();
      // In a real app, this would trigger a file download
      toast({
        title: 'Success',
        description: 'Disclosures downloaded successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download disclosures',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      setDocuments(docs => docs.filter(doc => doc.id !== documentId));
      toast({
        title: 'Success',
        description: 'Document deleted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete document',
        variant: 'destructive',
      });
    }
  };

  const handleDocumentUploadSuccess = () => {
    // Refresh documents list
    getDocuments().then(setDocuments);
  };

  if (loading || !applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
          {/* Debug info */}
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-xs text-gray-500 max-w-md">
            <p><strong>Debug Info:</strong></p>
            <p>Loading: {loading.toString()}</p>
            <p>Application Data: {applicationData ? 'Loaded' : 'Not loaded'}</p>
            <p>Current User: {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'None'}</p>
            <p>User Email: {currentUser?.email || 'None'}</p>
          </div>
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
                    onClick={() => navigate('/apply')}
                  >
                    {applicationData.status === 'new' ? 'Start Application' : 'Continue Application'}
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
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">Required Documents</CardTitle>
                    <CardDescription>
                      Upload the following documents to complete your application
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={() => setDocumentUploadModalOpen(true)}
                    size="sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {documents.length > 0 ? (
                    documents.map((doc) => (
                      <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-3" />
                          <div>
                            <span className="text-sm font-medium">{doc.name}</span>
                            <p className="text-xs text-gray-500">
                              Uploaded {format(new Date(doc.uploadedAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={doc.status === 'approved' ? 'default' : 'secondary'}>
                            {doc.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No documents uploaded yet</p>
                      <Button 
                        onClick={() => setDocumentUploadModalOpen(true)}
                        variant="outline"
                        className="mt-2"
                      >
                        Upload Your First Document
                      </Button>
                    </div>
                  )}
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
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setMessageModalOpen(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Your Loan Officer
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => setScheduleCallModalOpen(true)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Schedule a Call
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleDownloadDisclosures}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Disclosures
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    if (creditReport) {
                      toast({
                        title: 'Credit Report',
                        description: `Your credit score is ${creditReport.score}`,
                      });
                    }
                  }}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Credit Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Loan Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {loanTeam.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium">{member.avatar}</span>
                      </div>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-600">{member.role}</p>
                        <p className="text-sm text-blue-600">{member.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <MessageModal
        isOpen={messageModalOpen}
        onClose={() => setMessageModalOpen(false)}
        applicationId={applicationData.id}
      />
      
      <ScheduleCallModal
        isOpen={scheduleCallModalOpen}
        onClose={() => setScheduleCallModalOpen(false)}
        applicationId={applicationData.id}
      />
      
      <DocumentUploadModal
        isOpen={documentUploadModalOpen}
        onClose={() => setDocumentUploadModalOpen(false)}
        applicationId={applicationData.id}
        onUploadSuccess={handleDocumentUploadSuccess}
      />
    </div>
  );
};

export default Dashboard;
