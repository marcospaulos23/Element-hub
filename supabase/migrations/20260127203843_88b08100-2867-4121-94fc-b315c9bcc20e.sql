-- Add field to control if preview image should be shown in repository
ALTER TABLE public.elements 
ADD COLUMN use_preview_image boolean NOT NULL DEFAULT true;