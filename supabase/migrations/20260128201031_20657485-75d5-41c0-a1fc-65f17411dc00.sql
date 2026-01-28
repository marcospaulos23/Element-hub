-- Step 1: Add admin role for the admin user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users
WHERE email = 'marcoscorporation23@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 2: Update categories table policies to use has_role()
DROP POLICY IF EXISTS "Only admin can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Only admin can update categories" ON public.categories;
DROP POLICY IF EXISTS "Only admin can delete categories" ON public.categories;

CREATE POLICY "Only admin can insert categories" 
ON public.categories FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admin can update categories" 
ON public.categories FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admin can delete categories" 
ON public.categories FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Step 3: Update elements table policies to use has_role()
DROP POLICY IF EXISTS "Only admin can insert elements" ON public.elements;
DROP POLICY IF EXISTS "Only admin can update elements" ON public.elements;
DROP POLICY IF EXISTS "Only admin can delete elements" ON public.elements;

CREATE POLICY "Only admin can insert elements" 
ON public.elements FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admin can update elements" 
ON public.elements FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admin can delete elements" 
ON public.elements FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Step 4: Update storage policies to use has_role()
DROP POLICY IF EXISTS "Only admin can upload element previews" ON storage.objects;
DROP POLICY IF EXISTS "Only admin can delete element previews" ON storage.objects;

CREATE POLICY "Only admin can upload element previews"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'element-previews' AND
  has_role(auth.uid(), 'admin')
);

CREATE POLICY "Only admin can delete element previews"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'element-previews' AND
  has_role(auth.uid(), 'admin')
);