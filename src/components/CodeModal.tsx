import { useState } from "react";
import { UIElement } from "@/hooks/useElements";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Copy, X } from "lucide-react";
import CodePreview from "./CodePreview";

interface CodeModalProps {
  element: UIElement | null;
  isOpen: boolean;
  onClose: () => void;
}

const CodeModal = ({ element, isOpen, onClose }: CodeModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!element) return;
    
    await navigator.clipboard.writeText(element.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!element) return null;

  const hasPreviewImage = element.preview_image && element.preview_image.trim() !== "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl bg-popover border-border p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground">
                {element.name}
              </DialogTitle>
              <p className="text-muted-foreground mt-1">{element.description}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content - Code and Preview side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* Code Section */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-semibold text-foreground">Código do componente</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  title="Fechar"
                >
                  <X className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCopy}
                  className="btn-copy flex items-center gap-2 text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copiar código
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="relative rounded-lg bg-code-bg border border-border overflow-hidden h-[280px]">
              <pre className="p-4 overflow-auto h-full w-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-thumb]:bg-zinc-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                <code className="text-sm font-mono text-foreground/90 leading-relaxed whitespace-pre">
                  {element.code}
                </code>
              </pre>
            </div>
          </div>

          {/* Preview Section */}
          <div className="flex flex-col">
            <div className="mb-3">
              <span className="text-sm font-medium text-muted-foreground">Preview</span>
            </div>
            <div className="relative h-[280px] rounded-lg overflow-hidden border border-border bg-zinc-800/50 flex items-center justify-center">
              {hasPreviewImage ? (
                <img 
                  src={element.preview_image!} 
                  alt={element.name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <CodePreview code={element.code} className="w-full h-full" />
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeModal;
