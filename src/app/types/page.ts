export interface User{
  _id: string;
  email?: string;
  username?: string;
  avatar?: string;
  following?: string[];
  followers?: string[];
  createdAt?: Date;
  updatedAt?: Date;
  isVerified?: boolean;
  bio?: string;
  password?: string;
  status?: number;
}
export interface Like{
  _id?: string;
  user: User;
  post?: Post;
  tutorial?: Tutorial;
  artwork?: Artwork;
  createdAt?: Date;
  
}
export interface Tutorial{
  _id: string;
  author: User;
  title: string;
  description: string;
  mediaFileId?: string;
  mediaUrl: string;
  likes: Like[];
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
  transformation?:{
    height: number;
    width: number;
    quality?: number;
  }
  success?: boolean;
  message?: string;
}

export interface Post{
  _id?: string;
  user: User;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaFileId: string;
  mediaType: "image" | "video";
  comments: Comment[];
  likes: Like[];
  controls?: boolean;
  transformation?:{
    height: number;
    width: number;
    quality?: number;
  }
  createdAt?: Date;
  updatedAt?: Date;
  success?: boolean;
}
export interface GeneratedImage {
  _id?: string;
  user: User; // Owner of the image
  prompt: string; // The input prompt used for generation
  mediaUrl: string; // The generated image URL
  // thumbnailUrl?: string;
  isPublic: boolean; // Default is false, stays private
  source: string;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  createdAt?: Date;
  success?: boolean;
}

export interface Comment {
  _id?: string;
  user: User;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
  commentableType: "tutorial" | "post" | "artwork";
  commentableId: Tutorial | Post | Artwork;
}
export interface Artwork {
  success?: boolean;
  _id?: string;
  artist: User;
  title: string;
  description?: string;
  mediaUrl: string;
  mediaFileId: string;
  mediaType: "image" | "video";
  // thumbnailUrl?: string;
  price: number;
  currency: "PKR";
  isSold: boolean;
  buyer: User;
  soldAt?: Date;
  transformation?: {
    height: number;
    width: number;
    quality?: number;
  };
  likes: Like[];
  comments?: Comment[];
  artType?: string;
  slug?: string;
  createdAt?: Date;
  message?: string;
}
export interface GenerateAIImageResponse {
  success: boolean;
  image: GeneratedImage;
}
export interface GetOwnImageResponse {
  success: boolean;
  images: GeneratedImage[];
}
export interface PostResponse {
  success: boolean;
    post: Post;
    likes: Like[];
}

export interface uploadResp {
  success?: boolean;
  post?: Post;
  tutorial?: Tutorial;
  artwork?: Artwork;
  message?: string;
}
export interface LikeResponse {
  success: boolean,
  liked: boolean,
  totalLikes: number,
  likes: Like[],
}
export interface CommentResponse {
  success: boolean;
  comment?: Comment;
  comments?: Comment[];
  totalCount?: number;
  updated?: Comment;
  message?: string;
}

export interface CreatePostResponse {
  success: boolean;
  post: Post;
  message?: string;
}
export interface PostResponse{ 
  success: boolean, 
 post: Post, 
 likes: Like[] 
}
export interface TutorialResponse{ 
  success: boolean, 
  tutorial?: Tutorial, 
  likes?: Like[] 
  message?: string
}
export interface ArtworkResponse{ 
  success?: boolean, 
  artwork?: Artwork,
  likes?: Like[] 
  message?: string
}
export interface CheckoutSessionResponse {
  success: boolean;
  url: string;
}
export interface ToggleVisibilityResponse{
   success: true, 
   image: GeneratedImage, 
}
export interface SearchResult {
  artworks?: Artwork[];
  posts?: Post[];
  tutorials?: Tutorial[];
  generatedImages?: GeneratedImage[];
}
