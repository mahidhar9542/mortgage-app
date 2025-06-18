
import React from 'react';
import Header from '@/components/Header';
import ApplicationWizard from '@/components/ApplicationWizard';

const Apply = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Start Your Mortgage Application
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Complete your application in just a few minutes. We'll guide you through each step 
            and help you get pre-approved quickly.
          </p>
        </div>

        <ApplicationWizard />
      </div>
    </div>
  );
};

export default Apply;
