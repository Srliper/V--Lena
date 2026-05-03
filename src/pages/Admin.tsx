import { useState } from "react";
import Header from "@/components/Header";
import { DeliveryStatus, useOrders } from "@/contexts/OrderContext";
import { employees as initialEmployees, Employee } from "@/data/menuData";
import { Users, CalendarDays, Package, Plus, Edit, Trash2, Search } from "lucide-react";

type Tab = "colaboradores" | "agendamentos" | "pedidos";

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
  const [tab, setTab] = useState<Tab>("colaboradores");
  const [employees] = useState<Employee[]>(initialEmployees);
  const [search, setSearch] = useState("");
  const { orders, isLoading, updateOrderStatus } = useOrders();

  const tabs = [
    { id: "colaboradores" as Tab, label: "Colaboradores", icon: Users },
    { id: "agendamentos" as Tab, label: "Agendamentos", icon: CalendarDays },
    { id: "pedidos" as Tab, label: "Pedidos", icon: Package },
  ];

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
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-6">⚙️ Administração</h1>

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
            <p className="text-muted-foreground text-sm mb-4">Pedidos de delivery em tempo real</p>
            <div className="space-y-3">
              {isLoading && (
                <div className="bg-card rounded-xl border border-border p-5 text-sm text-muted-foreground">
                  Carregando pedidos...
                </div>
              )}
              {orders.length === 0 && (
                <div className="bg-card rounded-xl border border-border p-5 text-sm text-muted-foreground">
                  Nenhum pedido chegou ainda. Quando o cliente fechar o delivery no carrinho, aparece aqui.
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
                  <p className="text-xs text-muted-foreground mb-3">
                    Pagamento: {order.paymentMethod === "pix" ? "PIX" : order.paymentMethod === "cartao" ? "Cartao" : "Dinheiro"}
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
      </main>
    </div>
  );
};

export default Admin;
