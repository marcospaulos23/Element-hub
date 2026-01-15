import { useState, useMemo } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Hero from "@/components/Hero";
import ElementCard from "@/components/ElementCard";
import CategoryFilter from "@/components/CategoryFilter";
import CodeModal from "@/components/CodeModal";
import AddElementModal from "@/components/AddElementModal";
import { elements as initialElements, UIElement } from "@/data/elements";
import { Menu } from "lucide-react";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedElement, setSelectedElement] = useState<UIElement | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [elements, setElements] = useState<UIElement[]>(initialElements);

  const filteredElements = useMemo(() => {
    if (activeCategory === "Todos") return elements;
    return elements.filter((el) => el.category === activeCategory);
  }, [activeCategory, elements]);

  const handleElementClick = (element: UIElement) => {
    setSelectedElement(element);
    setIsCodeModalOpen(true);
  };

  const handleCloseCodeModal = () => {
    setIsCodeModalOpen(false);
    setTimeout(() => setSelectedElement(null), 200);
  };

  const handleAddElement = (newElement: Omit<UIElement, "id">) => {
    const element: UIElement = {
      ...newElement,
      id: String(Date.now()),
    };
    setElements((prev) => [element, ...prev]);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <AppSidebar onAddElement={() => setIsAddModalOpen(true)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="sticky top-0 z-40 glass border-b border-border">
            <div className="flex items-center gap-4 px-4 py-3">
              <SidebarTrigger className="md:hidden">
                <Menu className="h-5 w-5" />
              </SidebarTrigger>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">Element Hub</span>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <Hero />

            {/* Elements Section */}
            <section id="elements" className="py-12 px-4 md:px-8">
              <div className="max-w-7xl mx-auto">
                {/* Category Filter */}
                <div className="mb-10">
                  <CategoryFilter
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                  />
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      {activeCategory === "Todos" ? "Todos os Elementos" : activeCategory}
                    </h2>
                    <p className="text-muted-foreground mt-1">
                      {filteredElements.length} elemento{filteredElements.length !== 1 ? "s" : ""} encontrado{filteredElements.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Elements Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
                  <div className="text-center py-20 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <p className="text-muted-foreground text-lg mb-2">
                      Nenhum elemento encontrado
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Tente selecionar outra categoria ou adicione um novo elemento
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8 px-4 mt-8">
              <div className="max-w-7xl mx-auto text-center">
                <p className="text-sm text-muted-foreground">
                  © 2025 Element Hub. Feito com ❤️ para desenvolvedores.
                </p>
              </div>
            </footer>
          </main>
        </div>

        {/* Modals */}
        <CodeModal
          element={selectedElement}
          isOpen={isCodeModalOpen}
          onClose={handleCloseCodeModal}
        />
        <AddElementModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAdd={handleAddElement}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
