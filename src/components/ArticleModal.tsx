import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { X, ExternalLink, Clock, Share2, Twitter, Linkedin } from 'lucide-react';
import { NewsArticle } from '../types/news';

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  if (!article) return null;

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true });

  const handleShare = (platform: 'twitter' | 'linkedin') => {
    const text = `Check out this article: ${article.title}`;
    const url = article.url;
    
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {article.source.name}
                </span>
                <span className="text-gray-300 dark:text-gray-600">•</span>
                <div className="flex items-center space-x-1 text-gray-500 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{timeAgo}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Share Buttons */}
                <button
                  onClick={() => handleShare('twitter')}
                  className="p-2 text-gray-400 hover:text-blue-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </button>
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-4rem)]">
            {/* Featured Image */}
            {article.image && (
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  onError={handleImageError}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}

            {/* Article Content */}
            <div className="p-6 md:p-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {article.title}
              </h1>
              
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                {article.description}
              </p>

              {article.content && (
                <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {article.content}
                  </p>
                </div>
              )}

              {/* Read Full Article Button */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 hover:shadow-lg"
                >
                  <span>Read Full Article</span>
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};