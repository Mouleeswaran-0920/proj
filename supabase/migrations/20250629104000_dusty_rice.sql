/*
  # Fix database schema and policies

  1. New Tables
    - `profiles` table (if not exists)
    - `reading_history` table (if not exists)
    - Update `bookmarks` table structure

  2. Security
    - Enable RLS on all tables
    - Create policies with proper error handling
    - Handle new user creation

  3. Functions
    - User creation trigger function
*/

-- Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  avatar_url text,
  preferred_categories text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO public
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO public
  USING (auth.uid() = id);

-- Create reading_history table if it doesn't exist
CREATE TABLE IF NOT EXISTS reading_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  article_id text NOT NULL,
  title text NOT NULL,
  url text NOT NULL,
  read_at timestamptz DEFAULT now()
);

ALTER TABLE reading_history ENABLE ROW LEVEL SECURITY;

-- Drop existing reading history policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view own reading history" ON reading_history;
DROP POLICY IF EXISTS "Users can create own reading history" ON reading_history;
DROP POLICY IF EXISTS "Users can delete own reading history" ON reading_history;

-- Reading history policies
CREATE POLICY "Users can view own reading history"
  ON reading_history
  FOR SELECT
  TO public
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own reading history"
  ON reading_history
  FOR INSERT
  TO public
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reading history"
  ON reading_history
  FOR DELETE
  TO public
  USING (auth.uid() = user_id);

-- Update bookmarks table structure to match schema
DO $$
BEGIN
  -- Check if we need to rename columns
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookmarks' AND column_name = 'article_title'
  ) THEN
    -- Rename columns to match schema
    ALTER TABLE bookmarks RENAME COLUMN article_title TO title;
    ALTER TABLE bookmarks RENAME COLUMN article_description TO description;
    ALTER TABLE bookmarks RENAME COLUMN article_url TO url;
    ALTER TABLE bookmarks RENAME COLUMN article_image TO image_url;
    ALTER TABLE bookmarks RENAME COLUMN article_source TO source;
    ALTER TABLE bookmarks RENAME COLUMN article_published_at TO published_at;
  END IF;
EXCEPTION
  WHEN others THEN
    -- Ignore errors if columns don't exist or already renamed
    NULL;
END $$;

-- Add missing columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookmarks' AND column_name = 'article_id'
  ) THEN
    ALTER TABLE bookmarks ADD COLUMN article_id text NOT NULL DEFAULT '';
  END IF;
EXCEPTION
  WHEN others THEN
    -- Ignore if column already exists
    NULL;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'bookmarks' AND column_name = 'category'
  ) THEN
    ALTER TABLE bookmarks ADD COLUMN category text;
  END IF;
EXCEPTION
  WHEN others THEN
    -- Ignore if column already exists
    NULL;
END $$;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();