import { useCart } from "@/contexts/CartContext";
import { PaymentMethod, useOrders } from "@/contexts/OrderContext";
import Header from "@/components/Header";
import { setPendingRateOrderId } from "@/lib/pendingFeedback";
import { Minus, Plus, Trash2, ShoppingBag, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { buildStoreWhatsAppUrl } from "@/lib/whatsapp";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import { fetchCep } from "@/lib/viacep";
import { freightFromCepData } from "@/lib/freight";
import { FRETE_FALLBACK } from "@/lib/storeConfig";

const API_BASE_URL = getApiBaseUrl();

const Cart = () => {
  const { items, updateQuantity, removeLine, clearCart, total } = useCart();
  const { createOrder } = useOrders();
  const [submitting, setSubmitting] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<"entrega" | "online_mp">("entrega");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [cepInput, setCepInput] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("pix");
  const [changeFor, setChangeFor] = useState("");
  const [cepBusy, setCepBusy] = useState(false);
  const [cepInfo, setCepInfo] = useState<Awaited<ReturnType<typeof fetchCep>>>(null);
  const cepDigits = cepInput.replace(/\D/g, "");

  const { fee: deliveryFee, label: freightLabel } = useMemo(
    () =>
      cepDigits.length === 8
        ? freightFromCepData(cepInfo, cepDigits)
        : { fee: FRETE_FALLBACK, label: "Informe o CEP para calcular" },
    [cepInfo, cepDigits],
  );

  const grandTotal = total + deliveryFee;

  const lookupCep = async () => {
    if (cepDigits.length !== 8) {
      toast.error("Digite o CEP com 8 digitos.");
      return;
    }
    setCepBusy(true);
    try {
      const data = await fetchCep(cepDigits);
      setCepInfo(data);
      if (!data) toast.error("CEP nao encontrado.");
      else {
        toast.success("CEP localizado!");
        if (data.logradouro) setAddress(a => (a.trim() ? a : data.logradouro!));
        if (data.bairro) setNeighborhood(b => (b.trim() ? b : data.bairro!));
      }
    } finally {
      setCepBusy(false);
    }
  };

  const handleFinalize = async () => {
    if (items.length === 0) return;
    if (cepDigits.length !== 8) {
      toast.error("Informe um CEP valido (8 digitos) para calcular o frete.");
      return;
    }
    if (!customerName.trim() || !customerPhone.trim() || !address.trim() || !neighborhood.trim()) {
      toast.error("Preencha nome, telefone e endereco para entregar.");
      return;
    }

    if (checkoutMode === "online_mp") {
      const em = customerEmail.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
        toast.error("Informe um e-mail valido para o recibo do Mercado Pago.");
        return;
      }
    }

    const itemsText = items.map(i => `${i.quantity}x ${i.displayName}`).join("\n");
    const paymentMethodOrder =
      checkoutMode === "online_mp" ? ("online_mercado" as const) : paymentMethod;

    const paymentText =
      checkoutMode === "online_mp"
        ? "Online Mercado Pago (PIX ou cartão)"
        : paymentMethod === "pix"
          ? "PIX na entrega"
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
        reference: [reference, cepDigits ? `CEP ${cepDigits}` : "", freightLabel].filter(Boolean).join(" | "),
        notes,
        paymentMethod: paymentMethodOrder,
        changeFor: paymentMethod === "dinheiro" && checkoutMode === "entrega" ? Number(changeFor || 0) : undefined,
        itemsSummary: itemsText,
        total: grandTotal,
      });

      const message =
        `🛵 *NOVO PEDIDO — Lanchonete Vó Lena*\n` +
        `Pedido: \`${order.id}\`\n\n` +
        `👤 *Cliente:* ${customerName}\n` +
        `📱 *WhatsApp:* ${customerPhone}\n` +
        `📍 *Endereço:* ${address}\n` +
        `🏘️ *Bairro:* ${neighborhood}\n` +
        `📌 *Referência:* ${reference || "—"}\n` +
        `📮 *CEP:* ${cepDigits}\n` +
        `🚚 *Frete:* ${freightLabel}\n\n` +
        `📝 *Itens:*\n${itemsText}\n\n` +
        `💰 *Subtotal:* R$ ${total.toFixed(2)}\n` +
        `🚚 *Taxa entrega:* R$ ${deliveryFee.toFixed(2)}\n` +
        `✅ *Total:* R$ ${grandTotal.toFixed(2)}\n\n` +
        `💳 *Pagamento:* ${paymentText}\n` +
        `📋 *Observações:* ${notes || "—"}\n\n` +
        `_Mensagem gerada pelo site — confirme horário de entrega com o cliente._\n\n` +
        `⭐ Quando receber, avalie em: ${typeof window !== "undefined" ? window.location.origin : ""}/avaliar/${order.id}`;

      if (checkoutMode === "online_mp") {
        const prefRes = await fetch(`${API_BASE_URL}/api/payments/mercadopago/preference`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: order.id,
            customerName,
            customerEmail: customerEmail.trim(),
            deliveryFee,
            items: items.map(i => ({
              title: i.displayName.slice(0, 256),
              quantity: i.quantity,
              unit_price: i.unitPrice,
            })),
            itemsSummaryNote: `${itemsText} — total R$ ${grandTotal.toFixed(2)}`,
          }),
        });

        let data: { ok?: boolean; checkout_url?: string; error?: string } = {};
        try {
          data = await prefRes.json();
        } catch {
          data = {};
        }

        if (!prefRes.ok || !data.ok || !data.checkout_url) {
          toast.error(
            typeof data.error === "string" ? data.error : "Pagamento online indisponivel.",
          );
          return;
        }

        sessionStorage.setItem(
          "volena_mp_return",
          JSON.stringify({ waUrl: buildStoreWhatsAppUrl(message) }),
        );
        setPendingRateOrderId(order.id);
        clearCart();
        window.location.href = data.checkout_url;
        return;
      }

      setPendingRateOrderId(order.id);
      window.open(buildStoreWhatsAppUrl(message), "_blank");
      clearCart();
      toast.success("Pedido enviado! Quando receber, avalie no site (5 estrelas).", {
        duration: 6000,
      });
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
                <div key={item.cartLineId} className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
                  {item.image ? (
                    <img src={item.image} alt="" className="h-14 w-14 rounded-md object-cover flex-shrink-0" />
                  ) : (
                    <div className="h-14 w-14 rounded-md bg-secondary flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading font-bold text-foreground text-sm leading-snug">{item.displayName}</h3>
                    <p className="text-sm text-primary font-bold">
                      R$ {(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartLineId, item.quantity - 1)}
                      className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center font-semibold text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.cartLineId, item.quantity + 1)}
                      className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeLine(item.cartLineId)}
                      className="h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center ml-2"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-card rounded-lg border border-border p-5">
              <h2 className="font-heading text-lg font-bold text-foreground mb-4">Dados para entrega</h2>

              <div className="mb-4">
                <p className="text-xs font-semibold text-foreground mb-1">CEP (frete)</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={9}
                    value={cepInput}
                    onChange={e => {
                      const d = e.target.value.replace(/\D/g, "").slice(0, 8);
                      setCepInput(d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d);
                    }}
                    placeholder="00000-000"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                  />
                  <button
                    type="button"
                    disabled={cepBusy || cepDigits.length !== 8}
                    onClick={() => lookupCep()}
                    className="rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-50 inline-flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    {cepBusy ? "..." : "Buscar"}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{freightLabel}</p>
              </div>

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                <button
                  type="button"
                  onClick={() => setCheckoutMode("entrega")}
                  className={`rounded-lg border px-3 py-3 text-sm text-left leading-snug ${
                    checkoutMode === "entrega" ? "border-primary bg-primary/10 text-primary" : "border-border"
                  }`}
                >
                  <span className="font-semibold block">Na entrega</span>
                  <span className="text-xs text-muted-foreground">PIX / cartão / dinheiro ao receber</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCheckoutMode("online_mp")}
                  className={`rounded-lg border px-3 py-3 text-sm text-left leading-snug ${
                    checkoutMode === "online_mp" ? "border-primary bg-primary/10 text-primary" : "border-border"
                  }`}
                >
                  <span className="font-semibold block">Pagar agora online</span>
                  <span className="text-xs text-muted-foreground">PIX, débito ou crédito (Mercado Pago)</span>
                </button>
              </div>

              {checkoutMode === "online_mp" && (
                <input
                  type="email"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  placeholder="Seu e-mail (obrigatorio no Mercado Pago)"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm mb-4"
                  autoComplete="email"
                />
              )}

              {checkoutMode === "entrega" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("pix")}
                    className={`rounded-lg border px-3 py-2 text-sm ${paymentMethod === "pix" ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
                  >
                    PIX na entrega
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cartao")}
                    className={`rounded-lg border px-3 py-2 text-sm ${paymentMethod === "cartao" ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
                  >
                    Cartao na entrega
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("dinheiro")}
                    className={`rounded-lg border px-3 py-2 text-sm ${paymentMethod === "dinheiro" ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
                  >
                    Dinheiro
                  </button>
                </div>
              )}

              {checkoutMode === "entrega" && paymentMethod === "dinheiro" && (
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
                <span className="text-muted-foreground font-semibold">Frete ({freightLabel})</span>
                <span className="font-heading text-lg font-bold text-foreground">R$ {deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-4 border-t border-border pt-3">
                <span className="text-foreground font-semibold">Total final</span>
                <span className="font-heading text-2xl font-bold text-primary">R$ {grandTotal.toFixed(2)}</span>
              </div>
              <button
                type="button"
                onClick={handleFinalize}
                disabled={submitting}
                className="w-full py-3 rounded-full bg-accent text-accent-foreground font-bold text-sm shadow-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {submitting
                  ? checkoutMode === "online_mp"
                    ? "Gerando checkout..."
                    : "Enviando pedido..."
                  : checkoutMode === "online_mp"
                    ? "Continuar para pagamento (Mercado Pago)"
                    : "Confirmar Delivery e Enviar para a Loja"}
              </button>
              <button
                type="button"
                onClick={clearCart}
                className="w-full py-2 mt-2 text-sm text-muted-foreground hover:text-destructive transition-colors"
              >
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
