// lib/apiClient.ts

import { ArtworkResponse, CheckoutSessionResponse, CommentResponse, CreatePostResponse, GeneratedImage, LikeResponse, PostResponse, ToggleVisibilityResponse, TutorialResponse, uploadResp } from "@/app/types/page";
import { Artwork, Post, Tutorial, User ,GenerateAIImageResponse} from "@/app/types/page";
import { Data } from "@/app/upload/page";

type HTTPMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';


const request = async <T>(
  method: HTTPMethod,
  url: string,
  data?: unknown
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
    ...(data && method !== 'GET' ? { body: JSON.stringify(data) } : {}),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Request failed');
    }

    if (response.status === 204) return null as T;

    return response.json().catch(() => ({})) as T;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
export const apiClient = {
  // Auth
  register: (userData: User) => request<User>       ('POST', '/api/auth/register', userData),
  login:    (credentials: User) => request<User>       ('POST', '/api/auth/login', credentials),
  logout:   ()                          => request<null>       ('POST', '/api/auth/logout'),
  getCurrentUser: ()                   => request<User | null> ('GET', '/api/auth/me'),

  // User
  getUserById: (userId: string) => request<User>('GET', `/api/users/${userId}`),
  updateUser:  (userId: string, userData: Partial<User>) => request<User>('PATCH', `/api/users/${userId}`, userData),
  deleteUser:  (userId: string) => request<null>('DELETE', `/api/users/${userId}`),
  toggleFollow: (userId: string) => request<User>('POST', `/api/users/${userId}/toggle-follow`),

  // Content by user
  getArtworksByUser:  (userId: string) => request<Artwork[]> ('GET', `/api/artwork/user/${userId}`),
  getPostsByUser:     (userId: string) => request<Post[]>    ('GET', `/api/post/user/${userId}`),
  getTutorialsByUser: (userId: string) => request<Tutorial[]>('GET', `/api/tutorial/user/${userId}`),
  getAiImagesByUser:  (userId: string) => request<GeneratedImage[]> ('GET', `/api/ai-images/user/${userId}`),

  // Dynamic Content Upload/Update
  uploadFile: (data: Data, category: string) => request<uploadResp>('POST', `/api/${category}`, data),
  updateContentById: (id: string, category: string, data: Data ) =>
    request<uploadResp>('PATCH', `/api/${category}/${id}`, data),

  // Likes
  likeContent: (id: string, category: string) =>
    request<LikeResponse>('POST', `/api/like/${category}/${id}`),

  // Comments
  commentOnContent: (contentId: string, category: string, comment: string, parentId?: string) =>
    request<CommentResponse>('POST', `/api/comment/${category}/${contentId}`, { comment, parentId }),
  getComments: (category: string, id: string, page = 1, limit = 5) =>
    request<CommentResponse>('GET', `/api/comment/${category}/${id}?page=${page}&limit=${limit}`),
  updateComment: (commentId: string, category: string, content: string) =>
    request<CommentResponse>('PATCH', `/api/comment/${category}/${commentId}`, { commentId, content }),
  deleteComment: (commentId: string, category: string) =>
    request<CommentResponse>('DELETE', `/api/comment/${category}/${commentId}`, { commentId }),

  // Post
  getPosts: () => request<Post[]>('GET', '/api/post'),
  getPostById: (postId: string) => request<PostResponse>('GET', `/api/post/${postId}`),
  createPost: (postData: Post) => request<CreatePostResponse>('POST', '/api/post', postData),
  deletePost: (postId: string) => request<PostResponse>('DELETE', `/api/post/${postId}`),

  // Tutorials
  getTutorials: () => request<Tutorial[]>('GET', '/api/tutorial'),
  getTutorialById: (tutorialId: string) => request<TutorialResponse>('GET', `/api/tutorial/${tutorialId}`),
  deleteTutorial: (tutorialId: string) => request<TutorialResponse>('DELETE', `/api/tutorial/${tutorialId}`),

  // Artworks
  getArtworks: () => request<Artwork[]>('GET', '/api/artwork'),
  getArtworkById: (artworkId: string) => request<ArtworkResponse>('GET', `/api/artwork/${artworkId}`),
  buyArtworkById: (artworkId: string) => request<CheckoutSessionResponse>('POST', `/api/create-checkout-session/${artworkId}`),
  markArtworkAsSold: (artworkId: string) => request<ArtworkResponse>('PATCH', `/api/artwork/${artworkId}/mark-sold`),
  deleteArtwork: (artworkId: string) => request<ArtworkResponse>('DELETE', `/api/artwork/${artworkId}`),

  // AI Images
  generateAIImage: (prompt: string) => request<GenerateAIImageResponse>('POST', '/api/ai-images', { prompt }),
  getOwnAIImages: () => request<GeneratedImage[]>('GET', '/api/ai-images'),
  getPublicAIImages: () => request<GeneratedImage[]>('GET', '/api/ai-images/publiced'),
  toggleImageVisibility: (imageId: string, isPublic: boolean) =>
    request<ToggleVisibilityResponse>('PATCH', `/api/ai-images/${imageId}/visibility`, { isPublic }),
  getGeneratedImageById: (imageId: string) => request<GenerateAIImageResponse>('GET', `/api/ai-images/${imageId}`),
};
