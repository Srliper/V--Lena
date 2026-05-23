import type { MenuItem } from "@/data/menuData";

export interface CartSelections {
  sizeId?: string;
  variantId?: string;
  extraIds?: string[];
}

/** Monta linha do carrinho com preço e rótulo (opções obrigatórias validadas aqui). */
export function computeCartLine(
  item: MenuItem,
  selections: CartSelections,
): { cartLineId: string; unitPrice: number; displayName: string } {
  let unitPrice = item.price;
  const parts: string[] = [];

  if (item.sizes?.length) {
    const s = item.sizes.find(x => x.id === selections.sizeId);
    if (!s) throw new Error("Escolha o volume (ml / embalagem) da bebida.");
    unitPrice = s.price;
    parts.push(s.label);
  }

  if (item.variants?.length) {
    const v = item.variants.find(x => x.id === selections.variantId);
    if (!v) throw new Error("Escolha a variacao do item.");
    unitPrice += v.priceAddon;
    parts.push(v.label);
  }

  if (selections.extraIds?.length && item.extras?.length) {
    for (const id of selections.extraIds) {
      const e = item.extras.find(x => x.id === id);
      if (e) {
        unitPrice += e.price;
        parts.push(e.label.replace(/^\+\s*/, ""));
      }
    }
  }

  const optionSuffix = parts.length ? ` (${parts.join(" · ")})` : "";
  const displayName = `${item.name}${optionSuffix}`;
  const extraKey = [...(selections.extraIds ?? [])].sort().join(",");
  const cartLineId = `${item.id}♦${selections.sizeId ?? ""}♦${selections.variantId ?? ""}♦${extraKey}`;

  return { cartLineId, unitPrice, displayName };
}
