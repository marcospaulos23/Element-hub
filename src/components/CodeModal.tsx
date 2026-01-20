import { useState } from "react";
import { UIElement } from "@/hooks/useElements";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Copy } from "lucide-react";
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
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden bg-popover border-border p-0">
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

        {/* Main Content - Code and Image side by side */}
        <div className="flex flex-col lg:flex-row gap-6 p-6">
          {/* Code Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Código do componente</span>
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
            
            <div className="relative rounded-lg bg-code-bg border border-border overflow-hidden">
              <pre className="p-4 overflow-x-auto max-h-[400px]">
                <code className="text-sm font-mono text-foreground/90 leading-relaxed">
                  {element.code}
                </code>
              </pre>
            </div>
          </div>

          {/* Preview Section */}
          <div className="flex-1 min-w-0">
            <div className="mb-3">
              <span className="text-sm font-medium text-muted-foreground">Preview</span>
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted/30">
              {hasPreviewImage ? (
                <img 
                  src={element.preview_image!} 
                  alt={element.name}
                  className="w-full h-full object-contain"
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
