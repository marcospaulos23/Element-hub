-- Drop existing permissive write policies on categories table
DROP POLICY IF EXISTS "Anyone can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Anyone can update categories" ON public.categories;

-- Create admin-only write policies for categories
CREATE POLICY "Only admin can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (
  auth.jwt() ->> 'email' = 'marcoscorporation23@gmail.com'
);

CREATE POLICY "Only admin can update categories" 
ON public.categories 
FOR UPDATE 
USING (
  auth.jwt() ->> 'email' = 'marcoscorporation23@gmail.com'
);

CREATE POLICY "Only admin can delete categories" 
ON public.categories 
FOR DELETE 
USING (
  auth.jwt() ->> 'email' = 'marcoscorporation23@gmail.com'
);