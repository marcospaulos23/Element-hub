import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface UIElement {
  id: string;
  name: string;
  description: string;
  category: string;
  code: string;
}

export const useElements = () => {
  const [elements, setElements] = useState<UIElement[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchElements = async () => {
    try {
      const { data, error } = await supabase
        .from('elements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setElements(data || []);
    } catch (error) {
      console.error('Error fetching elements:', error);
      toast.error('Erro ao carregar elementos');
    } finally {
      setLoading(false);
    }
  };

  const addElement = async (element: Omit<UIElement, "id">) => {
    try {
      const { data, error } = await supabase
        .from('elements')
        .insert([element])
        .select()
        .single();

      if (error) throw error;
      setElements((prev) => [data, ...prev]);
      toast.success('Elemento adicionado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error adding element:', error);
      toast.error('Erro ao adicionar elemento');
      return null;
    }
  };

  const updateElement = async (id: string, updates: Partial<Omit<UIElement, "id">>) => {
    try {
      const { data, error } = await supabase
        .from('elements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setElements((prev) => prev.map((el) => (el.id === id ? data : el)));
      toast.success('Elemento atualizado com sucesso!');
      return data;
    } catch (error) {
      console.error('Error updating element:', error);
      toast.error('Erro ao atualizar elemento');
      return null;
    }
  };

  const deleteElement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('elements')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setElements((prev) => prev.filter((el) => el.id !== id));
      toast.success('Elemento excluído com sucesso!');
      return true;
    } catch (error) {
      console.error('Error deleting element:', error);
      toast.error('Erro ao excluir elemento');
      return false;
    }
  };

  useEffect(() => {
    fetchElements();
  }, []);

  return {
    elements,
    loading,
    addElement,
    updateElement,
    deleteElement,
    refetch: fetchElements,
  };
};
