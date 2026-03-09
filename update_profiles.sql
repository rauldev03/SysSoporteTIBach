-- SCRIPT PARA AÑADIR NUEVOS CAMPOS A PERFILES
-- Ejecuta esto en el SQL Editor de Supabase
-- Agergando Nombres, Apellidos, DNI y Área

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS dni TEXT,
ADD COLUMN IF NOT EXISTS area TEXT;

-- Actualizamos la función handle_new_user para capturar estos campos cuando
-- un usuario se registre desde un frontend de registro en el futuro.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, first_name, last_name, dni, area)
  VALUES (
    NEW.id, 
    NEW.email, 
    NEW.raw_user_meta_data->>'full_name', 
    COALESCE(NEW.raw_user_meta_data->>'role', 'cliente'),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'dni',
    NEW.raw_user_meta_data->>'area'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
