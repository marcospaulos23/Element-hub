import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  is_visible: boolean;
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

  const reorderCategories = async (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    if (fromIndex < 0 || fromIndex >= categories.length) return;
    if (toIndex < 0 || toIndex >= categories.length) return;
    
    // Create new array with reordered items
    const newCategories = [...categories];
    const [movedItem] = newCategories.splice(fromIndex, 1);
    newCategories.splice(toIndex, 0, movedItem);
    
    // Assign new display_order values based on position
    const updates = newCategories.map((cat, index) => ({
      id: cat.id,
      display_order: index + 1
    }));
    
    // Optimistically update UI
    setCategories(newCategories.map((cat, index) => ({
      ...cat,
      display_order: index + 1
    })));
    
    try {
      // Update all display_order values in database
      const updatePromises = updates.map(({ id, display_order }) =>
        supabase
          .from('categories')
          .update({ display_order })
          .eq('id', id)
      );
      
      const results = await Promise.all(updatePromises);
      const hasError = results.some(r => r.error);
      
      if (hasError) {
        throw new Error('Failed to update some categories');
      }
    } catch (error) {
      console.error('Error reordering categories:', error);
      toast.error('Erro ao reordenar categorias');
      // Revert on error
      fetchCategories();
    }
  };

  const toggleCategoryVisibility = async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (!category) return null;
    
    const newVisibility = !category.is_visible;
    
    // Optimistic update
    setCategories(prev => 
      prev.map(cat => cat.id === id ? { ...cat, is_visible: newVisibility } : cat)
    );
    
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_visible: newVisibility })
        .eq('id', id);

      if (error) throw error;
      return newVisibility;
    } catch (error) {
      console.error('Error toggling category visibility:', error);
      toast.error('Erro ao alterar visibilidade');
      // Revert on error
      setCategories(prev => 
        prev.map(cat => cat.id === id ? { ...cat, is_visible: !newVisibility } : cat)
      );
      return null;
    }
  };

  return {
    categories,
    loading: loading,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,
    toggleCategoryVisibility,
    refetch: fetchCategories,
  };
};
