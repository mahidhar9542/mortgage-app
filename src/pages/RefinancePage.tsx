import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { refinanceAPI } from '@/lib/api';
import { 
  Home, 
  Calculator, 
  DollarSign, 
  Shield, 
  CheckCircle, 
  Phone, 
  ArrowRight,
  TrendingDown,
  Users,
  Award,
  Star,
  Clock,
  FileText,
  Search,
  RefreshCw,
  Zap,
  Target,
  Percent,
  Building2,
  GraduationCap,
  Heart,
  ThumbsUp,
  Mail,
  ChevronRight,
  Play,
  Quote,
  AlertCircle,
  Info,
  Loader2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';

const RefinancePage = () => {
  const { toast } = useToast();
  const [selectedRefinanceType, setSelectedRefinanceType] = useState('conventional');
  const [currentBalance, setCurrentBalance] = useState('');
  const [homeValue, setHomeValue] = useState('');
  const [currentRate, setCurrentRate] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  // Form data for submission
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    propertyAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  const refinanceProducts = [
    {
      type: 'conventional',
      name: 'Conventional Fixed Rate Refinance',
      description: 'Best for clients with good credit who prefer stable payments.',
      rate: '6.625%',
      apr: '6.625%',
      closingCosts: 'ZERO',
      features: ['No PMI with 20% equity', 'Fixed payments', 'Competitive rates']
    },
    {
      type: 'va-streamline',
      name: 'VA IRRRL',
      description: 'Best for active duty military, veterans, and surviving spouses with an existing VA mortgage.',
      rate: '6.250%',
      apr: '6.291%',
      closingCosts: 'ZERO',
      features: ['No appraisal required', 'No income verification', 'Reduced funding fee']
    },
    {
      type: 'fha-streamline',
      name: 'FHA Streamline Refinance',
      description: 'Best for clients with an existing FHA mortgage.',
      rate: '6.125%',
      apr: '6.622%',
      closingCosts: 'ZERO',
      features: ['No appraisal required', 'No income verification', 'Reduced MIP']
    },
    {
      type: 'jumbo',
      name: 'Jumbo Refinance',
      description: 'Best for clients who require a large loan that exceeds the Conventional Loan Limit.',
      rate: '6.625%',
      apr: '6.625%',
      closingCosts: 'ZERO',
      features: ['Loan amounts up to $3M', 'Competitive rates', 'Fast approval']
    }
  ];

  const selectedProduct = refinanceProducts.find(product => product.type === selectedRefinanceType);

  const processSteps = [
    {
      step: 1,
      title: 'Apply online',
      description: 'Our expert team of loan consultants will receive your application and contact you to discuss loan terms.',
      icon: FileText
    },
    {
      step: 2,
      title: 'Lock your rate',
      description: 'Lock your rate once you are happy with your loan terms. Our team will work with you to schedule a closing date.',
      icon: Shield
    },
    {
      step: 3,
      title: 'Finalize approval',
      description: 'Our underwriting team will verify your information and eligibility.',
      icon: CheckCircle
    },
    {
      step: 4,
      title: 'Sign',
      description: 'Sign your closing documents and celebrate your ZERO Closing Cost savings!',
      icon: Award
    }
  ];

  const benefits = [
    {
      title: 'Unbelievable savings',
      description: 'Most lenders charge closing costs between 1-3% of your loan amount. We offer ZERO Closing Costs.',
      icon: DollarSign
    },
    {
      title: 'Competitive interest rates',
      description: 'We price our interest rates to compete with prevailing market interest rates.',
      icon: TrendingDown
    },
    {
      title: 'Expert service',
      description: 'Our team is committed to helping you reach your financial goals according to your timeline.',
      icon: Users
    },
    {
      title: 'Transparent pricing',
      description: 'Our website pricing is real-time, accurate, and customized to your unique loan scenario.',
      icon: Target
    }
  ];

  const testimonials = [
    {
      name: 'Janice W.',
      text: 'I have refinanced my mortgage twice now with MortgagePro. I highly recommend them. The process is easy and you can\'t beat zero closing costs.',
      rating: 5,
      savings: '$3,700'
    },
    {
      name: 'Nicole H.',
      text: 'MortgagePro stays true to its Zero claim. I refinanced and had a great experience from start to finish. Friendly, knowledgeable staff.',
      rating: 5,
      savings: '$4,200'
    },
    {
      name: 'JP',
      text: 'MortgagePro is such a pleasure to work with. They made my refinance process simple efficient and found me a fantastic rate.',
      rating: 5,
      savings: '$5,100'
    }
  ];

  const faqs = [
    {
      question: 'What closing costs will I pay when refinancing my home?',
      answer: 'You will pay ZERO closing costs with MortgagePro (restrictions apply). Most lenders charge between 1-3% of your loan amount to refinance.'
    },
    {
      question: 'When should I refinance my mortgage?',
      answer: 'When to refinance depends on your motivation. If your goal is to save money, wait until interest rates are lower than your current rate. For paying off faster, consider shorter-term loans. For cash needs, consider cash-out refinance.'
    },
    {
      question: 'Can I remove private mortgage insurance (PMI) when I refinance?',
      answer: 'FHA loans always require mortgage insurance, but you might be able to drop PMI when refinancing into a Conventional mortgage if you have 20% equity.'
    },
    {
      question: 'How long does it take to refinance my mortgage?',
      answer: 'Most refinances can be processed within 30 days at MortgagePro; however, certain complex situations can extend this timeline up to 45 days.'
    }
  ];

  const calculateSavings = () => {
    if (!currentBalance || !currentRate || !monthlyPayment) return null;
    
    const currentMonthly = parseFloat(monthlyPayment);
    const newRate = parseFloat(selectedProduct?.rate || '0') / 100;
    const currentRateDecimal = parseFloat(currentRate) / 100;
    const balance = parseFloat(currentBalance);
    const term = 30; // 30-year term
    
    const newMonthly = (balance * newRate / 12 * Math.pow(1 + newRate / 12, term * 12)) / 
                      (Math.pow(1 + newRate / 12, term * 12) - 1);
    
    const monthlySavings = currentMonthly - newMonthly;
    const annualSavings = monthlySavings * 12;
    
    return {
      monthlySavings: Math.abs(monthlySavings),
      annualSavings: Math.abs(annualSavings),
      totalSavings: Math.abs(annualSavings * 30)
    };
  };

  const savings = calculateSavings();

  const handleRateAlertSubscription = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubscribing(true);
    try {
      await refinanceAPI.subscribeToRateAlerts(email);
      toast({
        title: "Success!",
        description: "You've been subscribed to rate alerts. We'll notify you when rates drop!",
      });
      setEmail('');
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Unable to subscribe to rate alerts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleRefinanceSubmission = async () => {
    if (!currentBalance || !currentRate || !selectedRefinanceType) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const submissionData = {
        currentBalance: parseFloat(currentBalance),
        currentRate: parseFloat(currentRate),
        currentMonthlyPayment: parseFloat(monthlyPayment || '0'),
        refinanceType: selectedRefinanceType,
        estimatedSavings: savings?.annualSavings || 0,
        // Add basic contact info (in a real app, you'd have a form for this)
        firstName: 'Refinance',
        lastName: 'Applicant',
        email: 'refinance@example.com',
        phone: '555-1234',
        propertyAddress: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345'
        }
      };

      await refinanceAPI.submitRefinance(submissionData);
      
      toast({
        title: "Application submitted!",
        description: "Your refinance application has been submitted. We'll contact you within 24 hours.",
      });

      // Reset form
      setCurrentBalance('');
      setCurrentRate('');
      setMonthlyPayment('');
      setHomeValue('');
      
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Unable to submit your application. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div
          className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-30`}
        ></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="secondary" className="mb-6 bg-white/20 text-white border-white/30">
              <Zap className="w-4 h-4 mr-2" />
              ZERO Closing Costs
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Refinance your home with{' '}
              <span className="text-yellow-400">ZERO Closing Costs</span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-blue-100 leading-relaxed">
              Get a great rate and save thousands when you refinance your home with MortgagePro. 
              Join 60,000+ homeowners who have saved money since 1996.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/apply/refinance">
                <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 text-lg px-8 py-6 h-auto">
                  Apply now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-6 h-auto"
                onClick={handleRefinanceSubmission}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 w-5 h-5" />
                    Free quote
                  </>
                )}
              </Button>
            </div>

            {/* Success Numbers */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">$3.7k</div>
                <p className="text-blue-200 text-sm">Average refinance savings*</p>
          </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">60k</div>
                <p className="text-blue-200 text-sm">Homeowners served</p>
        </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">95%</div>
                <p className="text-blue-200 text-sm">Would recommend</p>
                </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">4.8</div>
                <p className="text-blue-200 text-sm">Star online reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Refinance Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">
              What is a home refinance?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Refinancing your home involves replacing your existing mortgage with a new mortgage, 
              typically at a lower interest rate. Most people seek a refinance to lower their monthly 
              payment; however, there are many reasons that people refinance their home such as 
              shortening their term, taking out cash to fund a major expense, or to transfer ownership 
              of a property.
            </p>
          </div>
        </div>
      </section>

      {/* Why Refinance Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why should I refinance with MortgagePro?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our expert team has helped homeowners save money since 1996
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                    <benefit.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our experts will guide you through every step of your refinance
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={step.step} className="relative">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                    <step.icon className="w-10 h-10 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-blue-900 font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
                
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-300 transform translate-x-4">
                    <div className="w-full h-full bg-blue-600 animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Refinance Products */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our expert loan team will help you choose the right refinance product
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Selection - Sticky */}
            <div className="space-y-8 lg:sticky lg:top-8 lg:self-start">
              <div>
                <Label className="text-lg font-semibold mb-4 block">Refinance Option</Label>
              <Select value={selectedRefinanceType} onValueChange={setSelectedRefinanceType}>
                  <SelectTrigger className="h-14 text-lg">
                  <SelectValue placeholder="Select refinance type" />
                </SelectTrigger>
                <SelectContent>
                    {refinanceProducts.map((product) => (
                      <SelectItem key={product.type} value={product.type}>
                        {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
              
              {selectedProduct && (
                <Card className="border-0 shadow-xl">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-t-lg">
                    <CardTitle className="text-2xl text-blue-900">{selectedProduct.name}</CardTitle>
                    <p className="text-blue-700">{selectedProduct.description}</p>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Label className="text-sm text-gray-600 mb-2 block">Today's Rate</Label>
                        <div className="text-3xl font-bold text-blue-600">{selectedProduct.rate}</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Label className="text-sm text-gray-600 mb-2 block">APR</Label>
                        <div className="text-3xl font-bold text-blue-600">{selectedProduct.apr}</div>
                      </div>
                    </div>
                    
                    <div className="text-center p-6 bg-green-50 rounded-lg mb-6">
                      <Label className="text-sm text-gray-600 mb-2 block">Closing Costs</Label>
                      <div className="text-2xl font-bold text-green-600">{selectedProduct.closingCosts}</div>
                      </div>
                    
                    <div className="space-y-3 mb-8">
                      {selectedProduct.features.map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                      </div>
                      ))}
                    </div>
                    
                    <Link to={`/apply/refinance?type=${selectedRefinanceType}&rate=${selectedProduct.rate}&apr=${selectedProduct.apr}`}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6 h-auto">
                        Apply Now
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
            
            {/* Refinance Calculator */}
            <div className="space-y-8">
              <Card className="border-0 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100 rounded-t-lg">
                  <CardTitle className="text-2xl text-green-900 flex items-center">
                    <Calculator className="mr-3 w-6 h-6" />
                    Refinance Savings Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="space-y-6">
                  <div>
                      <Label htmlFor="currentBalance" className="text-sm font-medium">Current Loan Balance</Label>
                    <Input
                      id="currentBalance"
                      type="number"
                        placeholder="$300,000"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(e.target.value)}
                        className="h-12 text-lg"
                    />
                  </div>
                    
                  <div>
                      <Label htmlFor="homeValue" className="text-sm font-medium">Current Home Value</Label>
                    <Input
                      id="homeValue"
                      type="number"
                        placeholder="$400,000"
                      value={homeValue}
                      onChange={(e) => setHomeValue(e.target.value)}
                        className="h-12 text-lg"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="currentRate" className="text-sm font-medium">Current Interest Rate (%)</Label>
                      <Input
                        id="currentRate"
                        type="number"
                        placeholder="7.5"
                        value={currentRate}
                        onChange={(e) => setCurrentRate(e.target.value)}
                        className="h-12 text-lg"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="monthlyPayment" className="text-sm font-medium">Current Monthly Payment</Label>
                      <Input
                        id="monthlyPayment"
                        type="number"
                        placeholder="$2,100"
                        value={monthlyPayment}
                        onChange={(e) => setMonthlyPayment(e.target.value)}
                        className="h-12 text-lg"
                    />
                  </div>
                    
                    {savings && (
                      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-4 flex items-center">
                          <Target className="mr-2 w-5 h-5" />
                          Your Potential Savings
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Monthly Savings:</span>
                            <span className="text-2xl font-bold text-green-600">${savings.monthlySavings.toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Annual Savings:</span>
                            <span className="text-2xl font-bold text-green-600">${savings.annualSavings.toFixed(0)}</span>
                          </div>
                          <div className="flex justify-between items-center border-t pt-3">
                            <span className="text-gray-700 font-semibold">30-Year Total Savings:</span>
                            <span className="text-2xl font-bold text-green-600">${savings.totalSavings.toFixed(0)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                  {currentBalance && homeValue && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-4">Your Equity Analysis</h4>
                        <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Current LTV:</span>
                            <span className="font-semibold">{((parseFloat(currentBalance) / parseFloat(homeValue)) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Available Equity:</span>
                            <span className="font-semibold text-green-600">${(parseFloat(homeValue) - parseFloat(currentBalance)).toLocaleString()}</span>
                        </div>
                          <div className="flex justify-between font-semibold text-green-600">
                          <span>Closing Costs:</span>
                            <span>ZERO</span>
                          </div>
                        </div>
                      </div>
                    )}
                    </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Alerts */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Get notified when rates drop!</h2>
          <p className="text-xl mb-8 text-blue-100">
            Receive weekly rate updates and get special notifications when rates fall.
          </p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-lg bg-white/10 border-white/20 text-white placeholder:text-blue-200"
              />
              <Button 
                className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 h-12 px-6"
                onClick={handleRateAlertSubscription}
                disabled={isSubscribing}
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Reviews from our refinance clients
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic text-lg">"{testimonial.text}"</p>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
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

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently asked questions when refinancing
            </h2>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Info className="mr-3 w-5 h-5 text-blue-600" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join 60,000+ homeowners that have saved thousands with MortgagePro.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/apply/refinance">
              <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300 text-lg px-8 py-6 h-auto">
                Apply now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 text-lg px-8 py-6 h-auto">
              <Phone className="mr-2 w-5 h-5" />
              Speak to an expert
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RefinancePage; 