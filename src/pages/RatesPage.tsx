import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Rates from '@/components/Rates/Rates';

const RatesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/dashboard" className="flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Current Mortgage Rates
          </h1>
          <p className="text-gray-600">
            View and compare current mortgage interest rates
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today's Mortgage Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <Rates />
          </CardContent>
        </Card>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Understanding Mortgage Rates</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">What affects mortgage rates?</h3>
              <p className="text-gray-600 text-sm">
                Mortgage rates are influenced by various factors including the Federal Reserve's monetary policy, 
                the 10-year Treasury yield, the economy's strength, inflation, and the housing market conditions.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Fixed vs. Adjustable Rates</h3>
              <p className="text-gray-600 text-sm">
                Fixed-rate mortgages keep the same interest rate for the life of the loan, while adjustable-rate 
                mortgages (ARMs) have rates that change with market conditions after an initial fixed period.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatesPage;
