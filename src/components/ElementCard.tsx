import { useState } from "react";
import { UIElement } from "@/hooks/useElements";
import CodePreview from "./CodePreview";

interface ElementCardProps {
  element: UIElement;
  onClick: () => void;
}

const ElementCard = ({ element, onClick }: ElementCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const categories = Array.isArray(element.category) ? element.category : [element.category];
  
  // Only show preview image for elements with "Animações" or "Carregamento" categories
  const isAnimationOrLoading = categories.some(cat => 
    cat.toLowerCase().includes("animaç") || 
    cat.toLowerCase().includes("carregamento") ||
    cat.toLowerCase().includes("loaders") ||
    cat.toLowerCase().includes("loading")
  );
  const hasPreviewImage = isAnimationOrLoading && element.preview_image && element.preview_image.trim() !== "";

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border border-border hover:border-primary/50 animate-fade-in"
      style={{ animationDelay: `${parseInt(element.id) * 100}ms` }}
    >
      {/* Gradient glow effect on hover */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-xl z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, hsl(0 0% 100% / 0.08) 0%, transparent 60%)'
        }}
      />

      {/* Code Preview / Image */}
      <div className="relative aspect-video overflow-hidden bg-muted/30">
        {hasPreviewImage && !isHovered ? (
          <img
            src={element.preview_image!}
            alt={element.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <CodePreview code={element.code} className="w-full h-full" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-40 pointer-events-none" />
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {categories.map((cat, index) => (
            <span 
              key={index}
              className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border font-['Space_Grotesk']"
            >
              {cat}
            </span>
          ))}
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1.5 tracking-tight font-['Space_Grotesk']">
          {element.name}
        </h3>
        <p className="text-sm text-muted-foreground font-normal leading-relaxed line-clamp-2 font-['Space_Grotesk']">
          {element.description}
        </p>
      </div>
    </div>
  );
};

export default ElementCard;
