
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import TrustIndicators from '@/components/TrustIndicators';
import ProcessFlow from '@/components/ProcessFlow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, Shield, Phone, Star, ArrowRight, Zap, Users, Award } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "AI-Powered Underwriting",
      description: "Advanced algorithms provide instant pre-approval decisions with 99.2% accuracy"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Bank-Level Security",
      description: "256-bit SSL encryption and SOC 2 Type II compliance protect your data"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Dedicated Support",
      description: "Licensed loan officers available 7 days a week via phone, chat, or email"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Industry Recognition",
      description: "Winner of 2024 Mortgage Technology Award for Digital Innovation"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Los Angeles, CA",
      text: "Closed in 12 days with zero fees. The entire process was transparent and stress-free. Highly recommend!",
      rating: 5,
      savings: "$8,500"
    },
    {
      name: "Michael Chen",
      location: "San Francisco, CA", 
      text: "Their technology is incredible. I was approved in minutes and the loan officer was always available to help.",
      rating: 5,
      savings: "$12,200"
    },
    {
      name: "Emily Rodriguez",
      location: "Austin, TX",
      text: "As a first-time buyer, they made everything simple. The app guided me through each step perfectly.",
      rating: 5,
      savings: "$6,800"
    }
  ];

  const loanProducts = [
    {
      title: "Conventional Loans",
      rate: "6.25%",
      features: ["Down payment as low as 3%", "Loan amounts up to $766,550", "Fixed and ARM options"]
    },
    {
      title: "FHA Loans", 
      rate: "6.50%",
      features: ["Down payment as low as 3.5%", "Credit scores from 580", "Gift funds allowed"]
    },
    {
      title: "VA Loans",
      rate: "6.00%",
      features: ["$0 down payment", "No PMI required", "Exclusive to veterans"]
    },
    {
      title: "Jumbo Loans",
      rate: "6.75%",
      features: ["Loan amounts up to $3M", "Competitive rates", "Fast approval process"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <TrustIndicators />
      <ProcessFlow />
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Advanced Technology Meets Personal Service
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the perfect blend of cutting-edge mortgage technology and human expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <div className="text-[#0054ff]">{feature.icon}</div>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Competitive Rates for Every Need
            </h2>
            <p className="text-lg text-gray-600">
              Current rates as of {new Date().toLocaleDateString()}*
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loanProducts.map((product, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="text-center">
                  <CardTitle className="text-xl">{product.title}</CardTitle>
                  <div className="text-3xl font-bold text-[#0054ff]">{product.rate}</div>
                  <div className="text-sm text-gray-500">APR*</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-4 bg-[#0054ff] hover:bg-blue-600">
                    Get Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Real Stories from Real Customers
            </h2>
            <p className="text-lg text-gray-600">
              See why thousands choose MortgagePro for their home financing needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-sm text-gray-600">{testimonial.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-green-600 font-medium">Saved</div>
                        <div className="text-lg font-bold text-green-700">{testimonial.savings}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#0054ff] to-blue-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Experience the Future of Mortgages?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of homeowners who've saved time and money with our revolutionary platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[#0054ff] hover:bg-gray-100 text-lg px-8 py-6">
              Start Your Application
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[#0054ff] text-lg px-8 py-6">
              Speak with an Expert
            </Button>
          </div>
          <div className="mt-6 text-blue-100 text-sm">
            Get pre-approved in minutes • No impact to credit score • FDIC Insured
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-[#0054ff] mb-4">MortgagePro</h3>
              <p className="text-gray-400 mb-4">
                Revolutionizing home financing with technology and exceptional service.
              </p>
              <div className="text-sm text-gray-500">
                NMLS #123456 | Equal Housing Lender
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Loan Products</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Purchase Loans</li>
                <li>Refinancing</li>
                <li>Cash-Out Refinance</li>
                <li>Home Equity Lines</li>
                <li>Jumbo Loans</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Mortgage Calculator</li>
                <li>Learning Center</li>
                <li>Current Rates</li>
                <li>Pre-Qualification</li>
                <li>Mortgage Guides</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Press</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                &copy; 2024 MortgagePro. All rights reserved. Equal Housing Lender.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white text-sm">Terms</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white text-sm">Licensing</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
