import { useState, useEffect, useCallback, useRef } from 'react';
import { NewsArticle, SearchFilters } from '../types/news';
import { newsAPI } from '../services/newsAPI';

export const useNews = (filters: SearchFilters) => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalArticles, setTotalArticles] = useState(0);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  const fetchNews = useCallback(async (forceRefresh = false, isManualRefresh = false) => {
    console.log('🎯 Fetching news with filters:', filters);
    console.log('🔄 Fetch options:', { forceRefresh, isManualRefresh });

    try {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      if (isManualRefresh) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      
      setError(null);
      
      let response;
      
      console.log('📊 Determining fetch strategy for category:', filters.category);
      
      if (filters.category === 'all') {
        console.log('📈 Fetching top headlines');
        response = await newsAPI.getTopHeadlines();
      } else if (filters.query.trim()) {
        console.log('🔍 Searching with query:', filters.query);
        response = await newsAPI.searchNews(filters);
      } else {
        console.log('🏷️ Fetching by category:', filters.category);
        response = await newsAPI.getNewsByCategory(filters.category);
      }
      
      console.log('📦 Raw response received:', response);
      
      // Filter out articles with missing essential data
      const validArticles = response.articles.filter(article => {
        const isValid = article.title && 
          article.description && 
          article.url &&
          article.source?.name;
        
        if (!isValid) {
          console.log('❌ Invalid article filtered out in useNews:', article);
        }
        
        return isValid;
      });

      console.log('✅ Valid articles after filtering:', validArticles.length);

      // Remove duplicates based on URL
      const uniqueArticles = validArticles.filter((article, index, self) => {
        const isDuplicate = index !== self.findIndex(a => a.url === article.url);
        if (isDuplicate) {
          console.log('🔄 Duplicate article removed:', article.title);
        }
        return !isDuplicate;
      });

      console.log('🎯 Final unique articles:', uniqueArticles.length);
      console.log('📰 Articles data:', uniqueArticles);

      setArticles(uniqueArticles);
      setTotalArticles(uniqueArticles.length);
      setLastFetch(new Date());
      retryCountRef.current = 0; // Reset retry count on success
      
      console.log('✅ State updated successfully:', {
        articlesCount: uniqueArticles.length,
        totalArticles: uniqueArticles.length,
        lastFetch: new Date()
      });
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('🚫 Request was cancelled');
        return; // Request was cancelled, don't update state
      }

      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news. Please try again later.';
      console.error('🔥 Error in fetchNews:', err);
      console.error('📝 Error message:', errorMessage);
      
      setError(errorMessage);

      // Implement exponential backoff retry
      if (retryCountRef.current < 3) {
        retryCountRef.current++;
        const retryDelay = Math.pow(2, retryCountRef.current) * 1000; // 2s, 4s, 8s
        console.log(`🔄 Retrying in ${retryDelay}ms (attempt ${retryCountRef.current}/3)`);
        setTimeout(() => {
          fetchNews(forceRefresh, isManualRefresh);
        }, retryDelay);
      } else {
        console.log('❌ Max retries reached, giving up');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [filters.query, filters.category, filters.sortBy, filters.from, filters.to]);

  // Auto-refresh on filter changes
  useEffect(() => {
    console.log('🎯 Filters changed, fetching news:', filters);
    fetchNews();
    
    // Cleanup function to abort request on unmount or filter change
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchNews]);

  // Auto-refresh on page visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && lastFetch) {
        const timeSinceLastFetch = Date.now() - lastFetch.getTime();
        console.log('👁️ Page became visible, time since last fetch:', timeSinceLastFetch);
        if (timeSinceLastFetch > 5 * 60 * 1000) { // 5 minutes
          console.log('🔄 Auto-refreshing due to page visibility');
          fetchNews(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [lastFetch, fetchNews]);

  // Auto-refresh every 10 minutes when tab is active
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        console.log('⏰ Auto-refresh interval triggered');
        fetchNews(true);
      }
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchNews]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const refetch = useCallback(() => {
    console.log('🔄 Manual refetch triggered');
    fetchNews(true, true);
  }, [fetchNews]);

  return { 
    articles, 
    loading, 
    error, 
    totalArticles, 
    lastFetch,
    isRefreshing,
    refetch 
  };
};