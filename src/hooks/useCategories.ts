import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
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
        .order('display_order', { ascending: true });

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
      // Get max display_order
      const maxOrder = categories.length > 0 
        ? Math.max(...categories.map(c => c.display_order)) + 1 
        : 1;
      
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name, description: description || null, display_order: maxOrder }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          toast.error('Esta categoria já existe');
          return null;
        }
        throw error;
      }
      setCategories((prev) => [...prev, data].sort((a, b) => a.display_order - b.display_order));
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
        prev.map((cat) => cat.id === id ? data : cat).sort((a, b) => a.display_order - b.display_order)
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

  const reorderCategory = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(c => c.id === id);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= categories.length) return;
    
    const currentCategory = categories[currentIndex];
    const swapCategory = categories[newIndex];
    
    try {
      // Swap display_order values
      const [res1, res2] = await Promise.all([
        supabase
          .from('categories')
          .update({ display_order: swapCategory.display_order })
          .eq('id', currentCategory.id),
        supabase
          .from('categories')
          .update({ display_order: currentCategory.display_order })
          .eq('id', swapCategory.id)
      ]);
      
      if (res1.error || res2.error) throw res1.error || res2.error;
      
      // Update local state
      const newCategories = [...categories];
      newCategories[currentIndex] = { ...currentCategory, display_order: swapCategory.display_order };
      newCategories[newIndex] = { ...swapCategory, display_order: currentCategory.display_order };
      setCategories(newCategories.sort((a, b) => a.display_order - b.display_order));
    } catch (error) {
      console.error('Error reordering category:', error);
      toast.error('Erro ao reordenar categoria');
    }
  };

  return {
    categories,
    loading: loading,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategory,
    refetch: fetchCategories,
  };
};
