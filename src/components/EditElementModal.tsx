import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Pencil, Image, X, Sun, Wand2 } from "lucide-react";
import { UIElement } from "@/hooks/useElements";
import CodePreview from "./CodePreview";
import ImageDropZone from "./ImageDropZone";
import { convertJsxToHtml, looksLikeJsx } from "@/lib/jsxToHtml";
import { toast } from "@/hooks/use-toast";

interface EditElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Omit<UIElement, "id">>) => void;
  element: UIElement | null;
  categories: string[];
}

const EditElementModal = ({ isOpen, onClose, onSave, element, categories }: EditElementModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [code, setCode] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [lightBackground, setLightBackground] = useState(false);

  useEffect(() => {
    if (element) {
      setName(element.name);
      setDescription(element.description);
      const cats = Array.isArray(element.category) ? element.category : [element.category];
      setSelectedCategories(cats);
      setCode(element.code);
      setPreviewImage(element.preview_image || "");
      setLightBackground(element.light_background || false);
    }
  }, [element]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || selectedCategories.length === 0 || !code || !element) {
      return;
    }

    onSave(element.id, {
      name,
      description,
      category: selectedCategories,
      code,
      preview_image: previewImage || null,
      light_background: lightBackground,
    });

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

  if (!element) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" />
            Editar Elemento
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Edite as informações do componente
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column - Form Fields */}
            <div className="space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-foreground">Título</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Botão Gradient"
                  className="bg-secondary border-border focus:border-primary"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-foreground">Descrição</Label>
                <Input
                  id="edit-description"
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
                        id={`edit-cat-${cat}`}
                        checked={selectedCategories.includes(cat)}
                        onCheckedChange={(checked) => handleCategoryToggle(cat, checked as boolean)}
                      />
                      <label
                        htmlFor={`edit-cat-${cat}`}
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-code" className="text-foreground">Código HTML/CSS</Label>
                  {looksLikeJsx(code) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-primary hover:text-primary"
                      onClick={() => {
                        const { html, wasConverted } = convertJsxToHtml(code);
                        if (wasConverted) {
                          setCode(html);
                          toast({
                            title: "Código convertido!",
                            description: "JSX/React foi convertido para HTML puro.",
                          });
                        }
                      }}
                    >
                      <Wand2 className="w-3 h-3" />
                      Converter JSX → HTML
                    </Button>
                  )}
                </div>
                <Textarea
                  id="edit-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="<button>Clique aqui</button>"
                  className="bg-secondary border-border focus:border-primary font-mono text-sm min-h-[140px]"
                  required
                />
                {looksLikeJsx(code) && (
                  <p className="text-xs text-amber-500">
                    ⚠️ Código parece ser JSX/React. Clique em "Converter" para transformar em HTML.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column - Live Preview and Image Upload */}
            <div className="space-y-4">
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
                  O preview será atualizado conforme você digita o código
                </p>
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
              <Pencil className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditElementModal;
