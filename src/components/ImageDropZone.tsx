import { useState, useRef, useCallback } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ImageDropZoneProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

const ImageDropZone = ({ value, onChange, className = "" }: ImageDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Por favor, selecione apenas arquivos de imagem");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("O arquivo deve ter no máximo 10MB");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("element-previews")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("element-previews")
        .getPublicUrl(fileName);

      onChange(publicUrl);
      toast.success("Imagem carregada com sucesso!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Erro ao carregar a imagem");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  if (value) {
    return (
      <div className={`relative rounded-lg border-2 border-dashed border-border overflow-hidden ${className}`}>
        <img
          src={value}
          alt="Preview"
          className="w-full h-full object-contain bg-muted/30"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center gap-2 p-6
        rounded-lg border-2 border-dashed cursor-pointer
        transition-colors
        ${isDragging 
          ? "border-primary bg-primary/10" 
          : "border-border hover:border-muted-foreground hover:bg-muted/30"
        }
        ${className}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      {isUploading ? (
        <>
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-sm text-muted-foreground">Carregando...</span>
        </>
      ) : (
        <>
          <ImagePlus className="w-8 h-8 text-muted-foreground" />
          <span className="text-sm font-medium text-primary">Selecione do computador</span>
          <span className="text-xs text-muted-foreground">ou arraste aqui</span>
          <span className="text-xs text-muted-foreground">PNG, JPG até 10 MB</span>
        </>
      )}
    </div>
  );
};

export default ImageDropZone;
