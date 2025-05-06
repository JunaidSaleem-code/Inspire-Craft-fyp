// User
export interface User {
    _id: string;
    name: string;
    email: string;
    bio?: string;
    avatarUrl?: string;
    followers: string[];
    following: string[];
    createdAt: string;
  }
  
  // Auth
  export interface RegisterUserDto {
    name: string;
    email: string;
    password: string;
  }
  export interface LoginDto {
    email: string;
    password: string;
  }
  
  // Post
  export interface CreatePostDto {
    title: string;
    description: string;
    mediaUrl: string;
    mediaType: "image" | "video";
  }
  export interface Post extends CreatePostDto {
    _id: string;
    author: User;
    likes: User[];
    comments: Comment[];
    createdAt: string;
  }
  
  // Artwork
  export interface CreateArtworkDto {
    title: string;
    description: string;
    price: number;
    mediaUrl: string;
    mediaType: "image" | "video";
    artType: string;
  }
  export interface Artwork extends CreateArtworkDto {
    _id: string;
    artist: User;
    likes: User[];
    comments: Comment[];
    isSold: boolean;
    createdAt: string;
  }
  
  // Tutorial
  export interface CreateTutorialDto {
    title: string;
    description: string;
    mediaUrl: string;
  }
  export interface Tutorial extends CreateTutorialDto {
    _id: string;
    author: User;
    comments: Comment[];
    createdAt: string;
  }
  
  // AI Image
  export interface GenerateAIImageDto {
    prompt: string;
  }
  export interface AIImage {
    _id: string;
    prompt: string;
    imageUrl: string;
    owner: User;
    isPublic: boolean;
    createdAt: string;
  }
  
  // Comment
  export interface Comment {
    _id: string;
    content: string;
    author: User;
    replies: Comment[];
    parentComment?: string;
    createdAt: string;
  }
  export interface CreateCommentDto {
    comment: string;
    parentId?: string;
  }
  
  // Generic
  export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
  }
  