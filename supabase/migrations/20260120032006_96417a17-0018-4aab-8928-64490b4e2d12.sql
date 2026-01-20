-- Create a table for UI elements
CREATE TABLE public.elements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.elements ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (anyone can view elements)
CREATE POLICY "Anyone can view elements" 
ON public.elements 
FOR SELECT 
USING (true);

-- Create policy for public insert access
CREATE POLICY "Anyone can insert elements" 
ON public.elements 
FOR INSERT 
WITH CHECK (true);

-- Create policy for public update access
CREATE POLICY "Anyone can update elements" 
ON public.elements 
FOR UPDATE 
USING (true);

-- Create policy for public delete access
CREATE POLICY "Anyone can delete elements" 
ON public.elements 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_elements_updated_at
BEFORE UPDATE ON public.elements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();