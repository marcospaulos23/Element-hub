import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Plus, Image, X, Sun, ImageOff } from "lucide-react";
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
  const [lightBackground, setLightBackground] = useState(false);
  const [usePreviewImage, setUsePreviewImage] = useState(true);

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
      light_background: lightBackground,
      use_preview_image: usePreviewImage,
    });

    // Reset form
    setName("");
    setDescription("");
    setSelectedCategories([]);
    setCode("");
    setPreviewImage("");
    setLightBackground(false);
    setUsePreviewImage(true);
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
      <DialogContent className="max-w-4xl bg-popover border-border max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:bg-zinc-500 [&::-webkit-scrollbar-thumb]:bg-zinc-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-button]:bg-zinc-500 [&::-webkit-scrollbar-button]:h-3 [&::-webkit-scrollbar-button:vertical:decrement]:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%2352525b%22><path d=%22M12 8l-6 6h12z%22/></svg>')] [&::-webkit-scrollbar-button:vertical:decrement]:bg-center [&::-webkit-scrollbar-button:vertical:decrement]:bg-no-repeat [&::-webkit-scrollbar-button:vertical:increment]:bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22%2352525b%22><path d=%22M12 16l-6-6h12z%22/></svg>')] [&::-webkit-scrollbar-button:vertical:increment]:bg-center [&::-webkit-scrollbar-button:vertical:increment]:bg-no-repeat">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Adicionar Elemento
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha as informações do componente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column - Form Fields */}
            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Título</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Botão Gradient"
                  className="bg-secondary border-border focus:border-primary"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">Descrição</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva o elemento..."
                  className="bg-secondary border-border focus:border-primary"
                  required
                />
              </div>

              {/* Categories - Multiple Selection */}
              <div className="space-y-3">
                <Label className="text-foreground">Categorias / Tags</Label>
                
                {/* Selected Categories Tags */}
                {selectedCategories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCategories.map((cat) => (
                      <span
                        key={cat}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium"
                      >
                        {cat}
                        <button
                          type="button"
                          onClick={() => removeCategory(cat)}
                          className="hover:bg-primary/30 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Category Checkboxes */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-secondary/50 rounded-lg border border-border max-h-[150px] overflow-y-auto">
                  {filteredCategories.map((cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox
                        id={`cat-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={(checked) => handleCategoryToggle(cat, checked as boolean)}
                      />
                      <label
                        htmlFor={`cat-${cat}`}
                        className="text-sm font-medium text-foreground cursor-pointer"
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

              {/* Code */}
              <div className="space-y-2">
                <Label htmlFor="code" className="text-foreground">Código HTML/CSS</Label>
                <Textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="<button>Clique aqui</button>"
                  className="bg-secondary border-border focus:border-primary font-mono text-sm min-h-[140px]"
                  required
                />
              </div>
            </div>

            <div className="space-y-4 overflow-hidden">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-foreground">Preview ao Vivo</Label>
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-muted-foreground" />
                    <Switch
                      checked={lightBackground}
                      onCheckedChange={setLightBackground}
                    />
                    <span className="text-xs text-muted-foreground">Fundo claro</span>
                  </div>
                </div>
                <div className="overflow-hidden rounded-lg border border-border">
                  <CodePreview 
                    code={code} 
                    className="aspect-video min-h-[200px] max-h-[220px]"
                    lightBackground={lightBackground}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  A visualização será atualizada conforme você digita o código
                </p>
              </div>

              {/* Use Preview Image Toggle */}
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border">
                <div className="flex items-center gap-2">
                  <ImageOff className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Usar imagem no preview</span>
                </div>
                <Switch
                  checked={usePreviewImage}
                  onCheckedChange={setUsePreviewImage}
                />
              </div>

              {/* Image Upload Section */}
              <div className="space-y-2">
                <Label className="text-foreground flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Imagem de Pré-visualização (opcional)
                </Label>
                <ImageDropZone
                  value={previewImage}
                  onChange={setPreviewImage}
                  className="aspect-video min-h-[140px]"
                />
                
                {/* URL fallback input */}
                <div className="space-y-1">
                  <Input
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                    placeholder="URL da imagem para mostrar quando não houver hover"
                    className="bg-secondary border-border focus:border-primary text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Para elementos com animação: uma imagem aparece quando o mouse não está em cima
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
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
              disabled={selectedCategories.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Elemento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddElementModal;
