import React, { useState, useEffect } from 'react';
import type { Url } from '../lib/db';
import { createUrlSchema, updateUrlSchema } from '../lib/utils';
import LoadingSpinner from './LoadingSpinner';
import type { z } from 'zod';

type CreateUrlData = z.infer<typeof createUrlSchema>;
type UpdateUrlData = z.infer<typeof updateUrlSchema>;

interface Props {
  listId: string;
  readOnly?: boolean;
}

export default function UrlManager({ listId, readOnly = false }: Props) {
  const [urls, setUrls] = useState<Url[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUrl, setEditingUrl] = useState<Url | null>(null);

  // Form state
  const [formData, setFormData] = useState<CreateUrlData>({
    url: '',
    title: '',
    description: '',
  });

  useEffect(() => {
    fetchUrls();
  }, [listId]);

  const fetchUrls = async () => {
    try {
      const response = await fetch(`/api/lists/${listId}/urls`);
      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }
      const fetchedUrls = await response.json();
      setUrls(fetchedUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch URLs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const validatedData = createUrlSchema.parse(formData);
      
      const response = await fetch(`/api/lists/${listId}/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add URL');
      }

      const newUrl = await response.json();
      setUrls(prev => [...prev, newUrl]);
      setFormData({ url: '', title: '', description: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add URL');
    }
  };

  const handleUpdateUrl = async (urlId: string, updateData: UpdateUrlData) => {
    setError(null);

    try {
      const validatedData = updateUrlSchema.parse(updateData);
      
      const response = await fetch(`/api/urls/${urlId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update URL');
      }

      const updatedUrl = await response.json();
      setUrls(prev => prev.map(url => url.id === urlId ? updatedUrl : url));
      setEditingUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update URL');
    }
  };

  const handleDeleteUrl = async (urlId: string) => {
    if (!confirm('Are you sure you want to delete this URL?')) return;

    setError(null);

    try {
      const response = await fetch(`/api/urls/${urlId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete URL');
      }

      setUrls(prev => prev.filter(url => url.id !== urlId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete URL');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {!readOnly && (
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">URLs ({urls.length})</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {showAddForm ? 'Cancel' : 'Add URL'}
          </button>
        </div>
      )}

      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4">Add New URL</h4>
          <form onSubmit={handleAddUrl} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                URL *
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="https://example.com"
              />
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional title for this URL"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Optional description"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add URL
              </button>
            </div>
          </form>
        </div>
      )}

      {urls.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-gray-400 text-4xl mb-3">🔗</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No URLs yet</h4>
          <p className="text-gray-500">
            {readOnly ? 'This list is empty.' : 'Start by adding your first URL to this list.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {urls.map((url, index) => (
            <UrlCard
              key={url.id}
              url={url}
              index={index + 1}
              readOnly={readOnly}
              isEditing={editingUrl?.id === url.id}
              onEdit={() => setEditingUrl(url)}
              onSave={(updateData) => handleUpdateUrl(url.id, updateData)}
              onCancel={() => setEditingUrl(null)}
              onDelete={() => handleDeleteUrl(url.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface UrlCardProps {
  url: Url;
  index: number;
  readOnly: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (data: UpdateUrlData) => void;
  onCancel: () => void;
  onDelete: () => void;
}

function UrlCard({ url, index, readOnly, isEditing, onEdit, onSave, onCancel, onDelete }: UrlCardProps) {
  const [editData, setEditData] = useState<UpdateUrlData>({
    url: url.url,
    title: url.title || '',
    description: url.description || '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editData);
  };

  if (isEditing) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
            <input
              type="url"
              value={editData.url}
              onChange={(e) => setEditData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={editData.description}
              onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-sm font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium flex items-center justify-center rounded-full">
              {index}
            </span>
            <a
              href={url.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium break-all"
            >
              {url.title || url.url}
            </a>
          </div>
          {url.title && (
            <p className="text-sm text-gray-600 mb-1 ml-9 break-all">{url.url}</p>
          )}
          {url.description && (
            <p className="text-sm text-gray-600 ml-9">{url.description}</p>
          )}
        </div>
        
        {!readOnly && (
          <div className="flex space-x-2 ml-4">
            <button
              onClick={onEdit}
              className="text-gray-400 hover:text-blue-600 p-1"
              title="Edit URL"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="text-gray-400 hover:text-red-600 p-1"
              title="Delete URL"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
