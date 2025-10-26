import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { Artwork, Post, Tutorial, User, GeneratedImage } from '@/app/types/page';

// Fetcher functions
const fetchers = {
  artworks: () => apiClient.getArtworks(),
  posts: () => apiClient.getPosts(),
  tutorials: () => apiClient.getTutorials(),
  artworkById: (id: string) => apiClient.getArtworkById(id),
  postById: (id: string) => apiClient.getPostById(id),
  tutorialById: (id: string) => apiClient.getTutorialById(id),
  userById: (id: string) => apiClient.getUserById(id),
  aiImages: () => apiClient.getOwnAIImages(),
  publicAiImages: () => apiClient.getPublicAIImages(),
  aiImageById: (id: string) => apiClient.getGeneratedImageById(id),
};

// Global SWR config
export const swrConfig = {
  revalidateOnFocus: true,
  revalidateOnReconnect: true,
  dedupingInterval: 2000, // 2 seconds
  focusThrottleInterval: 5000, // 5 seconds
};

// List hooks
export function useArtworks() {
  const { data, error, isLoading, mutate } = useSWR<Artwork[]>(
    '/api/artwork',
    fetchers.artworks,
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

export function usePosts() {
  const { data, error, isLoading, mutate } = useSWR<Post[]>(
    '/api/post',
    fetchers.posts,
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

export function useTutorials() {
  const { data, error, isLoading, mutate } = useSWR<Tutorial[]>(
    '/api/tutorial',
    fetchers.tutorials,
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

export function useAIImages() {
  const { data, error, isLoading, mutate } = useSWR<GeneratedImage[]>(
    '/api/ai-images',
    fetchers.aiImages,
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

export function usePublicAIImages() {
  const { data, error, isLoading, mutate } = useSWR<GeneratedImage[]>(
    '/api/ai-images/public',
    fetchers.publicAiImages,
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

// Detail hooks
export function useArtwork(id: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR<Artwork>(
    id ? `/api/artwork/${id}` : null,
    () => fetchers.artworkById(id!),
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

export function usePost(id: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR<Post>(
    id ? `/api/post/${id}` : null,
    () => fetchers.postById(id!),
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

export function useTutorial(id: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR<Tutorial>(
    id ? `/api/tutorial/${id}` : null,
    () => fetchers.tutorialById(id!),
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

export function useUser(id: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR<User>(
    id ? `/api/users/${id}` : null,
    () => fetchers.userById(id!),
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

export function useAIImage(id: string | null | undefined) {
  const { data, error, isLoading, mutate } = useSWR<GeneratedImage>(
    id ? `/api/ai-images/${id}` : null,
    () => fetchers.aiImageById(id!),
    swrConfig
  );
  return { data, error, isLoading, mutate };
}

