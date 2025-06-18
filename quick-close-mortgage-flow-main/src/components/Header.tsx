
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calculator, User, Menu, Phone, ChevronDown, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-[#0054ff]">MortgagePro</span>
              <span className="text-xs text-gray-500 ml-1">NMLS #123456</span>
            </Link>
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link to="/learn" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Learn
              </Link>
              <Link to="/calculator" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Calculator
              </Link>
              <Link to="/apply-now" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Apply Now
              </Link>
              <Link to="/rates" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Rates
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="hidden lg:flex items-center">
              <Calculator className="w-4 h-4 mr-2" />
              Rate Calculator
            </Button>
            <Button variant="ghost" size="sm" className="hidden md:flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              (555) 123-LOAN
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Account
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <Link to="/auth/signin">
                  <DropdownMenuItem className="cursor-pointer">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </DropdownMenuItem>
                </Link>
                <Link to="/auth/signup">
                  <DropdownMenuItem className="cursor-pointer">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Account
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/auth/signup">
              <Button size="sm" className="bg-[#0054ff] hover:bg-blue-600 text-white">
                Get Started
              </Button>
            </Link>
            
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
