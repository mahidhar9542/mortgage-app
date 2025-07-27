import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layouts/MainLayout';

export default function ThankYou() {
  return (
    <MainLayout 
      title="Thank You | Quick Close Mortgage"
      description="Thank you for your application. We'll be in touch soon!"
    >
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" aria-hidden="true" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Thank you for your application!
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            We've received your information and a loan officer will contact you shortly to discuss your options.
          </p>
          <div className="mt-10 flex justify-center">
            <Button
              onClick={() => window.location.href = '/'}
              className="rounded-md bg-primary px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
