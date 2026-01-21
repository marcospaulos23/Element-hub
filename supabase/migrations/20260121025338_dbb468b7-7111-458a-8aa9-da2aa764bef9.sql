-- Add description column to categories table
ALTER TABLE public.categories 
ADD COLUMN description text;