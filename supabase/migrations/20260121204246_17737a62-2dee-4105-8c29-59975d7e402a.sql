-- Add display_order column to categories table
ALTER TABLE public.categories ADD COLUMN display_order integer DEFAULT 0;

-- Initialize display_order based on current alphabetical order
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY name) as rn
  FROM public.categories
)
UPDATE public.categories c
SET display_order = o.rn
FROM ordered o
WHERE c.id = o.id;