import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only create Supabase client if environment variables are properly configured
let supabase: any = null;

if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'your_supabase_url_here' && supabaseAnonKey !== 'your_supabase_anon_key_here') {
  try {
    new URL(supabaseUrl);
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (error) {
    console.warn('Invalid Supabase URL format, Supabase features will be disabled');
  }
} else {
  console.warn('Supabase not configured, authentication and bookmarks will be disabled');
}

export { supabase };

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