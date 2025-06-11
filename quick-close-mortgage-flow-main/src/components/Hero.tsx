import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Clock, Shield, DollarSign, TrendingUp } from 'lucide-react';

const Hero = () => {
  const [homeValue, setHomeValue] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [estimatedPayment, setEstimatedPayment] = useState<number | null>(null);

  const calculatePayment = () => {
    if (homeValue && loanAmount) {
      const principal = parseFloat(loanAmount.replace(/,/g, ''));
      const rate = 0.065; // 6.5% example rate
      const months = 360; // 30 years
      
      const monthlyRate = rate / 12;
      const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
      setEstimatedPayment(Math.round(payment));
    }
  };

  const benefits = [
    { icon: <Clock className="w-5 h-5" />, text: "15-Day Close Guarantee" },
    { icon: <DollarSign className="w-5 h-5" />, text: "Zero Closing Costs" },
    { icon: <CheckCircle className="w-5 h-5" />, text: "One-Sitting Approval" },
    { icon: <Shield className="w-5 h-5" />, text: "FDIC Insured Lender" }
  ];

  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center bg-blue-100 text-[#0054ff] px-3 py-1 rounded-full text-sm font-medium">
                <TrendingUp className="w-4 h-4 mr-2" />
                Rates from 6.25% APR*
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Get Your 
                <span className="text-[#0054ff]"> Dream Home</span>
                <br />
                in 15 Days
              </h1>
              <p className="text-xl text-gray-600 max-w-xl">
                Revolutionary mortgage technology that delivers one-sitting approvals, 
                zero closing costs, and the fastest close in the industry.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="text-[#0054ff]">{benefit.icon}</div>
                  <span className="text-sm font-medium text-gray-700">{benefit.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-[#0054ff] hover:bg-blue-600 text-lg px-8 py-6">
                Start Application
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                View Current Rates
              </Button>
            </div>

            <div className="text-sm text-gray-500">
              *Rate shown is Annual Percentage Rate (APR) for qualified borrowers. Your actual rate may vary based on credit score, loan amount, and other factors. NMLS #123456.
            </div>
          </div>

          {/* Right Column - Rate Calculator */}
          <div className="lg:pl-8">
            <Card className="shadow-2xl border-0 bg-white">
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Instant Rate Calculator
                    </h3>
                    <p className="text-gray-600">
                      See your estimated monthly payment in seconds
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Home Value
                      </label>
                      <Input
                        type="text"
                        placeholder="$500,000"
                        value={homeValue}
                        onChange={(e) => setHomeValue(e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Loan Amount
                      </label>
                      <Input
                        type="text"
                        placeholder="$400,000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP Code
                      </label>
                      <Input
                        type="text"
                        placeholder="90210"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="text-lg"
                      />
                    </div>

                    <Button 
                      onClick={calculatePayment}
                      className="w-full bg-[#0054ff] hover:bg-blue-600 text-lg py-6"
                    >
                      Calculate Payment
                    </Button>

                    {estimatedPayment && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <div className="text-sm text-green-600 font-medium">Estimated Monthly Payment</div>
                        <div className="text-3xl font-bold text-green-700">
                          ${estimatedPayment.toLocaleString()}
                        </div>
                        <div className="text-xs text-green-600 mt-1">
                          *Principal & Interest only. Excludes taxes, insurance, and HOA.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <div className="text-xs text-gray-500">
                      Secure SSL Encryption • No Impact to Credit Score
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
