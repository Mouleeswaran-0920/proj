import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in your .env file.');
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error(`Invalid VITE_SUPABASE_URL format: "${supabaseUrl}". Please ensure it's a valid URL starting with https:// (e.g., https://your-project-id.supabase.co)`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          preferred_categories: string[] | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          preferred_categories?: string[] | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          preferred_categories?: string[] | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          article_id: string;
          title: string;
          description: string | null;
          url: string;
          image_url: string | null;
          source: string | null;
          category: string | null;
          published_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          article_id: string;
          title: string;
          description?: string | null;
          url: string;
          image_url?: string | null;
          source?: string | null;
          category?: string | null;
          published_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          article_id?: string;
          title?: string;
          description?: string | null;
          url?: string;
          image_url?: string | null;
          source?: string | null;
          category?: string | null;
          published_at?: string | null;
          created_at?: string | null;
        };
      };
      reading_history: {
        Row: {
          id: string;
          user_id: string;
          article_id: string;
          title: string;
          url: string;
          read_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          article_id: string;
          title: string;
          url: string;
          read_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          article_id?: string;
          title?: string;
          url?: string;
          read_at?: string | null;
        };
      };
    };
  };
};