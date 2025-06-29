import React from 'react';
import { Filter, Calendar, TrendingUp, Sparkles, Zap } from 'lucide-react';
import { TECH_CATEGORIES } from '../types/news';

interface FilterBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: 'publishedAt' | 'relevance';
  onSortChange: (sort: 'publishedAt' | 'relevance') => void;
  showMobileFilters: boolean;
  onToggleMobileFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  showMobileFilters,
  onToggleMobileFilters
}) => {
  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, React.ReactNode> = {
      'all': <Sparkles className="h-4 w-4" />,
      'ai': <Zap className="h-4 w-4" />,
      'webdev': <Calendar className="h-4 w-4" />,
      'mobile': <TrendingUp className="h-4 w-4" />,
      'cybersecurity': <Filter className="h-4 w-4" />,
      'cloud': <Calendar className="h-4 w-4" />,
      'blockchain': <TrendingUp className="h-4 w-4" />,
      'startup': <Sparkles className="h-4 w-4" />,
      'gadgets': <Zap className="h-4 w-4" />
    };
    return icons[categoryId] || <Calendar className="h-4 w-4" />;
  };

  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={onToggleMobileFilters}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters & Categories</span>
            <div className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {TECH_CATEGORIES.find(cat => cat.id === selectedCategory)?.label || 'All'}
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className={`${showMobileFilters ? 'block' : 'hidden'} lg:block space-y-4 lg:space-y-0`}>
          {/* Categories */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 lg:mb-0 lg:mr-6 flex items-center space-x-2">
                <Sparkles className="h-4 w-4 text-blue-600" />
                <span>Categories</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {TECH_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onCategoryChange(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm hover:shadow-md'
                    }`}
                  >
                    {getCategoryIcon(category.id)}
                    <span>{category.label}</span>
                    {selectedCategory === category.id && (
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-purple-600" />
                <span>Sort by:</span>
              </span>
              <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 shadow-inner">
                <button
                  onClick={() => onSortChange('publishedAt')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    sortBy === 'publishedAt'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md hover:shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                >
                  <Calendar className="h-4 w-4" />
                  <span>Latest</span>
                  {sortBy === 'publishedAt' && (
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </button>
                <button
                  onClick={() => onSortChange('relevance')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    sortBy === 'relevance'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md hover:shadow-lg'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-750'
                  }`}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span>Relevant</span>
                  {sortBy === 'relevance' && (
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};