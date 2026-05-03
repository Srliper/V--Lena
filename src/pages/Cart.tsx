import { useCart } from "@/contexts/CartContext";
import { PaymentMethod, useOrders } from "@/contexts/OrderContext";
import Header from "@/components/Header";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const { createOrder } = useOrders();
  const [submitting, setSubmitting] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [changeFor, setChangeFor] = useState("");
  const deliveryFee = 6;
  const grandTotal = total + deliveryFee;

  const handleFinalize = async () => {
    if (items.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim() || !address.trim() || !neighborhood.trim()) {
      toast.error("Preencha nome, telefone e endereco para entregar.");
      return;
    }

    const itemsText = items.map(i => `${i.quantity}x ${i.name}`).join("\n");
    const paymentText =
      paymentMethod === "pix"
        ? "PIX"
        : paymentMethod === "cartao"
          ? "Cartao na entrega"
          : `Dinheiro (troco para R$ ${Number(changeFor || 0).toFixed(2)})`;

    try {
      setSubmitting(true);
      const order = await createOrder({
        customerName,
        customerPhone,
        address,
        neighborhood,
        reference,
        notes,
        paymentMethod,
        changeFor: paymentMethod === "dinheiro" ? Number(changeFor || 0) : undefined,
        itemsSummary: itemsText,
        total: grandTotal,
      });

      const text = encodeURIComponent(
        `*NOVO PEDIDO DELIVERY* (${order.id})\n\n` +
          `*Cliente:* ${customerName}\n` +
          `*Telefone:* ${customerPhone}\n` +
          `*Endereco:* ${address}\n` +
          `*Bairro:* ${neighborhood}\n` +
          `*Referencia:* ${reference || "-"}\n\n` +
          `*Itens:*\n${itemsText}\n\n` +
          `*Subtotal:* R$ ${total.toFixed(2)}\n` +
          `*Taxa entrega:* R$ ${deliveryFee.toFixed(2)}\n` +
          `*Total:* R$ ${grandTotal.toFixed(2)}\n\n` +
          `*Pagamento:* ${paymentText}\n` +
          `*Observacoes:* ${notes || "-"}`
      );
      window.open(`https://wa.me/5511999999999?text=${text}`, "_blank");
      clearCart();
      toast.success("Pedido enviado para o fornecedor! Agora e so aguardar a entrega.");
    } catch (error) {
      console.error(error);
      toast.error("Nao foi possivel criar o pedido. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
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
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Dados para entrega</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <input
                  type="text"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  placeholder="Nome completo"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  placeholder="Telefone com WhatsApp"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="Rua e numero"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm md:col-span-2"
                />
                <input
                  type="text"
                  value={neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
                  placeholder="Bairro"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
                <input
                  type="text"
                  value={reference}
                  onChange={e => setReference(e.target.value)}
                  placeholder="Referencia (opcional)"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                />
              </div>

              <h3 className="font-semibold text-foreground text-sm mb-2">Pagamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                <button
                  onClick={() => setPaymentMethod("pix")}
                  className={`rounded-lg border px-3 py-2 text-sm ${paymentMethod === "pix" ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
                >
                  PIX
                </button>
                <button
                  onClick={() => setPaymentMethod("cartao")}
                  className={`rounded-lg border px-3 py-2 text-sm ${paymentMethod === "cartao" ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
                >
                  Cartao na entrega
                </button>
                <button
                  onClick={() => setPaymentMethod("dinheiro")}
                  className={`rounded-lg border px-3 py-2 text-sm ${paymentMethod === "dinheiro" ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
                >
                  Dinheiro
                </button>
              </div>
              {paymentMethod === "dinheiro" && (
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={changeFor}
                  onChange={e => setChangeFor(e.target.value)}
                  placeholder="Troco para quanto? Ex: 100"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mb-4"
                />
              )}
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Observacoes do pedido (sem cebola, retirar pimenta, etc.)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mb-4 min-h-20"
              />

              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground font-semibold">Subtotal</span>
                <span className="font-heading text-xl font-bold text-primary">R$ {total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground font-semibold">Taxa de entrega</span>
                <span className="font-heading text-lg font-bold text-foreground">R$ {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 border-t border-border pt-3">
                <span className="text-foreground font-semibold">Total final</span>
                <span className="font-heading text-2xl font-bold text-primary">R$ {grandTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleFinalize}
                disabled={submitting}
                className="w-full py-3 rounded-full bg-accent text-accent-foreground font-bold text-sm shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting ? "Enviando pedido..." : "Confirmar Delivery e Enviar para a Loja"}
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
