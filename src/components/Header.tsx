import React, { useState } from 'react';
import { Search, Zap, Moon, Sun, LogIn, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { UserMenu } from './UserMenu';
import { AuthModal } from './AuthModal';
import { BookmarksModal } from './BookmarksModal';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: Date | null;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  darkMode,
  onToggleDarkMode,
  onRefresh,
  isRefreshing = false,
  lastUpdated
}) => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return '';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1 min ago';
    if (minutes < 60) return `${minutes} mins ago`;
    
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Trendify
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1 flex items-center space-x-1">
                  <span>Stay ahead of the curve</span>
                  {!isOnline && <WifiOff className="h-3 w-3 text-red-500" />}
                  {isOnline && <Wifi className="h-3 w-3 text-green-500" />}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-4 lg:mx-8">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 h-5 w-5 transition-colors" />
                <input
                  type="text"
                  placeholder="Search tech news, AI, blockchain, startups..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white dark:hover:bg-gray-700"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Connection Status & Refresh */}
              <div className="flex items-center space-x-2">
                {/* Online Status */}
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${
                  isOnline 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' 
                    : 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                }`}>
                  {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  <span className="hidden sm:block">{isOnline ? 'Online' : 'Offline'}</span>
                </div>

                {/* Refresh Button */}
                {onRefresh && (
                  <div className="flex flex-col items-center">
                    <button
                      onClick={onRefresh}
                      disabled={isRefreshing || !isOnline}
                      className={`p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
                        isRefreshing ? 'animate-spin' : 'hover:scale-105'
                      }`}
                      aria-label="Refresh news"
                      title={`Last updated: ${formatLastUpdated(lastUpdated)}`}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    {lastUpdated && (
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 hidden lg:block whitespace-nowrap">
                        {formatLastUpdated(lastUpdated)}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={onToggleDarkMode}
                className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Auth Section */}
              {loading ? (
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
              ) : user ? (
                <UserMenu onShowBookmarks={() => setShowBookmarksModal(true)} />
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:block">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      <BookmarksModal 
        isOpen={showBookmarksModal} 
        onClose={() => setShowBookmarksModal(false)} 
      />
    </>
  );
};