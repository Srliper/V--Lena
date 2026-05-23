import React, { createContext, useContext, useState, useCallback } from "react";
import type { MenuItem } from "@/data/menuData";
import { computeCartLine, type CartSelections } from "@/lib/cartLine";

export interface CartLine {
  cartLineId: string;
  baseId: string;
  displayName: string;
  quantity: number;
  unitPrice: number;
  /** miniatura opcional nas listas */
  image?: string;
}

interface CartContextType {
  items: CartLine[];
  addLine: (item: MenuItem, selections: CartSelections) => void;
  removeLine: (cartLineId: string) => void;
  updateQuantity: (cartLineId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartLine[]>([]);

  const addLine = useCallback((item: MenuItem, selections: CartSelections) => {
    const { cartLineId, unitPrice, displayName } = computeCartLine(item, selections);
    setItems(prev => {
      const existing = prev.find(i => i.cartLineId === cartLineId);
      if (existing) {
        return prev.map(i =>
          i.cartLineId === cartLineId ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [
        ...prev,
        {
          cartLineId,
          baseId: item.id,
          displayName,
          quantity: 1,
          unitPrice,
          image: item.image,
        },
      ];
    });
  }, []);

  const removeLine = useCallback((cartLineId: string) => {
    setItems(prev => prev.filter(i => i.cartLineId !== cartLineId));
  }, []);

  const updateQuantity = useCallback((cartLineId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.cartLineId !== cartLineId));
    } else {
      setItems(prev => prev.map(i => (i.cartLineId === cartLineId ? { ...i, quantity } : i)));
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const total = items.reduce((sum, row) => sum + row.unitPrice * row.quantity, 0);
  const itemCount = items.reduce((sum, row) => sum + row.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addLine, removeLine, updateQuantity, clearCart, total, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};
