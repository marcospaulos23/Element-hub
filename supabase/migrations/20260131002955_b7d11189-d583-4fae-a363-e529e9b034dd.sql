-- Add preview_video column to elements table
ALTER TABLE public.elements
ADD COLUMN preview_video TEXT DEFAULT NULL;

-- Add use_preview_video column (to toggle video display)
ALTER TABLE public.elements
ADD COLUMN use_preview_video BOOLEAN DEFAULT false;