// const request = async (method: string, url: string, data?: any) => {
//   const options: RequestInit = {
//     method,
//     headers: { "Content-Type": "application/json" },
//     ...(data && method !== "GET" ? { body: JSON.stringify(data) } : {}),
//   };

//   try {
//     const response = await fetch(url, options);

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({})); // ✅ Handle empty JSON response
//       throw new Error(errorData.message || "Request failed");
//     }

//     if (response.status === 204) return null; // ✅ Handle No Content responses (like DELETE)

//     return response.json().catch(() => ({})); // ✅ Prevent JSON parse error for empty responses
//   } catch (error) {
//     console.error("API Error:", error);
//     throw error;
//   }
// };


// export const apiClient = {
//   // Authentication
//   register: async (userData: any) => request("POST", "/api/auth/register", userData),
//   login: async (credentials: any) => request("POST", "/api/auth/login", credentials),
//   logout: async () => request("POST", "/api/auth/logout"),
//   getCurrentUser: async () => request("GET", "/api/auth/me"),

//   // User Management
//   getUserById: async (userId: string) => request("GET", `/api/users/${userId}`),
//   updateUser: async (userId: string, userData: any) => request("PATCH", `/api/users/${userId}`, userData),
//   deleteUser: async (userId: string) => request("DELETE", `/api/users/${userId}`),
//   toggleFollow: async (userId: string) => request("POST", `/api/users/${userId}/toggle-follow`),

// // User-specific content
// getArtworksByUser: async (userId: string) => request("GET", `/api/artwork/user/${userId}`),
// getPostsByUser: async (userId: string) => request("GET", `/api/post/user/${userId}`),
// getTutorialsByUser: async (userId: string) => request("GET", `/api/tutorial/user/${userId}`),
// getAiImagesByUser: async (userId: string) => request("GET", `/api/ai-images/user/${userId}`),

//   // Dynamic File Upload
//   uploadFile: async (data: any, category: string) => request("POST", `/api/${category}`, data),

//   //Dynamic Update
//   updateContentById: async (id: string, category: string, data: any) => request("PATCH", `/api/${category}/${id}`, data),

//   //Dynamic Like
//   likeContent: async (id: string, category: string) => request("POST", `/api/like/${category}/${id}`),

//   //Dynamic Comment 
//   commentOnContent: async (commentId: string, category: string, comment: string, parentId?: string) =>
//     request("POST", `/api/comment/${category}/${commentId}`, { comment, parentId }),
//   getComments: async (category: string, id: string, page: number = 1, limit: number = 5) =>
//     request("GET", `/api/comment/${category}/${id}?page=${page}&limit=${limit}`),

//   getReplies: async (
//     category: string,
//     contentId: string,
//     commentId: string,
//     page = 1,
//     limit = 5
//   ) =>
//     request(
//       "GET",
//       `/api/comment/${category}/${contentId}/replies?commentId=${commentId}&page=${page}&limit=${limit}`
//     ),
//   updateComment: async (commentId: string,category: string, content: any) =>
//     request("PATCH", `/api/comment/${category}/${commentId}`, { commentId, content }),
//   deleteComment: async (commentId: string, category: string) =>
//     request("DELETE", `/api/comment/${category}/${commentId}`, { commentId }),


//   // Post
//   getPosts: async () => request("GET", "/api/post"),
//   getPostById: async (postId: string) => request("GET", `/api/post/${postId}`),
//   createPost: async (postData: any) => request("POST", "/api/post", postData),
//   updatePost: async (postId: string, postData: any) => request("PUT", `/api/post/${postId}`, postData),
//   deletePost: async (postId: string) => request("DELETE", `/api/post/${postId}`),
  
//   commentOnPost: async (postId: string, comment: string, parentId?: string) =>
//     request("POST", `/api/post/${postId}/comment`, { comment, parentId }),
//   getPostComments: async (postId: string) => request("GET", `/api/post/${postId}/comments`),

//   // Tutorials
//   getTutorials: async () => request("GET", "/api/tutorial"), // ✅ Plural URL corrected
//   getTutorialById: async (tutorialId: string) => request("GET", `/api/tutorial/${tutorialId}`),
 
