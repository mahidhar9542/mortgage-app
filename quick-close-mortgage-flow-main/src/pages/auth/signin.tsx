import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import AuthLayout from '@/components/layouts/AuthLayout';
import { useAuth } from '@/contexts/AuthContext';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading: authLoading } = useAuth();

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      // Redirect is handled in the AuthContext
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <AuthLayout>
        <div className="flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Sign in to your account"
      description="Enter your email and password to access your account"
    >
      <div className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <div className="text-sm">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="font-medium text-primary hover:underline">
            Sign up
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-3">
          <div>
            <Button
              variant="outline"
              type="button"
              className="w-full"
              disabled={isLoading}
              onClick={() => {
                // TODO: Implement Google OAuth
                // For now, show a message
                setError('Google sign-in is not yet implemented');
              }}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <title>Google</title>
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.28426 53.749 C -8.52426 55.229 -9.42426 56.479 -10.7843 57.329 L -10.7843 60.529 L -6.82426 60.529 C -4.56426 58.499 -3.264 55.279 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.80426 62.159 -6.82426 60.529 L -10.7843 57.329 C -11.7643 57.989 -13.014 58.399 -14.754 58.399 C -17.544 58.399 -19.9643 56.569 -20.8643 54.019 L -24.9543 54.019 L -24.9543 57.269 C -22.9443 61.239 -19.194 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -20.8643 54.019 C -21.1643 53.119 -21.334 52.149 -21.334 51.149 C -21.334 50.149 -21.1643 49.179 -20.8643 48.279 L -20.8643 45.029 L -24.9543 45.029 C -26.0243 47.119 -26.664 49.539 -26.664 52.149 C -26.664 54.759 -26.0243 57.179 -24.9543 59.269 L -20.8643 54.019 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.4043 44.599 -10.0643 45.789 L -6.82426 42.599 C -8.80426 40.759 -11.514 39.739 -14.754 39.739 C -19.194 39.739 -22.9443 41.869 -24.9543 45.019 L -20.8643 48.269 C -19.9643 45.719 -17.544 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
