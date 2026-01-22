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
import EditCategoryModal from "@/components/EditCategoryModal";
import ManageElementsSheet from "@/components/ManageElementsSheet";
import ManageCategoriesSheet from "@/components/ManageCategoriesSheet";
import { useElements, UIElement } from "@/hooks/useElements";
import { useCategories, Category } from "@/hooks/useCategories";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [selectedElement, setSelectedElement] = useState<UIElement | null>(null);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManageSheetOpen, setIsManageSheetOpen] = useState(false);
  const [elementToEdit, setElementToEdit] = useState<UIElement | null>(null);
  const [isManageCategoriesSheetOpen, setIsManageCategoriesSheetOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<Category | null>(null);

  const { elements, loading, addElement, updateElement, deleteElement } = useElements();
  const { categories: categoriesData, addCategory, updateCategory, deleteCategory, reorderCategories, toggleCategoryVisibility } = useCategories();

  // Map visible categories to string array with "Todos" as first item
  const categoryNames = useMemo(() => {
    return ["Todos", ...categoriesData.filter(c => c.is_visible).map(c => c.name)];
  }, [categoriesData]);

  // Group elements by category, sorted by creation date (oldest first, newest last)
  const elementsByCategory = useMemo(() => {
    const grouped: Record<string, UIElement[]> = {};
    
    // Initialize all categories (except "Todos")
    categoriesData.forEach(cat => {
      grouped[cat.name] = [];
    });
    
    // Sort elements by created_at ascending (oldest first, newest last)
    const sortedElements = [...elements].sort((a, b) => {
      const dateA = new Date((a as any).created_at || 0).getTime();
      const dateB = new Date((b as any).created_at || 0).getTime();
      return dateA - dateB;
    });
    
    // Distribute elements into their categories
    sortedElements.forEach(el => {
      const cats = Array.isArray(el.category) ? el.category : [el.category];
      cats.forEach(catName => {
        if (grouped[catName]) {
          // Avoid duplicates in the same category
          if (!grouped[catName].find(e => e.id === el.id)) {
            grouped[catName].push(el);
          }
        }
      });
    });
    
    return grouped;
  }, [elements, categoriesData]);

  // Filter categories to display based on active filter (only visible categories)
  const categoriesToDisplay = useMemo(() => {
    if (activeCategory === "Todos") {
      // Show all visible categories that have elements
      return categoriesData.filter(cat => cat.is_visible && elementsByCategory[cat.name]?.length > 0);
    }
    // Show only the selected category if visible
    return categoriesData.filter(cat => cat.is_visible && cat.name === activeCategory && elementsByCategory[cat.name]?.length > 0);
  }, [activeCategory, categoriesData, elementsByCategory]);

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

  const handleAddCategory = async (categoryName: string, description?: string) => {
    await addCategory(categoryName, description);
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

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleSaveCategoryEdit = async (id: string, name: string, description?: string) => {
    await updateCategory(id, name, description);
    setIsEditCategoryModalOpen(false);
    setCategoryToEdit(null);
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id);
  };

  const handleReorderCategories = async (fromIndex: number, toIndex: number) => {
    await reorderCategories(fromIndex, toIndex);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Sidebar */}
        <AppSidebar 
          onAddCategory={() => setIsAddCategoryModalOpen(true)} 
          onManageCategories={() => setIsManageCategoriesSheetOpen(true)}
          onManageElements={() => setIsManageSheetOpen(true)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header with Add Element Button */}
          <header className="sticky top-0 z-40">
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
          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <Hero />

            {/* Elements Section */}
            <section id="elements" className="pt-20 pb-12 px-4 md:px-8">
              <div className="max-w-7xl mx-auto">
                {/* Category Filter */}
                <div className="mb-16">
                  <CategoryFilter
                    categories={categoryNames}
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

                {/* Elements Grouped by Category */}
                {!loading && categoriesToDisplay.length > 0 && (
                  <div className="space-y-16">
                    {categoriesToDisplay.map((category) => (
                      <div key={category.id}>
                        {/* Category Title and Description */}
                        <div className="mb-6 border-b border-border pb-3">
                          <h2 className="text-2xl font-semibold text-foreground">
                            {category.name}
                          </h2>
                          {category.description && (
                            <p className="text-muted-foreground text-sm mt-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Elements Grid for this Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                          {elementsByCategory[category.name]?.map((element) => (
                            <ElementCard
                              key={element.id}
                              element={element}
                              onClick={() => handleElementClick(element)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!loading && categoriesToDisplay.length === 0 && (
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
          categories={categoryNames.filter(c => c !== "Todos")}
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
          categories={categoryNames.filter(c => c !== "Todos")}
        />
        <ManageElementsSheet
          isOpen={isManageSheetOpen}
          onClose={() => setIsManageSheetOpen(false)}
          elements={elements}
          onEditElement={handleEditElement}
          onDeleteElement={handleDeleteElement}
        />
        <ManageCategoriesSheet
          isOpen={isManageCategoriesSheetOpen}
          onClose={() => setIsManageCategoriesSheetOpen(false)}
          categories={categoriesData}
          onEditCategory={handleEditCategory}
          onDeleteCategory={handleDeleteCategory}
          onReorderCategories={handleReorderCategories}
          onToggleVisibility={toggleCategoryVisibility}
        />
        <EditCategoryModal
          isOpen={isEditCategoryModalOpen}
          onClose={() => {
            setIsEditCategoryModalOpen(false);
            setCategoryToEdit(null);
          }}
          onSave={handleSaveCategoryEdit}
          category={categoryToEdit}
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;
