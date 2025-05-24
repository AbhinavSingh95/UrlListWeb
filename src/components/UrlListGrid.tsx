import React from 'react';
import type { UrlList } from '../lib/db';

interface Props {
  urlLists: UrlList[];
  showActions?: boolean;
  onEdit?: (urlList: UrlList) => void;
  onDelete?: (urlList: UrlList) => void;
  onPublish?: (urlList: UrlList, published: boolean) => void;
}

export default function UrlListGrid({ 
  urlLists, 
  showActions = false, 
  onEdit, 
  onDelete, 
  onPublish 
}: Props) {
  const formatDate = (dateInput: string | Date) => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (urlLists.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No URL lists yet</h3>
        <p className="text-gray-500 mb-6">Get started by creating your first URL list</p>
        <a
          href="/create"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Create Your First List
        </a>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      role="grid"
      aria-label="URL Lists"
    >
      {urlLists.map((urlList) => (
        <article 
          key={urlList.id} 
          className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
          role="gridcell"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                <a 
                  href={`/lists/${urlList.id}`}
                  className="hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                  aria-label={`View details for ${urlList.title}`}
                >
                  {urlList.title}
                </a>
              </h3>
              {urlList.description && (
                <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                  {urlList.description}
                </p>
              )}
            </div>
            {urlList.is_published && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Published
              </span>
            )}
          </div>

          <div className="text-sm text-gray-500 space-y-1 mb-4">
            <div className="flex items-center justify-between">
              <span>Slug:</span>
              <code className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">
                {urlList.slug}
              </code>
            </div>
            <div className="flex items-center justify-between">
              <span>Created:</span>
              <span>{formatDate(urlList.created_at)}</span>
            </div>
            {urlList.updated_at !== urlList.created_at && (
              <div className="flex items-center justify-between">
                <span>Updated:</span>
                <span>{formatDate(urlList.updated_at)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <a
              href={`/lists/${urlList.id}`}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View List →
            </a>
            
            {showActions && (
              <div className="flex space-x-2" role="group" aria-label="List actions">
                {onPublish && (
                  <button
                    onClick={() => onPublish(urlList, !urlList.is_published)}
                    className={`px-3 py-1 text-xs font-medium rounded focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      urlList.is_published
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500'
                        : 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500'
                    }`}
                    aria-label={`${urlList.is_published ? 'Unpublish' : 'Publish'} ${urlList.title}`}
                  >
                    {urlList.is_published ? 'Unpublish' : 'Publish'}
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(urlList)}
                    className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    aria-label={`Edit ${urlList.title}`}
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(urlList)}
                    className="px-3 py-1 text-xs font-medium text-red-800 bg-red-100 rounded hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    aria-label={`Delete ${urlList.title}`}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
