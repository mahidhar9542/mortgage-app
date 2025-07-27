import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import AuthLayout from '@/components/layouts/AuthLayout';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  // Verify token on component mount
  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`/api/auth/verify-reset-token?token=${token}`);
      if (!response.ok) {
        throw new Error('Invalid or expired token');
      }
      setIsValidToken(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid or expired token');
      setIsValidToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isValidToken === null) {
    return (
      <AuthLayout title="Verifying token...">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      </AuthLayout>
    );
  }

  if (!isValidToken) {
    return (
      <AuthLayout 
        title="Invalid or expired link"
        description="The password reset link is invalid or has expired. Please request a new one."
      >
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'This link is no longer valid.'}</AlertDescription>
        </Alert>
        <div className="mt-6">
          <Button
            onClick={() => router.push('/auth/forgot-password')}
            className="w-full"
          >
            Request a new reset link
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          <Link 
            href="/auth/signin" 
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Back to sign in
          </Link>
        </div>
      </AuthLayout>
    );
  }

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password updated"
        description="Your password has been successfully updated."
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" aria-hidden="true" />
          </div>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Password updated!</h3>
          <p className="mt-1 text-sm text-gray-500">
            You can now sign in with your new password.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => router.push('/auth/signin')}
              className="w-full"
            >
              Back to sign in
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create new password"
      description="Please enter your new password below."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password
          </Label>
          <div className="mt-1">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Must be at least 8 characters long
          </p>
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm New Password
          </Label>
          <div className="mt-1">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update password'
            )}
          </Button>
        </div>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link 
          href="/auth/signin" 
          className="font-medium text-primary-600 hover:text-primary-500 flex items-center justify-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}
