-- Remove the policy that allows users to view their own roles
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

-- Now only admins can view roles (the "Admins can view all roles" policy remains)