import { UIElement } from "@/data/elements";
import CodePreview from "./CodePreview";

interface ElementCardProps {
  element: UIElement;
  onClick: () => void;
}

const ElementCard = ({ element, onClick }: ElementCardProps) => {
  return (
    <div
      onClick={onClick}
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

      {/* Code Preview */}
      <div className="relative aspect-video overflow-hidden bg-muted/30">
        <CodePreview code={element.code} className="w-full h-full" pauseOnIdle />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-40 pointer-events-none" />
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border font-['Space_Grotesk']">
            {element.category}
          </span>
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
