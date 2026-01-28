-- Drop existing permissive write policies on elements table
DROP POLICY IF EXISTS "Anyone can delete elements" ON public.elements;
DROP POLICY IF EXISTS "Anyone can insert elements" ON public.elements;
DROP POLICY IF EXISTS "Anyone can update elements" ON public.elements;

-- Create admin-only write policies using email check
-- Admin email: marcoscorporation23@gmail.com

CREATE POLICY "Only admin can insert elements" 
ON public.elements 
FOR INSERT 
WITH CHECK (
  auth.jwt() ->> 'email' = 'marcoscorporation23@gmail.com'
);

CREATE POLICY "Only admin can update elements" 
ON public.elements 
FOR UPDATE 
USING (
  auth.jwt() ->> 'email' = 'marcoscorporation23@gmail.com'
);

CREATE POLICY "Only admin can delete elements" 
ON public.elements 
FOR DELETE 
USING (
  auth.jwt() ->> 'email' = 'marcoscorporation23@gmail.com'
);