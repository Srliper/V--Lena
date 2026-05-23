import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { DeliveryStatus, useOrders } from "@/contexts/OrderContext";
import { employees as initialEmployees, Employee } from "@/data/menuData";
import {
  clearAdminToken,
  dispatchAdminAuthChange,
  getAdminToken,
  setAdminToken,
} from "@/lib/adminSession";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";
import { Users, CalendarDays, Package, Plus, Edit, Trash2, Search, LogOut, RefreshCw, Star } from "lucide-react";
import { fetchFeedbacksAdmin, type OrderFeedbackRow } from "@/lib/orderFeedback";
import { toast } from "@/components/ui/sonner";

const API_BASE_URL = getApiBaseUrl();

type Tab = "colaboradores" | "agendamentos" | "pedidos" | "avaliacoes";

interface Schedule {
  id: string;
  employeeName: string;
  date: string;
  shift: string;
  notes: string;
}

const mockSchedules: Schedule[] = [
  { id: "s1", employeeName: "Maria Silva", date: "2026-03-30", shift: "6h-14h", notes: "Preparo de pastéis especiais" },
  { id: "s2", employeeName: "João Santos", date: "2026-03-30", shift: "8h-16h", notes: "Atendimento balcão" },
  { id: "s3", employeeName: "Ana Costa", date: "2026-03-30", shift: "5h-13h", notes: "Produção pães integrais" },
  { id: "s4", employeeName: "Carlos Lima", date: "2026-03-30", shift: "10h-22h", notes: "Rota delivery zona sul" },
];

const statusColors = {
  pendente: "bg-yellow-100 text-yellow-800",
  preparando: "bg-blue-100 text-blue-800",
  saiu: "bg-primary/10 text-primary",
  entregue: "bg-green-100 text-green-800",
};

const statusLabels = {
  pendente: "⏳ Pendente",
  preparando: "👨‍🍳 Preparando",
  saiu: "🛵 Saiu para entrega",
  entregue: "✅ Entregue",
};

