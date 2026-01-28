-- Enable realtime for profiles table to notify admin of new signups
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- Allow admin to delete profiles (for rejecting users)
CREATE POLICY "Admins can delete profiles"
ON public.profiles
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));