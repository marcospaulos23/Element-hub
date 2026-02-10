-- Consolidated Migration for Element Hub
-- Based on local migrations and data seed

-- 1. Create Types and Functions
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'user');
    END IF;
END $$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 2. Create Tables

-- Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Elements Table
CREATE TABLE IF NOT EXISTS public.elements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT[] NOT NULL DEFAULT '{}',
  code TEXT NOT NULL,
  preview_image TEXT DEFAULT NULL,
  preview_video TEXT DEFAULT NULL,
  light_background BOOLEAN NOT NULL DEFAULT false,
  use_preview_image BOOLEAN NOT NULL DEFAULT true,
  use_preview_video BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- 3. Security Definer Function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 4. Triggers
DROP TRIGGER IF EXISTS update_elements_updated_at ON public.elements;
CREATE TRIGGER update_elements_updated_at
BEFORE UPDATE ON public.elements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 6. Policies

-- Categories Policies
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admin can manage categories" ON public.categories;
CREATE POLICY "Only admin can manage categories" 
ON public.categories FOR ALL
USING (auth.jwt() ->> 'email' = 'marcoscorporation23@gmail.com' OR public.has_role(auth.uid(), 'admin'));

-- Elements Policies
DROP POLICY IF EXISTS "Anyone can view elements" ON public.elements;
CREATE POLICY "Anyone can view elements" ON public.elements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Only admin can manage elements" ON public.elements;
CREATE POLICY "Only admin can manage elements" 
ON public.elements FOR ALL
USING (auth.jwt() ->> 'email' = 'marcoscorporation23@gmail.com' OR public.has_role(auth.uid(), 'admin'));

-- Profiles Policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User Roles Policies
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR auth.jwt() ->> 'email' = 'marcoscorporation23@gmail.com');

DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin') OR auth.jwt() ->> 'email' = 'marcoscorporation23@gmail.com');

-- 7. Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;

-- 8. Seed Data (Categories)
INSERT INTO public.categories (name, description, display_order)
VALUES 
  ('Botões', 'Elementos de interação clicáveis', 1),
  ('Cards', 'Containers de conteúdo estruturado', 2),
  ('Forms', 'Elementos de entrada de dados', 3),
  ('Loaders', 'Indicadores de carregamento', 4),
  ('UI', 'Elementos variados de interface', 5),
  ('Fundo de Pagina', 'Efeitos visuais de plano de fundo', 6)
ON CONFLICT (name) DO NOTHING;

-- 9. Seed Data (Elements)
INSERT INTO public.elements (name, description, category, code)
VALUES 
  ('Botão Neon', 'Botão com efeito de brilho neon animado', ARRAY['Botões'], '<button class="relative px-8 py-4 bg-transparent border-2 border-cyan-400 text-cyan-400 font-semibold rounded-lg overflow-hidden group">
  <span class="relative z-10">Hover Me</span>
  <div class="absolute inset-0 bg-cyan-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
  <span class="absolute inset-0 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
    Hover Me
  </span>
</button>'),
  ('Card Glassmorphism', 'Card com efeito de vidro fosco translúcido', ARRAY['Cards'], '<div class="relative p-8 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl">
  <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-2xl"></div>
  <div class="relative z-10">
    <h3 class="text-2xl font-bold text-white mb-2">Glass Card</h3>
    <p class="text-white/70">Efeito de vidro fosco moderno</p>
  </div>
</div>'),
  ('Input Animado', 'Campo de input com label flutuante animada', ARRAY['Forms'], '<div class="relative group">
  <input 
    type="text" 
    class="w-full px-4 py-3 bg-transparent border-2 border-gray-600 rounded-lg text-white focus:border-cyan-400 focus:outline-none transition-colors peer"
    placeholder=" "
  />
  <label class="absolute left-4 top-3 text-gray-400 transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-cyan-400 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs bg-gray-900 px-1">
    Email
  </label>
</div>'),
  ('Loading Spinner', 'Spinner de carregamento com gradiente rotativo', ARRAY['Loaders'], '<div class="relative w-16 h-16">
  <div class="absolute inset-0 rounded-full border-4 border-gray-700"></div>
  <div class="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin"></div>
  <div class="absolute inset-2 rounded-full border-4 border-transparent border-t-purple-400 animate-spin" style="animation-duration: 1.5s; animation-direction: reverse;"></div>
</div>'),
  ('Toggle Switch', 'Switch toggle com animação suave', ARRAY['Forms'], '<label class="relative inline-flex items-center cursor-pointer">
  <input type="checkbox" class="sr-only peer" />
  <div class="w-14 h-8 bg-gray-700 rounded-full peer peer-checked:bg-cyan-500 transition-colors duration-300">
    <div class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-lg transform peer-checked:translate-x-6 transition-transform duration-300"></div>
  </div>
</label>'),
  ('Badge Animado', 'Badge com pulse de notificação', ARRAY['UI'], '<span class="relative inline-flex">
  <span class="px-4 py-2 bg-cyan-500/20 text-cyan-400 text-sm font-medium rounded-full border border-cyan-400/30">
    Novo
  </span>
  <span class="absolute -top-1 -right-1 flex h-3 w-3">
    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
    <span class="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
  </span>
</span>')
ON CONFLICT (name) DO NOTHING;
