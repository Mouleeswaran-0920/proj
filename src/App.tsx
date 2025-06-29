import React, { useState, useEffect, useMemo } from 'react';
import { Zap } from 'lucide-react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { NewsCard } from './components/NewsCard';
import { ArticleModal } from './components/ArticleModal';
import { LoadingSpinner, NewsCardSkeleton } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { useNews } from './hooks/useNews';
import { NewsArticle, SearchFilters, TECH_CATEGORIES } from './types/news';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'publishedAt' | 'relevance'>('publishedAt');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Apply dark mode to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Construct search filters
  const filters: SearchFilters = useMemo(() => {
    const categoryData = TECH_CATEGORIES.find(cat => cat.id === selectedCategory);
    const query = categoryData?.query || 'technology';
    
    return {
      query: searchQuery.trim() || query,
      category: selectedCategory,
      sortBy,
    };
  }, [searchQuery, selectedCategory, sortBy]);

  const { articles, loading, error, totalArticles, lastFetch, isRefreshing, refetch } = useNews(filters);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(''); // Clear search when changing category
    setShowMobileFilters(false);
  };

  const handleSortChange = (sort: 'publishedAt' | 'relevance') => {
    setSortBy(sort);
  };

  const handleReadMore = (article: NewsArticle) => {
    setSelectedArticle(article);
  };

  const handleCloseModal = () => {
    setSelectedArticle(null);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };

  const handleRefresh = () => {
    refetch();
  };

  const getCurrentCategoryLabel = () => {
    const category = TECH_CATEGORIES.find(cat => cat.id === selectedCategory);
    return category?.label || 'All Categories';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 transition-all duration-300">
      <Header
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={lastFetch}
      />
      
      <FilterBar
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        showMobileFilters={showMobileFilters}
        onToggleMobileFilters={toggleMobileFilters}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        {!loading && !error && (
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  {searchQuery 
                    ? `Search Results for "${searchQuery}"` 
                    : `${getCurrentCategoryLabel()} News`
                  }
                </h2>
                <p className="text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                  <span>
                    {totalArticles > 0 
                      ? `${totalArticles} articles found` 
                      : 'Stay updated with the latest technology trends'
                    }
                  </span>
                  {totalArticles > 0 && (
                    <>
                      <span>•</span>
                      <span className="text-sm">Updated continuously</span>
                    </>
                  )}
                </p>
              </div>
              
              {/* Live indicator */}
              <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-medium text-green-700 dark:text-green-400">Live Updates</span>
                </div>
                {lastFetch && (
                  <div className="hidden sm:flex items-center space-x-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full">
                    <span className="text-xs">Last updated:</span>
                    <span className="text-xs font-medium">
                      {new Date(lastFetch).toLocaleTimeString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !isRefreshing && (
          <div>
            <div className="hidden md:block">
              <LoadingSpinner />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:hidden">
              {Array.from({ length: 6 }).map((_, index) => (
                <NewsCardSkeleton key={index} />
              ))}
            </div>
          </div>
        )}

        {/* Refreshing Indicator */}
        {isRefreshing && articles.length > 0 && (
          <div className="mb-6 flex items-center justify-center">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2 flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                Refreshing latest news...
              </span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorMessage message={error} onRetry={refetch} />
        )}

        {/* News Grid */}
        {!loading && !error && articles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {articles.map((article, index) => (
              <NewsCard
                key={`${article.url}-${index}`}
                article={article}
                onReadMore={handleReadMore}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="text-gray-400 dark:text-gray-600 mb-6">
                <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                No articles found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Try adjusting your search terms or selecting a different category. We're constantly updating our news feed.
              </p>
              <button
                onClick={refetch}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Refresh News
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Article Modal */}
      <ArticleModal
        article={selectedArticle}
        onClose={handleCloseModal}
      />

      {/* Enhanced Footer */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-2 rounded-xl">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Trendify
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                Your gateway to curated, real-time, and personalized tech news. Stay ahead of the tech curve with AI, ML, Web Development, Cybersecurity, and more.
              </p>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Live updates • Real-time news</span>
              </div>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Artificial Intelligence</li>
                <li>Web Development</li>
                <li>Cybersecurity</li>
                <li>Blockchain & Crypto</li>
                <li>Cloud Computing</li>
              </ul>
            </div>

            {/* Features */}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>Real-time Updates</li>
                <li>Smart Bookmarks</li>
                <li>Dark Mode</li>
                <li>Mobile Responsive</li>
                <li>Advanced Search</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © 2024 Trendify. Made with ❤️ for the tech community.
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
              Powered by GNews API • Enhanced with AI • Built for developers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;