import { ReactNode } from 'react';
import Head from 'next/head';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function AuthLayout({ 
  children, 
  title = 'Authentication',
  description = 'Sign in to your account'
}: AuthLayoutProps) {
  return (
    <>
      <Head>
        <title>{`${title} | Quick Close Mortgage`}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {description}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
