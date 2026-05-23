import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { toast } from "@/components/ui/sonner";

/**
 * Pagina de retorno do Mercado Pago Checkout (query params definidos pela MP).
 * Se aprovado, abre WhatsApp com o mesmo resumo salvo antes do redirect.
 */
const CheckoutRetorno = () => {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const collectionStatus = params.get("collection_status");
    const paymentStatus = params.get("payment_status");

    const approved = collectionStatus === "approved" || paymentStatus === "approved";

    if (approved) {
      toast.success("Pagamento autorizado pela operadora!");
      try {
        const raw = sessionStorage.getItem("volena_mp_return");
        if (raw) {
          const { waUrl } = JSON.parse(raw) as { waUrl?: string };
          if (waUrl) window.open(waUrl, "_blank", "noopener,noreferrer");
        }
      } catch {
        /* ignore */
      } finally {
        sessionStorage.removeItem("volena_mp_return");
      }
      return;
    }

    const pending =
      collectionStatus === "pending" ||
      paymentStatus === "pending" ||
      paymentStatus === "in_process";
    const rejected =
      collectionStatus === "rejected" ||
      paymentStatus === "rejected" ||
      paymentStatus === "cancelled";

    if (pending) {
      toast.message("Pagamento pendente ou em análise. Aguarde a confirmação.");
      return;
    }
    if (rejected) {
      toast.error("Pagamento não concluído. Você pode tentar novamente pelo carrinho.");
      sessionStorage.removeItem("volena_mp_return");
      return;
    }

    toast.message("Você retornou ao site. Consulte sua compra pelo link do Mercado ou tente novamente.");
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-lg text-center">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-3">Checkout</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Se o WhatsApp não abrir sozinho, confira suas conversas ou volte ao carrinho.
        </p>
        <Link to="/" className="inline-flex px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
          Voltar ao cardápio
        </Link>
      </main>
    </div>
  );
};

export default CheckoutRetorno;
