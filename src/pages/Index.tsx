import { useState, useMemo } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import Hero from "@/components/Hero";
import ElementCard from "@/components/ElementCard";
import CategoryFilter from "@/components/CategoryFilter";
import CodeModal from "@/components/CodeModal";
import AddElementModal from "@/components/AddElementModal";
import AddCategoryModal from "@/components/AddCategoryModal";
import EditElementModal from "@/components/EditElementModal";
import { categories as initialCategories } from "@/data/elements";
import { useElements, UIElement } from "@/hooks/useElements";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedElement, setSelectedElement] = useState<UIElement | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [elementToEdit, setElementToEdit] = useState<UIElement | null>(null);
  const [categories, setCategories] = useState<string[]>(initialCategories);

  const { elements, loading, addElement, updateElement, deleteElement } = useElements();

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

  const handleAddElement = async (newElement: Omit<UIElement, "id">) => {
    await addElement(newElement);
  };

  const handleAddCategory = (categoryName: string) => {
    if (!categories.includes(categoryName)) {
      setCategories((prev) => [...prev, categoryName]);
    }
  };

  const handleDeleteElement = async (id: string) => {
    await deleteElement(id);
  };

  const handleEditElement = (element: UIElement) => {
    setElementToEdit(element);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (id: string, updates: Partial<Omit<UIElement, "id">>) => {
    await updateElement(id, updates);
    setIsEditModalOpen(false);
    setElementToEdit(null);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <AppSidebar onAddCategory={() => setIsAddCategoryModalOpen(true)} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header with Add Element Button */}
          <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
            <div className="flex items-center justify-end px-4 py-3">
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Elemento
              </Button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
            <Hero />

            {/* Elements Section */}
            <section id="elements" className="pt-4 pb-12 px-4 md:px-8">
              <div className="max-w-7xl mx-auto">
                {/* Category Filter */}
                <div className="mb-10">
                  <CategoryFilter
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                  />
                </div>

                {/* Loading State */}
                {loading && (
                  <div className="flex items-center justify-center py-20">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                {/* Elements Grid */}
                {!loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredElements.map((element) => (
                      <ElementCard
                        key={element.id}
                        element={element}
                        onClick={() => handleElementClick(element)}
                      />
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!loading && filteredElements.length === 0 && (
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
          categories={categories}
        />
        <AddCategoryModal
          isOpen={isAddCategoryModalOpen}
          onClose={() => setIsAddCategoryModalOpen(false)}
          onAdd={handleAddCategory}
        />
        <EditElementModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setElementToEdit(null);
          }}
          onSave={handleSaveEdit}
          element={elementToEdit}
          categories={categories}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
