-- Add light_background column to elements table
ALTER TABLE public.elements 
ADD COLUMN light_background BOOLEAN NOT NULL DEFAULT false;