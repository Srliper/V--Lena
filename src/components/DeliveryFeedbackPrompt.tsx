import { useEffect, useState } from "react";
import { FeedbackDialog } from "@/components/FeedbackDialog";
import { fetchRateStatus } from "@/lib/orderFeedback";
import { clearPendingRateOrderId, getPendingRateOrderId } from "@/lib/pendingFeedback";

/** Abre avaliacao 5 estrelas quando o pedido do cliente foi marcado como entregue no admin. */
export default function DeliveryFeedbackPrompt() {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const check = async () => {
      const id = getPendingRateOrderId();
      if (!id) return;
      try {
        const status = await fetchRateStatus(id);
        if (status.ok && status.canRate && !status.alreadyRated) {
          setOrderId(id);
          setOpen(true);
        }
      } catch {
        /* API offline */
      }
    };

    check();
    const t = setInterval(check, 20000);
    return () => clearInterval(t);
  }, []);

  if (!orderId) return null;

  return (
    <FeedbackDialog
      open={open}
      onOpenChange={setOpen}
      orderId={orderId}
      onSubmitted={() => {
        clearPendingRateOrderId();
        setOrderId(null);
      }}
    />
  );
}
