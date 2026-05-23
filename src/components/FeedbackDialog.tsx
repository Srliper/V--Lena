import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { submitOrderFeedback } from "@/lib/orderFeedback";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSubmitted?: () => void;
}

export function FeedbackDialog({ open, onOpenChange, orderId, onSubmitted }: FeedbackDialogProps) {
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    try {
      const result = await submitOrderFeedback(orderId, stars, comment);
      if (!result.ok) {
        toast.error(result.error || "Nao foi possivel enviar.");
        return;
      }
      toast.success("Obrigado! Sua avaliacao ajuda a Vó Lena a melhorar.");
      setComment("");
      setStars(5);
      onOpenChange(false);
      onSubmitted?.();
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-heading">Como foi sua entrega?</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Pedido <code className="text-xs bg-muted px-1 rounded">{orderId}</code> — avalie de 1 a 5
            estrelas (tempo, sabor, embalagem).
          </p>
        </DialogHeader>
        <StarPicker stars={stars} onSelect={setStars} />
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Comentario opcional…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm min-h-24"
        />
        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
            Agora nao
          </Button>
          <Button type="button" onClick={handleSend} disabled={sending}>
            {sending ? "Enviando…" : "Enviar avaliacao"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StarPicker({ stars, onSelect }: { stars: number; onSelect: (n: number) => void }) {
  return (
    <div className="flex justify-center gap-1 py-2">
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          type="button"
          aria-label={`${n} estrelas`}
          onClick={() => onSelect(n)}
          className={`text-3xl leading-none px-1 rounded transition-opacity ${
            n <= stars ? "opacity-100 text-amber-500" : "opacity-30"
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
}
