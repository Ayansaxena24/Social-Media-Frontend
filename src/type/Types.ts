export interface Post {
    id: string;
    content: string;
    author: string;
    mentions: string[];
  }
  
  export interface AddPostResponse {
    addPost: Post;
  }
  