import { useState, useMemo } from "react";
import Hero from "@/components/Hero";
import ElementCard from "@/components/ElementCard";
import CategoryFilter from "@/components/CategoryFilter";
import CodeModal from "@/components/CodeModal";
import { elements, UIElement } from "@/data/elements";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedElement, setSelectedElement] = useState<UIElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredElements = useMemo(() => {
    if (activeCategory === "Todos") return elements;
    return elements.filter((el) => el.category === activeCategory);
  }, [activeCategory]);

  const handleElementClick = (element: UIElement) => {
    setSelectedElement(element);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedElement(null), 200);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">UI</span>
            </div>
            <span className="font-semibold text-foreground">Elements</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#elements" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Elementos
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sobre
            </a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        <Hero />

        {/* Elements Section */}
        <section id="elements" className="py-16 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* Category Filter */}
            <div className="mb-12">
              <CategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>

            {/* Elements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredElements.map((element) => (
                <ElementCard
                  key={element.id}
                  element={element}
                  onClick={() => handleElementClick(element)}
                />
              ))}
            </div>

            {/* Empty State */}
            {filteredElements.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  Nenhum elemento encontrado nesta categoria.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 UI Elements Repository. Feito com ❤️ para desenvolvedores.
          </p>
        </div>
      </footer>

      {/* Code Modal */}
      <CodeModal
        element={selectedElement}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;
