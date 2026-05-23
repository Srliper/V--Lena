import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { fetchRateStatus } from "@/lib/orderFeedback";
import { clearPendingRateOrderId } from "@/lib/pendingFeedback";

const AvaliarPedido = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("Carregando…");

  useEffect(() => {
    if (!orderId) {
      setMessage("Pedido invalido.");
      return;
    }
    fetchRateStatus(orderId).then(status => {
      if (!status.ok) {
        setMessage("Pedido nao encontrado.");
        return;
      }
      if (status.alreadyRated) {
        setMessage("Este pedido ja foi avaliado. Obrigado!");
        return;
      }
      if (!status.canRate) {
        setMessage(
          `Seu pedido esta em andamento (${status.status}). Avalie quando a loja marcar como entregue.`,
        );
        return;
      }
      setMessage("");
      setOpen(true);
    });
  }, [orderId]);

  return (
    <PageShell>
      <h1 className="font-heading text-2xl font-bold mb-3">Avaliar entrega</h1>
      {message ? <p className="text-muted-foreground text-sm mb-6">{message}</p> : null}
      <Link to="/" className="text-primary text-sm font-semibold underline">
        Voltar ao cardapio
      </Link>
      {orderId ? (
        <FeedbackDialog
          open={open}
          onOpenChange={setOpen}
          orderId={orderId}
          onSubmitted={() => {
            clearPendingRateOrderId();
            setMessage("Obrigado pela avaliacao!");
            setOpen(false);
          }}
        />
      ) : null}
    </PageShell>
  );
};

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-12 max-w-md text-center">{children}</main>
    </div>
  );
}

export default AvaliarPedido;