const Admin = () => {
  const [authed, setAuthed] = useState(() => !!getAdminToken());
  const [pwd, setPwd] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState<Tab>("pedidos");
  const [employees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const [reloadBusy, setReloadBusy] = useState(false);
  const [feedbacks, setFeedbacks] = useState<OrderFeedbackRow[]>([]);
  const [feedbacksLoading, setFeedbacksLoading] = useState(false);
  const { orders, isLoading, updateOrderStatus, refreshOrders } = useOrders();

  useEffect(() => {
    const sync = () => setAuthed(!!getAdminToken());
    window.addEventListener("volena-admin-auth", sync);
    return () => window.removeEventListener("volena-admin-auth", sync);
  }, []);

  const tabs = [
    { id: "colaboradores" as Tab, label: "Colaboradores", icon: Users },
    { id: "agendamentos" as Tab, label: "Agendamentos", icon: CalendarDays },
    { id: "pedidos" as Tab, label: "Pedidos", icon: Package },
    { id: "avaliacoes" as Tab, label: "Avaliações", icon: Star },
  ];

  const loadFeedbacks = async () => {
    const token = getAdminToken();
    if (!token) return;
    setFeedbacksLoading(true);
    try {
      setFeedbacks(await fetchFeedbacksAdmin(token));
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao carregar avaliacoes.");
    } finally {
      setFeedbacksLoading(false);
    }
  };

  useEffect(() => {
    if (authed && tab === "avaliacoes") loadFeedbacks();
  }, [authed, tab]);

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  const statusBadge = (status: Employee["status"]) => {
    const map = { ativo: "bg-green-100 text-green-800", férias: "bg-yellow-100 text-yellow-800", afastado: "bg-red-100 text-red-800" };
    return map[status];
  };

  const cycleOrderStatus = async (orderId: string, currentStatus: DeliveryStatus) => {
    const order = ["pendente", "preparando", "saiu", "entregue"] as const;
    const idx = order.indexOf(currentStatus);
    const next = order[Math.min(idx + 1, order.length - 1)];
    try {
      await updateOrderStatus(orderId, next);
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Nao foi possivel atualizar o pedido.");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginErr("");
    setLoggingIn(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/admin-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; token?: string; error?: string };
      if (!res.ok || !data.ok || !data.token) {
        setLoginErr(data.error || "Senha incorreta.");
        return;
      }
      setAdminToken(data.token);
      setPwd("");
      setAuthed(true);
      setTab("pedidos");
      dispatchAdminAuthChange();
      toast.success("Acesso liberado.");
      try {
        const list = await refreshOrders();
        if (Array.isArray(list)) {
          toast.message(
            list.length === 0
              ? "Nenhum pedido no banco ainda. Finalize um pedido no carrinho para aparecer aqui."
              : `${list.length} pedido(s) carregados.`,
          );
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        if (msg.includes("401") || msg.includes("nao autorizado")) {
          setAuthed(false);
          clearAdminToken();
          dispatchAdminAuthChange();
        }
        toast.error(msg || "Falha ao carregar pedidos. Veja a URL da API abaixo e se `npm run dev` esta rodando.");
      }
    } catch {
      setLoginErr(
        `Nao foi possivel contatar a API em ${API_BASE_URL}. Confirme que o terminal esta com "npm run dev" (ou "npm run dev:api") e que /api/health abre no navegador.`,
      );
    } finally {
      setLoggingIn(false);
    }
  };

  const handleReloadPedidos = async () => {
    setReloadBusy(true);
    try {
      const list = await refreshOrders();
      if (Array.isArray(list)) {
        toast.message(list.length ? `${list.length} pedido(s).` : "Lista vazia.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao recarregar.");
    } finally {
      setReloadBusy(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setAuthed(false);
    dispatchAdminAuthChange();
    toast.message("Sessao encerrada.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {!authed ? (
          <div className="max-w-sm mx-auto bg-card rounded-xl border border-border p-8 shadow-sm mt-8">
            <h1 className="font-heading text-xl font-bold text-foreground mb-2">Area restrita</h1>
            <p className="text-muted-foreground text-sm mb-6">Digite a senha da administracao para ver pedidos e dados internos.</p>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                autoComplete="current-password"
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                placeholder="Senha"
                className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
              />
              {loginErr ? <p className="text-destructive text-xs">{loginErr}</p> : null}
              <button
                type="submit"
                disabled={loggingIn}
                className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50"
              >
                {loggingIn ? "Entrando..." : "Entrar"}
              </button>
            </form>
            <p className="text-[11px] text-muted-foreground break-all mt-4">
              URL da API usada pelo site:{" "}
              <code className="bg-muted px-1 rounded">{API_BASE_URL}</code>
            </p>
            <p className="text-[11px] mt-2">
              <a
                href={`${API_BASE_URL}/api/health`}
                target="_blank"
                rel="noreferrer"
                className="text-primary underline font-medium"
              >
                Testar API (abrir /api/health)
              </a>{" "}
              — deve mostrar <code className="text-xs">ok</code>.
            </p>
            <details className="mt-4 text-[11px] text-muted-foreground">
              <summary className="cursor-pointer font-semibold text-foreground">Ver erro no navegador (F12)</summary>
              <ol className="list-decimal pl-4 mt-2 space-y-1">
                <li>Aba <strong>Rede</strong> → tente entrar de novo → clique em <code>admin-login</code> ou <code>orders</code>.</li>
                <li>
                  <strong>401</strong> em <code>orders</code>: token invalido ou senha da API diferente. Limpe sessao: Console →{" "}
                  <code className="break-all">sessionStorage.removeItem(&quot;volena_admin_token&quot;);location.reload()</code>
                </li>
                <li>
                  Falha de rede / bloqueado: API desligada ou URL errada (<code>VITE_API_URL</code> no build).
                </li>
              </ol>
            </details>
          </div>
        ) : (
          <>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="font-heading text-3xl font-bold text-foreground">⚙️ Administração</h1>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                tab === t.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        {tab === "colaboradores" && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar colaborador..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                <Plus className="h-4 w-4" /> Novo
              </button>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Nome</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Cargo</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Telefone</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Horário</th>
                      <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                      <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map(emp => (
                      <tr key={emp.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-semibold text-foreground">{emp.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{emp.role}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{emp.phone}</td>
                        <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">{emp.schedule}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusBadge(emp.status)}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-1">
                            <button className="p-1.5 rounded-md hover:bg-secondary"><Edit className="h-3.5 w-3.5 text-muted-foreground" /></button>
                            <button className="p-1.5 rounded-md hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5 text-destructive" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "agendamentos" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground text-sm">Agenda do dia: <strong>30 de Março, 2026</strong></p>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                <Plus className="h-4 w-4" /> Novo Agendamento
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockSchedules.map(s => (
                <div key={s.id} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading font-bold text-foreground">{s.employeeName}</h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold">{s.shift}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{s.notes}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "pedidos" && (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <p className="text-muted-foreground text-sm">Pedidos de delivery em tempo real</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] text-muted-foreground break-all max-w-full sm:max-w-md">
                  API: <code className="bg-muted px-1 rounded">{API_BASE_URL}</code>
                </span>
                <button
                  type="button"
                  disabled={reloadBusy}
                  onClick={handleReloadPedidos}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary disabled:opacity-50"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${reloadBusy ? "animate-spin" : ""}`} />
                  Recarregar
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {isLoading && (
                <div className="bg-card rounded-xl border border-border p-5 text-sm text-muted-foreground">
                  Carregando pedidos...
                </div>
              )}
              {orders.length === 0 && !isLoading && (
                <div className="bg-card rounded-xl border border-border p-5 text-sm text-muted-foreground">
                  Nenhum pedido na lista. Se a API estiver ok, crie um pedido pelo carrinho ou confira o banco em{" "}
                  <code className="text-xs bg-muted px-1 rounded">server/data/orders.db</code> (SQLite).
                </div>
              )}
              {orders.map(order => (
                <div key={order.id} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-heading font-bold text-foreground">{order.customerName}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} - {order.id}
                      </p>
                    </div>
                    <span className="font-bold text-primary">R$ {order.total.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{order.itemsSummary}</p>
                  <p className="text-xs text-muted-foreground mb-1">Endereco: {order.address} - {order.neighborhood}</p>
                  <p className="text-xs text-muted-foreground mb-1">Telefone: {order.customerPhone}</p>
                  {order.feedback ? (
                    <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 mb-2">
                      {"★".repeat(order.feedback.stars)}
                      {"☆".repeat(5 - order.feedback.stars)}{" "}
                      {order.feedback.comment ? `— ${order.feedback.comment}` : ""}
                    </p>
                  ) : order.status === "entregue" ? (
                    <p className="text-[10px] text-muted-foreground mb-2">Aguardando avaliacao do cliente</p>
                  ) : null}
                  <p className="text-xs text-muted-foreground mb-3">
                    Pagamento:{" "}
                    {order.paymentMethod === "online_mercado"
                      ? order.paymentStatus === "paid"
                        ? "Mercado Pago (confirmado)"
                        : order.paymentStatus === "pending_online"
                          ? "Mercado Pago (pendente)"
                          : "Mercado Pago (online)"
                      : order.paymentMethod === "pix"
                        ? "PIX na entrega"
                        : order.paymentMethod === "cartao"
                          ? "Cartao na entrega"
                          : "Dinheiro"}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                    {order.status !== "entregue" && (
                      <button
                        onClick={() => cycleOrderStatus(order.id, order.status)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-semibold"
                      >
                        Avançar Status →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "avaliacoes" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground text-sm">Notas dos clientes apos entrega (1 a 5 estrelas)</p>
              <button
                type="button"
                disabled={feedbacksLoading}
                onClick={loadFeedbacks}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${feedbacksLoading ? "animate-spin" : ""}`} />
                Atualizar
              </button>
            </div>
            {feedbacksLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}
            {!feedbacksLoading && feedbacks.length === 0 && (
              <p className="text-sm text-muted-foreground bg-card border border-border rounded-xl p-5">
                Nenhuma avaliacao ainda. Marque pedidos como entregues e o cliente podera avaliar no site.
              </p>
            )}
            <div className="space-y-3">
              {feedbacks.map(f => (
                <div key={f.orderId} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex justify-between gap-2 mb-1">
                    <span className="font-semibold text-foreground">{f.customerName || f.orderId}</span>
                    <span className="text-amber-500 text-lg leading-none">
                      {"★".repeat(f.stars)}
                      {"☆".repeat(5 - f.stars)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">
                    {f.orderId} · {new Date(f.createdAt).toLocaleString("pt-BR")}
                    {f.total != null ? ` · R$ ${f.total.toFixed(2)}` : ""}
                  </p>
                  {f.comment ? <p className="text-sm text-muted-foreground">{f.comment}</p> : null}
                </div>
              ))}
            </div>
          </div>
        )}
          </>
        )}
      </main>
    </div>
  );
};

export default Admin;
