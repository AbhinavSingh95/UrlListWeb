import { atom, computed } from 'nanostores';
import type { UrlList, Url } from '../lib/db.js';

// URL Lists store
export const urlLists = atom<UrlList[]>([]);
export const selectedList = atom<UrlList | null>(null);
export const isLoading = atom<boolean>(false);
export const error = atom<string | null>(null);

// URLs store
export const urls = atom<Url[]>([]);
export const urlsLoading = atom<boolean>(false);
export const urlsError = atom<string | null>(null);

// Computed stores
export const publishedLists = computed(urlLists, (lists) => 
  lists.filter(list => list.is_published)
);

export const unpublishedLists = computed(urlLists, (lists) => 
  lists.filter(list => !list.is_published)
);

export const sortedUrls = computed(urls, (urlList) => 
  [...urlList].sort((a, b) => a.position - b.position)
);

// Actions
export const setUrlLists = (lists: UrlList[]) => {
  urlLists.set(lists);
};

export const addUrlList = (list: UrlList) => {
  urlLists.set([list, ...urlLists.get()]);
};

export const updateUrlList = (updatedList: UrlList) => {
  const lists = urlLists.get();
  const index = lists.findIndex(list => list.id === updatedList.id);
  if (index !== -1) {
    lists[index] = updatedList;
    urlLists.set([...lists]);
  }
  
  // Update selected list if it's the same one
  if (selectedList.get()?.id === updatedList.id) {
    selectedList.set(updatedList);
  }
};

export const removeUrlList = (id: string) => {
  urlLists.set(urlLists.get().filter(list => list.id !== id));
  
  // Clear selected list if it was deleted
  if (selectedList.get()?.id === id) {
    selectedList.set(null);
  }
};

export const setUrls = (urlList: Url[]) => {
  urls.set(urlList);
};

export const addUrl = (url: Url) => {
  urls.set([...urls.get(), url]);
};

export const updateUrl = (updatedUrl: Url) => {
  const urlList = urls.get();
  const index = urlList.findIndex(url => url.id === updatedUrl.id);
  if (index !== -1) {
    urlList[index] = updatedUrl;
    urls.set([...urlList]);
  }
};

export const removeUrl = (id: string) => {
  urls.set(urls.get().filter(url => url.id !== id));
};

export const setLoading = (loading: boolean) => {
  isLoading.set(loading);
};

export const setError = (errorMsg: string | null) => {
  error.set(errorMsg);
};

export const setUrlsLoading = (loading: boolean) => {
  urlsLoading.set(loading);
};

export const setUrlsError = (errorMsg: string | null) => {
  urlsError.set(errorMsg);
};
