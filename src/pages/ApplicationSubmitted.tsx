import { CheckCircle2, Clock, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ApplicationSubmitted = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-primary text-white py-12 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-white" />
            </div>
            <CardTitle className="text-3xl font-bold">
              Application Submitted Successfully!
            </CardTitle>
            <p className="text-white/90 mt-2">
              Thank you for choosing us for your mortgage needs.
            </p>
          </CardHeader>
          
          <CardContent className="py-12 px-6 sm:px-12">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  What Happens Next?
                </h2>
                <p className="text-gray-600">
                  We've received your application and our team will review it shortly. 
                  Here's what you can expect:
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Review Process</h3>
                    <p className="mt-1 text-gray-600">
                      Our loan officers will review your information within 1 business day.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Email Confirmation</h3>
                    <p className="mt-1 text-gray-600">
                      You'll receive a confirmation email with your application details and next steps.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium text-gray-900">Next Steps</h3>
                    <p className="mt-1 text-gray-600">
                      A loan officer will contact you to discuss your options and guide you through the process.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-center text-gray-900 mb-4">
                  Need immediate assistance?
                </h3>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button variant="outline" className="gap-2">
                    <Phone className="h-4 w-4" />
                    Call Us: (800) 123-4567
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Mail className="h-4 w-4" />
                    Email Us
                  </Button>
                </div>
              </div>
              
              <div className="mt-10 text-center">
                <Button onClick={() => window.location.href = '/'}>
                  Back to Homepage
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApplicationSubmitted;
