-- Add UPDATE policy for categories
CREATE POLICY "Anyone can update categories" 
ON public.categories 
FOR UPDATE 
USING (true);