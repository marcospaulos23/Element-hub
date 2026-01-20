import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Image, X } from "lucide-react";
import { UIElement } from "@/hooks/useElements";
import CodePreview from "./CodePreview";
import ImageDropZone from "./ImageDropZone";

interface AddElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (element: Omit<UIElement, "id">) => void;
  categories: string[];
}

const AddElementModal = ({ isOpen, onClose, onAdd, categories }: AddElementModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || selectedCategories.length === 0 || !code) {
      return;
    }

    onAdd({
      name,
      description,
      category: selectedCategories,
      code,
      preview_image: previewImage || null,
    });

    // Reset form
    setName("");
    setDescription("");
    setSelectedCategories([]);
    setCode("");
    setPreviewImage("");
    onClose();
  };

  const filteredCategories = categories.filter(c => c !== "Todos");

  const handleCategoryToggle = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(c => c !== category));
    }
  };

  const removeCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-popover border-border h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Adicionar Elemento
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha as informações do componente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
            {/* Left Column - Form Fields */}
            <div className="flex flex-col gap-3 min-h-0">
              {/* Name */}
              <div className="space-y-1 flex-shrink-0">
                <Label htmlFor="name" className="text-foreground text-sm">Título</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Botão Gradient"
                  className="bg-secondary border-border focus:border-primary h-9"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-1 flex-shrink-0">
                <Label htmlFor="description" className="text-foreground text-sm">Descrição</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o elemento..."
                  className="bg-secondary border-border focus:border-primary h-9"
                  required
                />
              </div>

              {/* Categories - Multiple Selection */}
              <div className="space-y-1 flex-shrink-0">
                <Label className="text-foreground text-sm">Categorias</Label>
                
                {/* Category Checkboxes - Grid layout */}
                <div className="grid grid-cols-2 gap-1.5 p-2 bg-secondary/50 rounded-lg border border-border">
                  {filteredCategories.map((cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={(checked) => handleCategoryToggle(cat, checked as boolean)}
                        className="h-4 w-4"
                      />
                      <label
                        htmlFor={`cat-${cat}`}
                        className="text-xs font-medium text-foreground cursor-pointer"
                      >
                        {cat}
                      </label>
                    </div>
                  ))}
                </div>
                {selectedCategories.length === 0 && (
                  <p className="text-xs text-muted-foreground">Selecione pelo menos uma categoria</p>
                )}
              </div>

              {/* Code - Takes remaining space */}
              <div className="flex flex-col flex-1 min-h-0 space-y-1">
                <Label htmlFor="code" className="text-foreground text-sm flex-shrink-0">Código HTML/CSS</Label>
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="<button>Clique aqui</button>"
                  className="bg-secondary border-border focus:border-primary font-mono text-sm flex-1 min-h-[100px] resize-none"
                  required
                />
              </div>
            </div>

            {/* Right Column - Live Preview and Image Upload */}
            <div className="flex flex-col gap-3 min-h-0">
              {/* Live Preview */}
              <div className="flex flex-col flex-1 min-h-0 space-y-1">
                <Label className="text-foreground text-sm flex-shrink-0">Preview ao Vivo</Label>
                <div className="flex-1 min-h-[120px] overflow-hidden rounded-lg border border-border">
                  <CodePreview 
                    code={code} 
                    className="w-full h-full"
                  />
                </div>
                <p className="text-xs text-muted-foreground flex-shrink-0">
                  A visualização será atualizada conforme você digita o código
                </p>
              </div>

              {/* Image Upload Section */}
              <div className="flex flex-col flex-1 min-h-0 space-y-1">
                <Label className="text-foreground text-sm flex items-center gap-2 flex-shrink-0">
                  <Image className="w-4 h-4" />
                  Imagem de Pré-visualização (opcional)
                </Label>
                <ImageDropZone
                  value={previewImage}
                  onChange={setPreviewImage}
                  className="flex-1 min-h-[100px]"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-4 flex-shrink-0">
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
              disabled={selectedCategories.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddElementModal;
