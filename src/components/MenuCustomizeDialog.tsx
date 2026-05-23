import { useEffect, useState } from "react";
import type { MenuItem } from "@/data/menuData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CartSelections } from "@/lib/cartLine";
import { computeCartLine } from "@/lib/cartLine";

interface MenuCustomizeDialogProps {
  item: MenuItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selections: CartSelections) => void;
}

export function MenuCustomizeDialog({ item, open, onOpenChange, onConfirm }: MenuCustomizeDialogProps) {
  const [sizeId, setSizeId] = useState<string | undefined>(item.sizes?.[0]?.id);
  const [variantId, setVariantId] = useState<string | undefined>(item.variants?.[0]?.id);
  const [extraIds, setExtraIds] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setSizeId(item.sizes?.[0]?.id);
    setVariantId(item.variants?.[0]?.id);
    setExtraIds([]);
  }, [open, item]);

  const toggleExtra = (id: string) => {
    setExtraIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  let previewPrice = item.price;
  try {
    previewPrice = computeCartLine(item, { sizeId, variantId, extraIds }).unitPrice;
  } catch {
    previewPrice = item.price;
  }

  const handleAdd = () => {
    onConfirm({ sizeId, variantId, extraIds });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading pr-6">{item.name}</DialogTitle>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {item.sizes && item.sizes.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Volume / embalagem</p>
              <div className="grid grid-cols-2 gap-2">
                {item.sizes.map(s => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSizeId(s.id)}
                    className={`rounded-lg border px-2 py-2 text-left text-xs leading-snug ${
                      sizeId === s.id ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    <span className="font-semibold block">{s.label}</span>
                    <span className="text-muted-foreground">R$ {s.price.toFixed(2)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.variants && item.variants.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">
                {item.id === "b15" ? "Com ou sem açúcar" : item.id === "b2" ? "Com ou sem gás" : "Opção"}
              </p>
              <div className="flex flex-col gap-2">
                {item.variants.map(v => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setVariantId(v.id)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm ${
                      variantId === v.id ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    {v.label}
                    {v.priceAddon > 0 ? (
                      <span className="text-muted-foreground"> (+R$ {v.priceAddon.toFixed(2)})</span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          )}

          {item.extras && item.extras.length > 0 && (
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Adicionais</p>
              <div className="flex flex-wrap gap-2">
                {item.extras.map(ex => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => toggleExtra(ex.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                      extraIds.includes(ex.id) ? "border-primary bg-primary/10 text-primary" : "border-border"
                    }`}
                  >
                    {ex.label} (+R$ {ex.price.toFixed(2)})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex-1 text-sm text-muted-foreground">
            Unidade: <span className="font-bold text-primary">R$ {previewPrice.toFixed(2)}</span>
          </div>
          <Button type="button" onClick={handleAdd}>
            Adicionar ao carrinho
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
