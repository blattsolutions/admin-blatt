import useSWR from 'swr';
import {useMemo} from 'react';

import {fetcher, endpoints} from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetPosts(page, sortBy, filters, search) {
  const URL = `${endpoints.post.list}?page=${page}&sort=${sortBy}&status=${filters?.publish}&search=${search}`;
  const {data, isLoading, error, isValidating} = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      posts: data?.data || [],
      postsLoading: isLoading,
      postsError: error,
      postsValidating: isValidating,
      postsEmpty: !isLoading && !data?.posts?.length,
    }),
    [data?.data, data?.posts?.length, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetPost(title, id) {
  const URL = title ? `${endpoints.post.details}?id=${id}` : '';
  const {data, isLoading, error, isValidating} = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      post: data?.data,
      postLoading: isLoading,
      postError: error,
      postValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetLatestPosts(title) {
  const URL = title ? [endpoints.post.latest, {params: {title}}] : '';

  const {data, isLoading, error, isValidating} = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      latestPosts: data?.latestPosts || [],
      latestPostsLoading: isLoading,
      latestPostsError: error,
      latestPostsValidating: isValidating,
      latestPostsEmpty: !isLoading && !data?.latestPosts.length,
    }),
    [data?.latestPosts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useSearchPosts(query) {
  const URL = query ? [endpoints.post.search, {params: {query}}] : '';

  const {data, isLoading, error, isValidating} = useSWR(URL, fetcher, {
    keepPreviousData: true,
  });

  const memoizedValue = useMemo(
    () => ({
      searchResults: data?.results || [],
      searchLoading: isLoading,
      searchError: error,
      searchValidating: isValidating,
      searchEmpty: !isLoading && !data?.results.length,
    }),
    [data?.results, error, isLoading, isValidating]
  );

  return memoizedValue;
}