//   commentOnTutorial: async (tutorialId: string, comment: string, parentId?: string) =>
//     request("POST", `/api/tutorial/${tutorialId}/comment`, { comment, parentId }),
//   deleteTutorial: async (tutorialId: string) => request("DELETE", `/api/tutorial/${tutorialId}`),

//   // Artworks
//   getArtworks: async () => request("GET", "/api/artwork"),
//   getArtworkById: async (artworkId: string) => request("GET", `/api/artwork/${artworkId}`),
//   buyArtworkById: async (artworkId: string) =>
//     request("POST", `/api/create-checkout-session/${artworkId}`),
//   markArtworkAsSold: async (artworkId: string) => request("PATCH", `/api/artwork/${artworkId}/mark-sold`),
  
  
//   commentOnArtwork: async (artworkId: string, comment: string, parentId?: string) =>
//     request("POST", `/api/artwork/${artworkId}/comment`, { comment, parentId }),
//   deleteArtwork: async (artworkId: string) => request("DELETE", `/api/artwork/${artworkId}`),

//   // AI Images
//   generateAIImage: async (prompt: string) => request("POST", "/api/ai-images", { prompt }), //generate AI image
//   getOwnAIImages: async () => request("GET", "/api/ai-images"),    //users own images could be privated too
//   getPublicAIImages: async () => request("GET", "/api/ai-images/publiced"), //all images that are public
//   toggleImageVisibility: async (imageId: string, isPublic: boolean) => request("PATCH", `/api/ai-images/${imageId}/visibility`, { isPublic }),
//   getGeneratedImageById: async (imageId: string) => request("GET", `/api/ai-images/${imageId}`),
// };


// import axios from "axios";
// import type {
//   RegisterUserDto,
//   LoginDto,
//   User,
//   Post,
//   CreatePostDto,
//   Artwork,
//   CreateArtworkDto,
//   Tutorial,
//   CreateTutorialDto,
//   AIImage,
//   GenerateAIImageDto,
//   Comment,
//   CreateCommentDto,
// } from "@/types";

// type GenerateAIImageResponse = {
//   success: boolean;
//   image: AIImage;
// };

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true,
// });

// // AUTH
// export const register = (data: RegisterUserDto) =>
//   api.post<User>("/auth/register", data).then((res) => res.data);

// export const login = (data: LoginDto) =>
//   api.post<User>("/auth/login", data).then((res) => res.data);

// export const logout = () =>
//   api.post("/auth/logout").then((res) => res.data);

// export const getCurrentUser = () =>
//   api.get<User>("/auth/me").then((res) => res.data);

// // USERS
// export const getUserById = (id: string) =>
//   api.get<User>(`/users/${id}`).then((res) => res.data);

// export const updateUser = (id: string, data: any) =>
//   api.patch(`/users/${id}`, data).then((res) => res.data);

// export const deleteUser = (id: string) =>
//   api.delete(`/users/${id}`).then((res) => res.data);

// export const toggleFollow = (id: string) =>
//   api.post(`/users/${id}/toggle-follow`).then((res) => res.data);

// // POSTS
// export const getPosts = () =>
//   api.get<Post[]>("/posts").then((res) => res.data);

// export const getPostById = (id: string) =>
//   api.get<Post>(`/posts/${id}`).then((res) => res.data);

// export const createPost = (data: CreatePostDto) =>
//   api.post<Post>("/posts", data).then((res) => res.data);

// export const updatePost = (id: string, data: Partial<CreatePostDto>) =>
//   api.patch<Post>(`/posts/${id}`, data).then((res) => res.data);

// export const deletePost = (id: string) =>
//   api.delete(`/posts/${id}`).then((res) => res.data);

// export const commentOnPost = (postId: string, comment: string, parentId?: string) =>
//   api.post(`/posts/${postId}/comment`, { comment, parentId }).then((res) => res.data);

// export const getPostComments = (postId: string) =>
//   api.get<Comment[]>(`/posts/${postId}/comments`).then((res) => res.data);

// // ARTWORKS
// export const createArtwork = (data: CreateArtworkDto) =>
//   api.post<Artwork>("/artworks", data).then((res) => res.data);

// export const getArtworks = () =>
//   api.get<Artwork[]>("/artworks").then((res) => res.data);

// export const getArtworkById = (id: string) =>
//   api.get<Artwork>(`/artworks/${id}`).then((res) => res.data);

