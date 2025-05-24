import React from 'react';
import UrlListGrid from './UrlListGrid';
import type { UrlList } from '../lib/db';

interface Props {
  urlLists: UrlList[];
}

export default function DashboardGrid({ urlLists }: Props) {
  const handlePublish = async (urlList: UrlList, published: boolean) => {
    try {
      const response = await fetch(`/api/lists/${urlList.id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published }),
      });

      if (!response.ok) {
        throw new Error('Failed to update publish status');
      }

      // Reload the page to show updated status
      window.location.reload();
    } catch (error) {
      alert('Error updating publish status: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleDelete = async (urlList: UrlList) => {
    if (!confirm('Are you sure you want to delete this URL list? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/lists/${urlList.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete list');
      }

      // Reload the page to show updated list
      window.location.reload();
    } catch (error) {
      alert('Error deleting list: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleEdit = (urlList: UrlList) => {
    window.location.href = `/lists/${urlList.id}`;
  };

  return (
    <UrlListGrid
      urlLists={urlLists}
      showActions={true}
      onPublish={handlePublish}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
