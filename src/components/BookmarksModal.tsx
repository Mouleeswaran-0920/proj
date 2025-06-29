import React from 'react';
import { X, ExternalLink, Clock, Trash2, BookmarkX } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useBookmarks } from '../hooks/useBookmarks';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({ isOpen, onClose }) => {
  const { bookmarks, loading, removeBookmark } = useBookmarks();

  if (!isOpen) return null;

  const handleRemoveBookmark = async (articleUrl: string) => {
    await removeBookmark(articleUrl);
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
          <div className="sticky top-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  My Bookmarks
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  {bookmarks.length} saved articles
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-5rem)]">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : bookmarks.length === 0 ? (
              <div className="text-center py-12 px-6">
                <BookmarkX className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No bookmarks yet
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Start bookmarking articles to read them later!
                </p>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                {bookmarks.map((bookmark) => (
                  <div
                    key={bookmark.id}
                    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Image */}
                      {bookmark.image_url && (
                        <div className="flex-shrink-0">
                          <img
                            src={bookmark.image_url}
                            alt={bookmark.title}
                            onError={handleImageError}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                            {bookmark.title}
                          </h3>
                          <button
                            onClick={() => handleRemoveBookmark(bookmark.url)}
                            className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 rounded transition-colors ml-2"
                            title="Remove bookmark"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {bookmark.description && (
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">
                            {bookmark.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            {bookmark.source && (
                              <span className="font-medium text-blue-600 dark:text-blue-400">
                                {bookmark.source}
                              </span>
                            )}
                            {bookmark.published_at && (
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>
                                  {formatDistanceToNow(new Date(bookmark.published_at), { addSuffix: true })}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          <a
                            href={bookmark.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <span>Read</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};