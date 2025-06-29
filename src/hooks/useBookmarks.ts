import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';
import { NewsArticle } from '../types/news';
import { useAuth } from './useAuth';

type BookmarkRow = Database['public']['Tables']['bookmarks']['Row'];

export const useBookmarks = () => {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookmarkedUrls, setBookmarkedUrls] = useState<Set<string>>(new Set());

  const fetchBookmarks = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBookmarks(data || []);
      setBookmarkedUrls(new Set(data?.map(b => b.url) || []));
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addBookmark = async (article: NewsArticle) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: user.id,
          article_id: article.url, // Use URL as article ID
          title: article.title,
          description: article.description,
          url: article.url,
          image_url: article.image,
          source: article.source.name,
          published_at: article.publishedAt,
        })
        .select()
        .single();

      if (error) throw error;

      setBookmarks(prev => [data, ...prev]);
      setBookmarkedUrls(prev => new Set([...prev, article.url]));
      
      return { data, error: null };
    } catch (error) {
      console.error('Error adding bookmark:', error);
      return { data: null, error };
    }
  };

  const removeBookmark = async (articleUrl: string) => {
    if (!user) return { error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', user.id)
        .eq('url', articleUrl);

      if (error) throw error;

      setBookmarks(prev => prev.filter(b => b.url !== articleUrl));
      setBookmarkedUrls(prev => {
        const newSet = new Set(prev);
        newSet.delete(articleUrl);
        return newSet;
      });

      return { error: null };
    } catch (error) {
      console.error('Error removing bookmark:', error);
      return { error };
    }
  };

  const isBookmarked = (articleUrl: string) => {
    return bookmarkedUrls.has(articleUrl);
  };

  useEffect(() => {
    if (user) {
      fetchBookmarks();
    } else {
      setBookmarks([]);
      setBookmarkedUrls(new Set());
    }
  }, [user]);

  return {
    bookmarks,
    loading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    refetch: fetchBookmarks,
  };
};