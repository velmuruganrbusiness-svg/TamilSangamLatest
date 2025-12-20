
import type { Post } from '../types';

const API_URL = 'http://localhost:5000/api';

export const api = {
  // Fetch all posts from MongoDB
  getPosts: async (): Promise<Post[]> => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return [];
    }
  },

  // Save a new post to MongoDB
  createPost: async (postData: Omit<Post, 'id' | 'likes' | 'comments' | 'createdAt'>): Promise<Post | null> => {
    try {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) throw new Error('Failed to create post');
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  },

  // Like a post
  likePost: async (id: number | string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}/like`, { method: 'POST' });
      return response.ok;
    } catch (error) {
      console.error("API Error:", error);
      return false;
    }
  }
};
