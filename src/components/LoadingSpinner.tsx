import React from 'react';
import { Zap, TrendingUp, Sparkles } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-8">
        {/* Main animated logo */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 rounded-2xl shadow-2xl animate-pulse">
          <Zap className="h-10 w-10 text-white" />
        </div>
        
        {/* Floating icons */}
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 p-2 rounded-xl animate-bounce shadow-lg" style={{ animationDelay: '0.5s' }}>
          <TrendingUp className="h-4 w-4 text-white" />
        </div>
        <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-pink-500 to-rose-500 p-2 rounded-xl animate-bounce shadow-lg" style={{ animationDelay: '1s' }}>
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        
        {/* Multiple spinning rings */}
        <div className="absolute -inset-4">
          <div className="w-20 h-20 border-4 border-gray-200 dark:border-gray-700 rounded-full animate-spin">
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
          </div>
        </div>
        <div className="absolute -inset-6">
          <div className="w-24 h-24 border-2 border-gray-100 dark:border-gray-800 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}>
            <div className="absolute top-0 left-0 w-24 h-24 border-2 border-transparent border-t-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
          </div>
        </div>
      </div>
      
      <div className="text-center max-w-md">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          Loading Latest Tech News
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse leading-relaxed">
          Fetching the most recent articles from top tech sources around the world...
        </p>
      </div>
      
      {/* Enhanced progress dots */}
      <div className="flex space-x-2 mt-6">
        <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '0ms' }}></div>
        <div className="w-3 h-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '150ms' }}></div>
        <div className="w-3 h-3 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full animate-bounce shadow-lg" style={{ animationDelay: '300ms' }}></div>
      </div>

      {/* Loading stats */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-blue-600 dark:text-blue-400">50+</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Sources</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">24/7</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Updates</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">Live</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Feed</div>
        </div>
      </div>
    </div>
  );
};

export const NewsCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-video bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer relative">
        <div className="absolute top-3 right-3 flex space-x-2">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
        </div>
      </div>
      
      {/* Content skeleton */}
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg w-24 animate-shimmer" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-20 animate-shimmer" />
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full animate-shimmer" />
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-4/5 animate-shimmer" />
        </div>
        
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-full animate-shimmer" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-3/4 animate-shimmer" />
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-2/3 animate-shimmer" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl w-32 animate-shimmer" />
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded w-12 animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
};