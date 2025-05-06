

export interface User {
    _id: string;
    name?: string;
    avatar?: string;
  }
  
  export interface Comment {
    _id: string;
    content: string;
    user: User;
  }
  