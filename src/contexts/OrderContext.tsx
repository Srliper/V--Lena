import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ADMIN_SESSION_KEY, dispatchAdminAuthChange, getAdminToken } from "@/lib/adminSession";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";

export type DeliveryStatus = "pendente" | "preparando" | "saiu" | "entregue";
/** pix/cartao/dinheiro = na entrega; online_mercado = Checkout Mercado Pago (PIX ou cartões) */
export type PaymentMethod = "pix" | "cartao" | "dinheiro" | "online_mercado";

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
  payment_gateway?: string;
  paymentStatus?: string;
  feedback?: { stars: number; comment: string; createdAt: string };
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
  /** Retorna lista apos sucesso; undefined se nao havia token (visitante). Lanca em erro de rede ou 401 com token. */
  refreshOrders: () => Promise<DeliveryOrder[] | undefined>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);
const API_BASE_URL = getApiBaseUrl();

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

  const refreshOrders = useCallback(async (): Promise<DeliveryOrder[] | undefined> => {
    const token = getAdminToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const res = await fetch(`${API_BASE_URL}/api/orders`, { headers });
    if (res.status === 401) {
      sessionStorage.removeItem(ADMIN_SESSION_KEY);
      setOrders([]);
      // Só notificar quando havia sessão: senão `dispatch` dispara `onAuth` → `refreshOrders` → 401 de novo em loop.
      if (token) {
        dispatchAdminAuthChange();
        throw new Error(
          "A API recusou o token (401). Reinicie a API, confira ADMIN_PASSWORD e ADMIN_TOKEN_SECRET no .env e limpe o login (F12 > Console: sessionStorage.removeItem('volena_admin_token')).",
        );
      }
      return undefined;
    }
    const data = await parseResponse<DeliveryOrder[]>(res);
    setOrders(data);
    return data;
  }, []);

  useEffect(() => {
    const load = async () => {
      if (!getAdminToken()) {
        setOrders([]);
        setIsLoading(false);
        return;
      }
      try {
        await refreshOrders();
      } catch {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();

    const onAuth = () => {
      refreshOrders().catch(() => setOrders([]));
    };
    window.addEventListener("volena-admin-auth", onAuth);

    const interval = setInterval(() => {
      if (!sessionStorage.getItem(ADMIN_SESSION_KEY)) return;
      refreshOrders().catch(() => undefined);
    }, 10000);

    return () => {
      window.removeEventListener("volena-admin-auth", onAuth);
      clearInterval(interval);
    };
  }, [refreshOrders]);

  const createOrder = useCallback(async (input: CreateOrderInput) => {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const order = await parseResponse<DeliveryOrder>(res);
    setOrders(prev => [order, ...prev]);
    return order;
  }, []);

  const updateOrderStatus = useCallback(async (orderId: string, status: DeliveryStatus) => {
    const token = getAdminToken();
    if (!token) throw new Error("Faca login no Admin para alterar pedidos.");
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const updated = await parseResponse<DeliveryOrder>(res);
    setOrders(prev => prev.map(order => (order.id === updated.id ? updated : order)));
  }, []);

  const value = useMemo(
    () => ({ orders, isLoading, createOrder, updateOrderStatus, refreshOrders }),
    [orders, isLoading, refreshOrders, createOrder, updateOrderStatus],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("useOrders must be used within OrderProvider");
  return context;
};
