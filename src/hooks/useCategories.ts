import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, description: description || null }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error('Esta categoria já existe');
          return null;
        }
        throw error;
      }
      setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      toast.success('Categoria adicionada com sucesso!');
      return data;
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Erro ao adicionar categoria');
      return null;
    }
  };

  const updateCategory = async (id: string, name: string, description?: string) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({ name, description: description || null })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error('Já existe uma categoria com este nome');
          return null;
        }
        throw error;
      }
      setCategories((prev) => 
        prev.map((cat) => cat.id === id ? data : cat).sort((a, b) => a.name.localeCompare(b.name))
      );
      toast.success('Categoria atualizada com sucesso!');
      return data;
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Erro ao atualizar categoria');
      return null;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      toast.success('Categoria excluída com sucesso!');
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Erro ao excluir categoria');
      return false;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading: loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
};
