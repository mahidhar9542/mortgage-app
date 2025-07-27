
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Search, CheckCircle, Home, ArrowRight } from 'lucide-react';

const ProcessFlow = () => {
  const steps = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Apply Online",
      description: "Complete our smart 1003 application in minutes with auto-fill technology",
      duration: "5 minutes"
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: "Instant Decision",
      description: "Our AI-powered underwriting provides immediate pre-approval results",
      duration: "30 seconds"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Upload Documents",
      description: "Secure document portal with OCR and automatic verification",
      duration: "1 day"
    },
    {
      icon: <Home className="w-8 h-8" />,
      title: "Close & Fund",
      description: "E-sign closing documents and receive funds via ACH transfer",
      duration: "15 days"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            From Application to Keys in 4 Simple Steps
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our streamlined digital process eliminates traditional mortgage hassles
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Arrow */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-[#0054ff]" />
                </div>
              )}
              
              <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="text-[#0054ff]">{step.icon}</div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-[#0054ff] text-white text-xs px-3 py-1 rounded-full inline-block">
                      Step {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                    <div className="text-[#0054ff] font-medium text-sm">
                      ⏱️ {step.duration}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h4 className="font-semibold text-green-800 mb-2">Why We're Faster</h4>
            <p className="text-green-700 text-sm">
              Traditional lenders take 30-45 days. Our AI-powered platform, automated compliance checks, 
              and digital-first approach cuts that time by more than half.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessFlow;
