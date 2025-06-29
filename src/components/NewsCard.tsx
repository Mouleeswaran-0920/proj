import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { ExternalLink, Clock, Bookmark, BookmarkCheck, Share2, Eye, TrendingUp } from 'lucide-react';
import { NewsArticle } from '../types/news';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuth } from '../hooks/useAuth';

interface NewsCardProps {
  article: NewsArticle;
  onReadMore: (article: NewsArticle) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, onReadMore }) => {
  const { user } = useAuth();
  const { addBookmark, removeBookmark, isBookmarked } = useBookmarks();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });
  const bookmarked = isBookmarked(article.url);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const getImageSrc = () => {
    if (imageError || !article.image) {
      return 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800';
    }
    return article.image;
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed');
      }
    } else {
      try {
        await navigator.clipboard.writeText(article.url);
        // Could add a toast notification here
        console.log('URL copied to clipboard');
      } catch (error) {
        console.error('Failed to copy URL');
      }
    }
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      // Could trigger auth modal here
      console.log('Please sign in to bookmark articles');
      return;
    }

    if (bookmarked) {
      await removeBookmark(article.url);
    } else {
      await addBookmark(article);
    }
  };

  const isRecent = () => {
    const publishedTime = new Date(article.publishedAt).getTime();
    const now = Date.now();
    const hoursDiff = (now - publishedTime) / (1000 * 60 * 60);
    return hoursDiff < 2; // Less than 2 hours old
  };

  return (
    <article className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:-translate-y-1">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer" />
        )}
        
        <img
          src={getImageSrc()}
          alt={article.title}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Recent Badge */}
        {isRecent() && (
          <div className="absolute top-3 left-3 flex items-center space-x-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>Hot</span>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleBookmark}
            className={`p-2.5 rounded-full backdrop-blur-sm hover:scale-110 transition-all duration-200 shadow-lg ${
              bookmarked 
                ? 'bg-blue-600 text-white shadow-blue-500/25' 
                : 'bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 shadow-black/10'
            }`}
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
          >
            {bookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
          </button>
          <button
            onClick={handleShare}
            className="p-2.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-800 hover:scale-110 transition-all duration-200 shadow-lg shadow-black/10"
            aria-label="Share article"
          >
            <Share2 className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6" onClick={() => onReadMore(article)}>
        {/* Source and Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-lg">
              {article.source.name}
            </span>
            <span className="text-gray-300 dark:text-gray-600">•</span>
            <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="text-xs whitespace-nowrap">{timeAgo}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 leading-tight">
          {article.title}
        </h2>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReadMore(article);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Eye className="h-4 w-4" />
            <span>Read More</span>
            <ExternalLink className="h-3 w-3" />
          </button>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs text-gray-400 dark:text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Live news" />
              <span>Live</span>
            </div>
            {isRecent() && (
              <div className="flex items-center space-x-1 text-xs text-red-500 font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>Trending</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};