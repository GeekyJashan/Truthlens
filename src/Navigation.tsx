import React from 'react';
import { Button } from '@/components/ui/button';
import { Search, FileText, LayoutDashboard, LogOut, DollarSign, Mail, Star, Sun, Moon } from 'lucide-react';
import { User } from './types';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: 'home' | 'auth' | 'editor' | 'dashboard' | 'pricing' | 'contact' | 'features') => void;
  user: User | null;
  onSignOut: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
}
  



const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  setCurrentPage,
  user,
  onSignOut,
  isDarkMode,
  setIsDarkMode,  
}) => {
  

  return (
    <nav className="bg-background border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Search className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-xl">TruthLens</span>
          </div>
          <div className="flex items-center space-x-4">
          
          <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-10 h-10"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant={currentPage === 'home' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('home')}
            >
              Home
            </Button>
            <Button
              variant={currentPage === 'features' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('features')}
            >
              <Star className="mr-0 h-4 w-4" /> Features
            </Button>
            <Button
              variant={currentPage === 'pricing' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('pricing')}
            >
              <DollarSign className="mr-0 h-4 w-4" /> Pricing
            </Button>
            <Button
              variant={currentPage === 'contact' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('contact')}
            >
              <Mail className="mr-0 h-4 w-4" /> Contact
            </Button>
            <Button
              variant={currentPage === 'editor' ? 'default' : 'ghost'}
              onClick={() => setCurrentPage('editor')}
            >
              <FileText className="mr-0 h-4 w-4" /> Editor
            </Button>
            {user && (
              <Button
                variant={currentPage === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('dashboard')}
              >
                <LayoutDashboard className="mr-0 h-4 w-4" /> Dashboard
              </Button>
            )}
            {user ? (
              <Button variant="ghost" onClick={onSignOut}>
                <LogOut className="mr-0 h-4 w-4" /> Sign Out
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => setCurrentPage('auth')}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;