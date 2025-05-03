const request = async (method: string, url: string, data?: any) => {
  const options: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
    ...(data && method !== "GET" ? { body: JSON.stringify(data) } : {}),
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // ✅ Handle empty JSON response
      throw new Error(errorData.message || "Request failed");
    }

    if (response.status === 204) return null; // ✅ Handle No Content responses (like DELETE)

    return response.json().catch(() => ({})); // ✅ Prevent JSON parse error for empty responses
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};


export const apiClient = {
  // Authentication
  register: async (userData: any) => request("POST", "/api/auth/register", userData),
  login: async (credentials: any) => request("POST", "/api/auth/login", credentials),
  logout: async () => request("POST", "/api/auth/logout"),
  getCurrentUser: async () => request("GET", "/api/auth/me"),

  // User Management
  getUserById: async (userId: string) => request("GET", `/api/users/${userId}`),
  updateUser: async (userId: string, userData: any) => request("PATCH", `/api/users/${userId}`, userData),
  deleteUser: async (userId: string) => request("DELETE", `/api/users/${userId}`),
  toggleFollow: async (userId: string) => request("POST", `/api/users/${userId}/toggle-follow`),

// User-specific content
getArtworksByUser: async (userId: string) => request("GET", `/api/artwork/user/${userId}`),
getPostsByUser: async (userId: string) => request("GET", `/api/post/user/${userId}`),
getTutorialsByUser: async (userId: string) => request("GET", `/api/tutorial/user/${userId}`),
getAiImagesByUser: async (userId: string) => request("GET", `/api/ai-images/user/${userId}`),

  // Dynamic File Upload
  uploadFile: async (data: any, category: string) => request("POST", `/api/${category}`, data),

  //Dynamic Update
  updateContentById: async (id: string, category: string, data: any) => request("PATCH", `/api/${category}/${id}`, data),

  //Dynamic Like
  likeContent: async (id: string, category: string) => request("POST", `/api/like/${category}/${id}`),

  //Dynamic Comment 
  commentOnContent: async (commentId: string, category: string, comment: string, parentId?: string) =>
    request("POST", `/api/comment/${category}/${commentId}`, { comment, parentId }),
  getComments: async (category: string, id: string, page: number = 1, limit: number = 5) =>
    request("GET", `/api/comment/${category}/${id}?page=${page}&limit=${limit}`),

  getReplies: async (
    category: string,
    contentId: string,
    commentId: string,
    page = 1,
    limit = 5
  ) =>
    request(
      "GET",
      `/api/comment/${category}/${contentId}/replies?commentId=${commentId}&page=${page}&limit=${limit}`
    ),
  updateComment: async (commentId: string,category: string, content: any) =>
    request("PATCH", `/api/comment/${category}/${commentId}`, { commentId, content }),
  deleteComment: async (commentId: string, category: string) =>
    request("DELETE", `/api/comment/${category}/${commentId}`, { commentId }),


  // Post
  getPosts: async () => request("GET", "/api/post"),
  getPostById: async (postId: string) => request("GET", `/api/post/${postId}`),
  createPost: async (postData: any) => request("POST", "/api/post", postData),
  updatePost: async (postId: string, postData: any) => request("PUT", `/api/post/${postId}`, postData),
  deletePost: async (postId: string) => request("DELETE", `/api/post/${postId}`),
  
  commentOnPost: async (postId: string, comment: string, parentId?: string) =>
    request("POST", `/api/post/${postId}/comment`, { comment, parentId }),
  getPostComments: async (postId: string) => request("GET", `/api/post/${postId}/comments`),

  // Tutorials
  getTutorials: async () => request("GET", "/api/tutorial"), // ✅ Plural URL corrected
  getTutorialById: async (tutorialId: string) => request("GET", `/api/tutorial/${tutorialId}`),
 
  commentOnTutorial: async (tutorialId: string, comment: string, parentId?: string) =>
    request("POST", `/api/tutorial/${tutorialId}/comment`, { comment, parentId }),
  deleteTutorial: async (tutorialId: string) => request("DELETE", `/api/tutorial/${tutorialId}`),

  // Artworks
  getArtworks: async () => request("GET", "/api/artwork"),
  getArtworkById: async (artworkId: string) => request("GET", `/api/artwork/${artworkId}`),
  buyArtworkById: async (artworkId: string) =>
    request("POST", `/api/create-checkout-session/${artworkId}`),
  markArtworkAsSold: async (artworkId: string) => request("PATCH", `/api/artwork/${artworkId}/mark-sold`),
  
  
  commentOnArtwork: async (artworkId: string, comment: string, parentId?: string) =>
    request("POST", `/api/artwork/${artworkId}/comment`, { comment, parentId }),
  deleteArtwork: async (artworkId: string) => request("DELETE", `/api/artwork/${artworkId}`),

  // AI Images
  generateAIImage: async (prompt: string) => request("POST", "/api/ai-images", { prompt }), //generate AI image
  getOwnAIImages: async () => request("GET", "/api/ai-images"),    //users own images could be privated too
  getPublicAIImages: async () => request("GET", "/api/ai-images/publiced"), //all images that are public
  toggleImageVisibility: async (imageId: string, isPublic: boolean) => request("PATCH", `/api/ai-images/${imageId}/visibility`, { isPublic }),
  getGeneratedImageById: async (imageId: string) => request("GET", `/api/ai-images/${imageId}`),
};
