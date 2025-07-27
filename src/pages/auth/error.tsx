import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import AuthLayout from '@/components/layouts/AuthLayout';

type ErrorType = 'Configuration' | 'AccessDenied' | 'Verification' | 'Default';

const errorMessages: Record<ErrorType, { title: string; description: string }> = {
  Configuration: {
    title: 'Server error',
    description: 'There is a problem with the server configuration.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in.',
  },
  Verification: {
    title: 'Unable to sign in',
    description: 'The sign in link is no longer valid. It may have been used already or it may have expired.',
  },
  Default: {
    title: 'Error',
    description: 'An error occurred during sign in.',
  },
};

export default function AuthError() {
  const router = useRouter();
  const { error } = router.query;
  
  // Default to 'Default' if error is not a valid ErrorType
  const errorType = error as ErrorType in errorMessages 
    ? error as ErrorType 
    : 'Default';
  
  const { title, description } = errorMessages[errorType];

  return (
    <AuthLayout title={title}>
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="mt-2">
            {description}
          </AlertDescription>
        </Alert>

        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go back
          </Button>
        </div>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Need help?{' '}
            <Link 
              href="/contact" 
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}
