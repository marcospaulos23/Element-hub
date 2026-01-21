import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Pencil } from "lucide-react";
import { Category } from "@/hooks/useCategories";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, name: string, description?: string) => void;
  category: Category | null;
}

const EditCategoryModal = ({ isOpen, onClose, onSave, category }: EditCategoryModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (category) {
      setName(category.name);
      setDescription(category.description || "");
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !category) {
      return;
    }

    onSave(category.id, name.trim(), description.trim() || undefined);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Editar Categoria
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Edite o nome e a descrição da categoria
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="editCategoryName" className="text-foreground">Nome da Categoria</Label>
            <Input
              id="editCategoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Animações, Modals, etc."
              className="bg-secondary border-border focus:border-primary"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editCategoryDescription" className="text-foreground">
              Descrição <span className="text-muted-foreground text-sm">(opcional)</span>
            </Label>
            <Textarea
              id="editCategoryDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva para que serve essa categoria..."
              className="bg-secondary border-border focus:border-primary resize-none"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border hover:bg-secondary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCategoryModal;