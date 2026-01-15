import { UIElement } from "@/data/elements";

interface ElementCardProps {
  element: UIElement;
  onClick: () => void;
}

const ElementCard = ({ element, onClick }: ElementCardProps) => {
  return (
    <div
      onClick={onClick}
      className="group relative bg-card rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] card-glow hover:card-glow-hover animate-fade-in"
      style={{ animationDelay: `${parseInt(element.id) * 100}ms` }}
    >
      {/* Video Preview */}
      <div className="relative aspect-video overflow-hidden">
        <video
          src={element.videoUrl}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
        
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm">
            <svg className="w-6 h-6 text-primary-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
            {element.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
          {element.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {element.description}
        </p>
      </div>

      {/* Hover border effect */}
      <div className="absolute inset-0 rounded-xl border border-primary/0 group-hover:border-primary/50 transition-colors duration-300 pointer-events-none" />
    </div>
  );
};

export default ElementCard;
