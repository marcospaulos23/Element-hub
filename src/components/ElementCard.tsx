import { UIElement } from "@/data/elements";

interface ElementCardProps {
  element: UIElement;
  onClick: () => void;
}

const ElementCard = ({ element, onClick }: ElementCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-card rounded-xl overflow-hidden cursor-pointer transition-all duration-500 card-glow hover:card-glow-hover animate-fade-in border border-border hover:border-muted-foreground/30"
      style={{ animationDelay: `${parseInt(element.id) * 100}ms` }}
    >
      {/* Video Preview */}
      <div className="relative aspect-video overflow-hidden bg-muted/30">
        <video
          src={element.videoUrl}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-40" />
        
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-foreground/90 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-background ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border">
            {element.category}
          </span>
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1.5 tracking-tight">
          {element.name}
        </h3>
        <p className="text-sm text-muted-foreground font-light leading-relaxed line-clamp-2">
          {element.description}
        </p>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: '0 0 80px -20px rgba(255, 255, 255, 0.15), inset 0 0 60px -30px rgba(255, 255, 255, 0.05)'
        }}
      />
    </div>
  );
};

export default ElementCard;
