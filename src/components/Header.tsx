import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Phone, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

const Header = ({ activeTab: propActiveTab, setActiveTab: propSetActiveTab }: HeaderProps) => {
  const location = useLocation();
  
  // Use internal state if props are not provided
  const [internalActiveTab, setInternalActiveTab] = useState('purchase');
  const activeTab = propActiveTab || internalActiveTab;
  const setActiveTab = propSetActiveTab || setInternalActiveTab;

  const tabs = [
    { id: 'purchase', label: 'Purchase', path: '/purchase' },
    { id: 'refinance', label: 'Refinance', path: '/refinance' },
    { id: 'equity', label: 'Home Equity', path: '/equity' }
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-[#0054ff]">MortgagePro</span>
              <span className="text-xs text-gray-500 ml-1">NMLS #123456</span>
            </Link>
          </div>
          
          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-8">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === tab.path
                    ? 'text-[#0054ff] border-b-2 border-[#0054ff]'
                    : 'text-gray-600 hover:text-[#0054ff]'
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden lg:flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              (555) 123-LOAN
            </Button>
            <Link to="/auth/signin">
              <Button variant="ghost" size="sm" className="flex items-center">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/apply">
              <Button size="sm" className="bg-[#0054ff] hover:bg-blue-600 text-white">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
