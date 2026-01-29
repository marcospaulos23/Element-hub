import { useState, memo } from "react";
import { UIElement } from "@/hooks/useElements";
import CodePreview from "./CodePreview";
import { Sparkles } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

interface ElementCardProps {
  element: UIElement;
  onClick: () => void;
}

const ElementCard = ({ element, onClick }: ElementCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cardRef, isVisible] = useIntersectionObserver<HTMLDivElement>({
    rootMargin: "200px", // Start loading 200px before entering viewport
    freezeOnceVisible: true, // Keep loaded once visible
  });

  const allCategories = Array.isArray(element.category) ? element.category : [element.category];
  
  // Check if element has animation category (to show as characteristic badge)
  const isAnimated = allCategories.some(cat => 
    cat.toLowerCase().includes("animaç") || 
    cat.toLowerCase().includes("animac")
  );
  
  // Filter out animation categories from display - they'll show as a badge instead
  const categories = allCategories.filter(cat => 
    !cat.toLowerCase().includes("animaç") && 
    !cat.toLowerCase().includes("animac")
  );
  
  // Always show live preview - no static image fallback
  
  // Check if this element needs full container scaling (Kamui, Fundo 3D, Flow Background)
  const needsFullScale = element.name.toLowerCase().includes("kamui") || 
                         element.name.toLowerCase().includes("fundo 3d") ||
                         element.name.toLowerCase().includes("flow");
  
  // Use light background from element property
  const hasLightBackground = element.light_background === true;

  const previewContainerBg = hasLightBackground ? "bg-primary-foreground" : "bg-muted/30";

  return (
    <div
      ref={cardRef}
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
      <div className={`relative aspect-[16/10] overflow-hidden ${previewContainerBg}`}>
        {/* Skeleton placeholder while not visible */}
        {!isVisible && (
          <div className="absolute inset-0 bg-muted/50 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-muted-foreground/20 border-t-muted-foreground/60 animate-spin" />
          </div>
        )}
        
        {/* Only render CodePreview when visible in viewport */}
        {isVisible && (
          <div className="absolute inset-0">
            <CodePreview code={element.code} className="w-full h-full" fillContainer={needsFullScale} lightBackground={hasLightBackground} />
          </div>
        )}
        
        {!hasLightBackground && (
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-40 pointer-events-none" />
        )}
        
        {/* Animated badge indicator */}
        {isAnimated && (
          <div className="absolute top-2 right-2 z-20">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/90 text-primary-foreground text-xs font-medium backdrop-blur-sm">
              <Sparkles className="w-3 h-3" />
              Animado
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          {categories.map((cat, index) => (
            <span 
              key={index}
              className="text-[10px] font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border font-['Space_Grotesk']"
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

export default memo(ElementCard);
