
export type Category = 'கவிதை' | 'கட்டுரை' | 'மேற்கோள்' | 'கதை' | 'பொன்மொழி' | 'ஊக்கம்' | 'வரலாறு' | 'பழமொழி';

export interface User {
  id: number;
  name: string;
  avatarUrl?: string;
}

export interface Comment {
  id: number;
  user: User;
  text: string;
  createdAt: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  author: User;
  category: Category;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

export interface ClassicalVerse {
  text: string;
  explanation?: string;
}

export interface ClassicalChapter {
    chapter: string;
    verses: ClassicalVerse[];
}

export interface ClassicalSection {
    id: string;
    title: string;
    description?: string;
    chapters: ClassicalChapter[];
}

export interface ClassicalWork {
    id: string;
    title: string;
    author: string;
    description: string;
    // content is used for flat works (like Aathichoodi)
    content?: ClassicalChapter[]; 
    // sections is used for hierarchical works (like Thirukkural)
    sections?: ClassicalSection[];
}

export interface Competition {
  id: number;
  title: string;
  description: string;
  deadline: string;
  status: 'active' | 'completed' | 'upcoming';
  prize: string;
  imageUrl?: string;
}
