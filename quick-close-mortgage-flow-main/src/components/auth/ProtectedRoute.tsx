import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      // Redirect to sign-in page with callback URL
      const callbackUrl = router.asPath;
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }

    if (status === 'authenticated' && requiredRole && session?.user?.role !== requiredRole) {
      // Redirect to unauthorized page or dashboard if user doesn't have required role
      router.push('/unauthorized');
    }
  }, [status, requiredRole, router, session]);

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (status === 'authenticated' && requiredRole && session.user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
          <p>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // User is authenticated and has required role, render children
  return <>{children}</>;
}
