import { useState, useMemo } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Hero from "@/components/Hero";
import ElementCard from "@/components/ElementCard";
import CategoryFilter from "@/components/CategoryFilter";
import CodeModal from "@/components/CodeModal";
import AddElementModal from "@/components/AddElementModal";
import { elements as initialElements, UIElement } from "@/data/elements";


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
          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <Hero />

            {/* Elements Section */}
            <section id="elements" className="pt-4 pb-12 px-4 md:px-8">
              <div className="max-w-7xl mx-auto">
                {/* Category Filter */}
                <div className="mb-10">
                  <CategoryFilter
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                  />
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
