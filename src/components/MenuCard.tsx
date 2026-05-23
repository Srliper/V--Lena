import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { MenuItem, menuItemNeedsModal } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { MenuCustomizeDialog } from "@/components/MenuCustomizeDialog";
import type { CartSelections } from "@/lib/cartLine";

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard = ({ item }: MenuCardProps) => {
  const { addLine } = useCart();
  const [open, setOpen] = useState(false);

  const needsModal = menuItemNeedsModal(item);

  const priceLabel = useMemo(() => {
    if (item.sizes?.length) {
      const min = Math.min(...item.sizes.map(s => s.price));
      return { prefix: "A partir de ", value: min };
    }
    let base = item.price;
    if (item.variants?.length) {
      const minV = Math.min(...item.variants.map(v => v.priceAddon));
      base += minV;
    }
    return { prefix: "", value: base };
  }, [item]);

  const handlePlus = () => {
    if (needsModal) {
      setOpen(true);
      return;
    }
    try {
      addLine(item, {});
      toast.success(`${item.name} adicionado ao carrinho!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Nao foi possivel adicionar.");
    }
  };

  const handleConfirm = (selections: CartSelections) => {
    try {
      addLine(item, selections);
      toast.success(`${item.name} adicionado ao carrinho!`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Nao foi possivel adicionar.");
    }
  };

  return (
    <>
      <div className="bg-card/95 rounded-xl border border-border/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col sm:flex-row group backdrop-blur-[1px]">
        {item.image ? (
          <div className="relative sm:w-36 h-36 sm:h-auto flex-shrink-0 bg-gradient-to-br from-amber-100/40 to-orange-200/30">
            <img
              src={item.image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-black/5" />
          </div>
        ) : null}
        <div className="flex-1 min-w-0 p-4 flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading font-bold text-foreground text-sm leading-tight">{item.name}</h3>
              {item.badge && (
                <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
                  {item.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
            <div className="flex items-center gap-2 flex-wrap">
              {item.isPromo && item.originalPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  R$ {item.originalPrice.toFixed(2)}
                </span>
              )}
              <span className={`font-bold text-sm ${item.isPromo ? "text-accent" : "text-primary"}`}>
                {priceLabel.prefix}R$ {priceLabel.value.toFixed(2)}
              </span>
              {needsModal ? (
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Personalize</span>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            onClick={handlePlus}
            className="flex-shrink-0 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow hover:opacity-90 transition-opacity group-hover:scale-105 transition-transform"
            aria-label={`Adicionar ${item.name}`}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {needsModal ? (
        <MenuCustomizeDialog item={item} open={open} onOpenChange={setOpen} onConfirm={handleConfirm} />
      ) : null}
    </>
  );
};

export default MenuCard;
