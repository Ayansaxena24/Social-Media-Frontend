export interface Post {
  id: string;
  authorid: string;
  content: string;
  author: string;
  mentions: string[];
  image?: string;
  profilePicture?: string;
  likes: number;
  likedby: string[];
}

// User Interface
export interface User {
  id: string;
  email: string;
  username: string;
  profilePicture?: string;
  following: string[];
  followers: string[];
  bio?: string;
}
  
  export interface AddPostResponse {
    addPost: Post;
  }
  