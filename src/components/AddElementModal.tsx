import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { UIElement, categories } from "@/data/elements";

interface AddElementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (element: Omit<UIElement, "id">) => void;
}

const AddElementModal = ({ isOpen, onClose, onAdd }: AddElementModalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !description || !category || !videoUrl || !code) {
      return;
    }

    onAdd({
      name,
      description,
      category,
      videoUrl,
      code,
    });

    // Reset form
    setName("");
    setDescription("");
    setCategory("");
    setVideoUrl("");
    setCode("");
    onClose();
  };

  const filteredCategories = categories.filter(c => c !== "Todos");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-popover border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" />
            Adicionar Novo Elemento
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha as informações do novo componente UI
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">Nome do Elemento</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Botão Neon"
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
              placeholder="Ex: Botão com efeito de brilho neon animado"
              className="bg-secondary border-border focus:border-primary"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-foreground">Categoria</Label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="bg-secondary border-border">
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Video URL */}
          <div className="space-y-2">
            <Label htmlFor="videoUrl" className="text-foreground">URL do Vídeo</Label>
            <Input
              id="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://exemplo.com/video.mp4"
              className="bg-secondary border-border focus:border-primary"
              required
            />
            <p className="text-xs text-muted-foreground">
              Cole a URL de um vídeo MP4 demonstrando o componente
            </p>
          </div>

          {/* Code */}
          <div className="space-y-2">
            <Label htmlFor="code" className="text-foreground">Código do Componente</Label>
            <Textarea
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="<button className='...'>Meu Botão</button>"
              className="bg-secondary border-border focus:border-primary font-mono text-sm min-h-[150px]"
              required
            />
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
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Elemento
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddElementModal;
