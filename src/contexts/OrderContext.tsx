import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type DeliveryStatus = "pendente" | "preparando" | "saiu" | "entregue";
export type PaymentMethod = "pix" | "cartao" | "dinheiro";

export interface DeliveryOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  address: string;
  neighborhood: string;
  reference?: string;
  paymentMethod: PaymentMethod;
  changeFor?: number;
  notes?: string;
  itemsSummary: string;
  total: number;
  status: DeliveryStatus;
  createdAt: string;
}

interface CreateOrderInput {
  customerName: string;
  customerPhone: string;
  address: string;
  neighborhood: string;
  reference?: string;
  paymentMethod: PaymentMethod;
  changeFor?: number;
  notes?: string;
  itemsSummary: string;
  total: number;
}

interface OrderContextType {
  orders: DeliveryOrder[];
  isLoading: boolean;
  createOrder: (input: CreateOrderInput) => Promise<DeliveryOrder>;
  updateOrderStatus: (orderId: string, status: DeliveryStatus) => Promise<void>;
  refreshOrders: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const parseResponse = async <T,>(res: Response): Promise<T> => {
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || "Falha na comunicacao com servidor");
  }
  return (await res.json()) as T;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshOrders = async () => {
    const res = await fetch(`${API_BASE_URL}/api/orders`);
    const data = await parseResponse<DeliveryOrder[]>(res);
    setOrders(data);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await refreshOrders();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    load();

    const interval = setInterval(() => {
      refreshOrders().catch(() => undefined);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const createOrder = async (input: CreateOrderInput) => {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const order = await parseResponse<DeliveryOrder>(res);
    setOrders(prev => [order, ...prev]);
    return order;
  };

  const updateOrderStatus = async (orderId: string, status: DeliveryStatus) => {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await parseResponse<DeliveryOrder>(res);
    setOrders(prev => prev.map(order => (order.id === updated.id ? updated : order)));
  };

  const value = useMemo(
    () => ({ orders, isLoading, createOrder, updateOrderStatus, refreshOrders }),
    [orders, isLoading],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
