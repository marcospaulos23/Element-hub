import { UIElement } from "@/hooks/useElements";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ManageElementsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  elements: UIElement[];
  onEditElement: (element: UIElement) => void;
  onDeleteElement: (id: string) => void;
}

const ManageElementsSheet = ({
  isOpen,
  onClose,
  elements,
  onEditElement,
  onDeleteElement,
}: ManageElementsSheetProps) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Gerenciar Elementos</SheetTitle>
          <SheetDescription>
            Edite ou exclua os elementos do seu repositório
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-120px)] mt-6 pr-4">
          <div className="space-y-2">
            {elements.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhum elemento cadastrado
              </p>
            ) : (
              elements.map((element) => (
                <div
                  key={element.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground truncate">
                      {element.name}
                    </h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {element.category}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => {
                        onEditElement(element);
                        onClose();
                      }}
                      className="p-2 hover:bg-primary/20 rounded-lg text-primary transition-colors"
                      title="Editar"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          className="p-2 hover:bg-destructive/20 rounded-lg text-destructive transition-colors"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Excluir elemento?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja excluir "{element.name}"? Esta ação não pode ser desfeita.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDeleteElement(element.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Excluir
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default ManageElementsSheet;
