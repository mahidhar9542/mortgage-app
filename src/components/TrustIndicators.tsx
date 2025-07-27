
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Award, Users, TrendingUp } from 'lucide-react';

const TrustIndicators = () => {
  const metrics = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "50,000+",
      label: "Loans Funded",
      color: "text-blue-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "$12B+",
      label: "Total Funded",
      color: "text-green-600"
    },
    {
      icon: <Award className="w-8 h-8" />,
      value: "4.9/5",
      label: "Customer Rating",
      color: "text-yellow-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      value: "A+",
      label: "BBB Rating",
      color: "text-purple-600"
    }
  ];

  const certifications = [
    "Equal Housing Lender",
    "FDIC Insured",
    "SOC 2 Type II Certified",
    "CFPB Compliant"
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <Card key={index} className="text-center border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className={`${metric.color} mb-2 flex justify-center`}>
                  {metric.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Certifications */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Licensed & Regulated
          </h3>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            {certifications.map((cert, index) => (
              <div key={index} className="flex items-center">
                <Shield className="w-4 h-4 mr-2 text-green-600" />
                {cert}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustIndicators;
