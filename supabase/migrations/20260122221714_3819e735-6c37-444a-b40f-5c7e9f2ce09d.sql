-- Add visibility column to categories table
ALTER TABLE public.categories ADD COLUMN is_visible boolean NOT NULL DEFAULT true;