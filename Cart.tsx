import { useCart } from "@/contexts/CartContext";
import Header from "@/components/Header";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();

  const handleFinalize = () => {
    if (items.length === 0) return;
    const msg = items.map(i => `${i.quantity}x ${i.name}`).join("\n");
    const text = encodeURIComponent(
      `🛒 *Pedido Vó Lena*\n\n${msg}\n\n💰 *Total: R$ ${total.toFixed(2)}*\n\nGostaria de confirmar meu pedido!`
    );
    window.open(`https://wa.me/5511999999999?text=${text}`, "_blank");
    toast.success("Redirecionando para o WhatsApp!");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-6">🛒 Seu Carrinho</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">Seu carrinho está vazio</p>
            <Link to="/" className="inline-flex px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
              Ver Cardápio
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-foreground text-sm">{item.name}</h3>
                    <p className="text-sm text-primary font-bold">R$ {(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                      <Plus className="h-3 w-3" />
                    </button>
                    <button onClick={() => removeItem(item.id)} className="h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center ml-2">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-card rounded-lg border border-border p-5">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground font-semibold">Total</span>
                <span className="font-heading text-2xl font-bold text-primary">R$ {total.toFixed(2)}</span>
              </div>
              <button onClick={handleFinalize} className="w-full py-3 rounded-full bg-accent text-accent-foreground font-bold text-sm shadow-lg hover:opacity-90 transition-opacity">
                Finalizar Pedido via WhatsApp
              </button>
              <button onClick={clearCart} className="w-full py-2 mt-2 text-sm text-muted-foreground hover:text-destructive transition-colors">
                Limpar carrinho
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Cart;
