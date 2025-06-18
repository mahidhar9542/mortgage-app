
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, FileText, Home, DollarSign, AlertCircle } from 'lucide-react';

interface StatusStepProps {
  icon: React.ReactNode;
  title: string;
  status: 'completed' | 'current' | 'pending';
  description?: string;
}

const StatusStep: React.FC<StatusStepProps> = ({ icon, title, status, description }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'current': return 'text-[#0054ff]';
      case 'pending': return 'text-gray-400';
    }
  };

  const getIconBg = () => {
    switch (status) {
      case 'completed': return 'bg-green-100';
      case 'current': return 'bg-blue-100';
      case 'pending': return 'bg-gray-100';
    }
  };

  return (
    <div className="flex items-start space-x-4">
      <div className={`p-3 rounded-full ${getIconBg()}`}>
        <div className={getStatusColor()}>
          {icon}
        </div>
      </div>
      <div className="flex-1">
        <h3 className={`font-semibold ${getStatusColor()}`}>{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="flex-shrink-0">
        {status === 'completed' && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
        {status === 'current' && (
          <Clock className="w-5 h-5 text-[#0054ff]" />
        )}
      </div>
    </div>
  );
};

const ApplicationStatus = () => {
  const steps = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Application Submitted",
      status: 'completed' as const,
      description: "Received March 15, 2024"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Document Review",
      status: 'completed' as const,
      description: "All required documents received"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Income Verification",
      status: 'current' as const,
      description: "Reviewing employment and income details"
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "Property Appraisal",
      status: 'pending' as const,
      description: "Scheduled for March 22, 2024"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Final Approval",
      status: 'pending' as const,
      description: "Pending completion of previous steps"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Application Status</CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-[#0054ff]">
            In Progress
          </Badge>
        </div>
        <p className="text-gray-600">Loan Application #LA-2024-0315-001</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {steps.map((step, index) => (
            <StatusStep
              key={index}
              icon={step.icon}
              title={step.title}
              status={step.status}
              description={step.description}
            />
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Action Required</h4>
              <p className="text-sm text-amber-700 mt-1">
                Please upload your most recent pay stub to complete income verification.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationStatus;
