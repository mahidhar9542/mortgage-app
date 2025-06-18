import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            {[
              { name: 'Privacy', href: '/privacy' },
              { name: 'Terms', href: '/terms' },
              { name: 'Contact', href: '/contact' },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">{item.name}</span>
                {item.name}
              </Link>
            ))}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; {currentYear} Quick Close Mortgage. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
