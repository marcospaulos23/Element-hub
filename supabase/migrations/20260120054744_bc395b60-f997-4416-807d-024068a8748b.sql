-- Add preview_image column for static image when not hovering
ALTER TABLE public.elements
ADD COLUMN preview_image text DEFAULT NULL;

-- Change category from text to text[] for multiple categories
ALTER TABLE public.elements
ALTER COLUMN category TYPE text[] USING ARRAY[category];