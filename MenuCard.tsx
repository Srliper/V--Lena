import { Plus } from "lucide-react";
import { MenuItem } from "@/data/menuData";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface MenuCardProps {
  item: MenuItem;
}

const MenuCard = ({ item }: MenuCardProps) => {
  const { addItem } = useCart();

  const handleAdd = () => {
    addItem(item);
    toast.success(`${item.name} adicionado ao carrinho!`);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 flex items-start gap-4 hover:shadow-md transition-shadow group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-heading font-bold text-foreground text-sm truncate">{item.name}</h3>
          {item.badge && (
            <span className="flex-shrink-0 text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-semibold">
              {item.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{item.description}</p>
        <div className="flex items-center gap-2">
          {item.isPromo && item.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              R$ {item.originalPrice.toFixed(2)}
            </span>
          )}
          <span className={`font-bold text-sm ${item.isPromo ? "text-accent" : "text-primary"}`}>
            R$ {item.price.toFixed(2)}
          </span>
        </div>
      </div>
      <button
        onClick={handleAdd}
        className="flex-shrink-0 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow hover:opacity-90 transition-opacity group-hover:scale-110 transition-transform"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MenuCard;