// export const updateArtwork = (id: string, data: Partial<CreateArtworkDto>) =>
//   api.patch<Artwork>(`/artworks/${id}`, data).then((res) => res.data);

// export const deleteArtwork = (id: string) =>
//   api.delete(`/artworks/${id}`).then((res) => res.data);

// export const commentOnArtwork = (artworkId: string, comment: string, parentId?: string) =>
//   api.post(`/artworks/${artworkId}/comment`, { comment, parentId }).then((res) => res.data);

// // TUTORIALS
// export const createTutorial = (data: CreateTutorialDto) =>
//   api.post<Tutorial>("/tutorials", data).then((res) => res.data);

// export const getTutorials = () =>
//   api.get<Tutorial[]>("/tutorials").then((res) => res.data);

// export const getTutorialById = (id: string) =>
//   api.get<Tutorial>(`/tutorials/${id}`).then((res) => res.data);

// export const updateTutorial = (id: string, data: Partial<CreateTutorialDto>) =>
//   api.patch<Tutorial>(`/tutorials/${id}`, data).then((res) => res.data);

// export const deleteTutorial = (id: string) =>
//   api.delete(`/tutorials/${id}`).then((res) => res.data);

// export const commentOnTutorial = (tutorialId: string, comment: string, parentId?: string) =>
//   api.post(`/tutorials/${tutorialId}/comment`, { comment, parentId }).then((res) => res.data);

// // AI IMAGES
// export const generateAIImage = (data: GenerateAIImageDto) =>
//   api.post<GenerateAIImageResponse>("/ai/generate", data).then((res) => res.data);

// export const getAIImages = () =>
//   api.get<AIImage[]>("/ai").then((res) => res.data);

// // COMMENTS
// export const getComments = (
//   category: "post" | "artwork" | "tutorial",
//   contentId: string
// ) =>
//   api.get<Comment[]>(`/comments/${category}/${contentId}`).then((res) => res.data);

// export const createComment = (
//   category: "post" | "artwork" | "tutorial",
//   contentId: string,
//   data: CreateCommentDto
// ) =>
//   api.post<Comment>(`/comments/${category}/${contentId}`, data).then((res) => res.data);

// export const updateComment = (commentId: string, comment: string) =>
//   api.patch<Comment>(`/comments/${commentId}`, { comment }).then((res) => res.data);

// export const deleteComment = (commentId: string) =>
//   api.delete(`/comments/${commentId}`).then((res) => res.data);

// // LIKE
// export const likeContent = (id: string, category: string) =>
//   api.post(`/like/${category}/${id}`).then((res) => res.data);

// // USER ARTWORK/POSTS/TUTORIALS
// export const getArtworksByUser = (userId: string) =>
//   api.get<Artwork[]>(`/artwork/user/${userId}`).then((res) => res.data);

// export const getPostsByUser = (userId: string) =>
//   api.get<Post[]>(`/post/user/${userId}`).then((res) => res.data);

// export const getTutorialsByUser = (userId: string) =>
//   api.get<Tutorial[]>(`/tutorial/user/${userId}`).then((res) => res.data);

// export const getAiImagesByUser = (userId: string) =>
//   api.get<AIImage[]>(`/ai-images/user/${userId}`).then((res) => res.data);

// // FILE UPLOAD
// export const uploadFile = (data: any, category: string) =>
//   api.post(`/api/${category}`, data).then((res) => res.data);

// const apiClient = {
//   register,
//   login,
//   logout,
//   getCurrentUser,
//   getUserById,
//   updateUser,
//   deleteUser,
//   toggleFollow,
//   getPosts,
//   getPostById,
//   createPost,
//   updatePost,
//   deletePost,
//   commentOnPost,
//   getPostComments,
//   createArtwork,
//   getArtworks,
//   getArtworkById,
//   updateArtwork,
//   deleteArtwork,
//   commentOnArtwork,
//   createTutorial,
//   getTutorials,
//   getTutorialById,
//   updateTutorial,
//   deleteTutorial,
//   commentOnTutorial,
//   generateAIImage,
//   getAIImages,
//   getComments,
//   createComment,
//   updateComment,
//   deleteComment,
//   likeContent,
//   getArtworksByUser,
//   getPostsByUser,
//   getTutorialsByUser,
//   getAiImagesByUser,
//   uploadFile,
// };

// export default apiClient;
