import { useState, useRef, useCallback } from "react";
import { Video, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface VideoDropZoneProps {
    value: string;
    onChange: (url: string) => void;
    className?: string;
}

const VideoDropZone = ({ value, onChange, className = "" }: VideoDropZoneProps) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const uploadFile = async (file: File) => {
        // Accept video files and GIFs
        const validTypes = ["video/mp4", "video/webm", "video/ogg", "image/gif"];
        if (!validTypes.includes(file.type)) {
            toast.error("Por favor, selecione apenas arquivos de vídeo (MP4, WebM, OGG) ou GIF");
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            toast.error("O arquivo deve ter no máximo 50MB");
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
            toast.success("Vídeo/GIF carregado com sucesso!");
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Erro ao carregar o arquivo");
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
        const isGif = value.toLowerCase().endsWith('.gif');

        return (
            <div className={`relative rounded-lg border-2 border-dashed border-border overflow-hidden ${className}`}>
                {isGif ? (
                    <img
                        src={value}
                        alt="GIF Preview"
                        className="w-full h-full object-contain bg-muted/30"
                    />
                ) : (
                    <video
                        src={value}
                        className="w-full h-full object-contain bg-muted/30"
                        muted
                        loop
                        autoPlay
                        playsInline
                    />
                )}
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
                accept="video/mp4,video/webm,video/ogg,image/gif"
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
                    <Video className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm font-medium text-primary">Selecione do computador</span>
                    <span className="text-xs text-muted-foreground">ou arraste aqui</span>
                    <span className="text-xs text-muted-foreground">MP4, WebM, OGG, GIF até 50 MB</span>
                </>
            )}
        </div>
    );
};

export default VideoDropZone;
