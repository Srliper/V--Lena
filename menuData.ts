export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isPromo?: boolean;
  originalPrice?: number;
  badge?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "pasteis", name: "Pastéis", icon: "🥟" },
  { id: "paes", name: "Pães", icon: "🍞" },
  { id: "doces", name: "Doces & Bolos", icon: "🍰" },
  { id: "salgados", name: "Salgados", icon: "🥐" },
  { id: "bebidas", name: "Bebidas", icon: "🥤" },
  { id: "combos", name: "Combos", icon: "🎉" },
];

export const menuItems: MenuItem[] = [
  // Pastéis
  { id: "1", name: "Pastel de Carne", description: "Carne moída temperada com cebola e cheiro-verde", price: 8.90, category: "pasteis" },
  { id: "2", name: "Pastel de Queijo", description: "Queijo mussarela derretido com orégano", price: 7.90, category: "pasteis" },
  { id: "3", name: "Pastel de Frango", description: "Frango desfiado com catupiry cremoso", price: 9.90, category: "pasteis" },
  { id: "4", name: "Pastel de Pizza", description: "Mussarela, presunto, tomate e orégano", price: 9.90, category: "pasteis" },
  { id: "5", name: "Pastel Especial da Vó", description: "Receita secreta da Vó Lena com 4 queijos", price: 12.90, category: "pasteis", badge: "⭐ Especial" },

  // Pães
  { id: "6", name: "Pão Francês (6un)", description: "Fresquinho, crocante por fora e macio por dentro", price: 5.50, category: "paes" },
  { id: "7", name: "Pão de Queijo (6un)", description: "Mineirinho legítimo, quentinho", price: 12.90, category: "paes" },
  { id: "8", name: "Pão Integral", description: "Com grãos e fibras selecionadas", price: 8.90, category: "paes" },
  { id: "9", name: "Bisnaguinha (8un)", description: "Macia e levemente adocicada", price: 7.50, category: "paes" },

  // Doces
  { id: "10", name: "Bolo de Chocolate", description: "Fatia generosa com cobertura de ganache", price: 9.90, category: "doces" },
  { id: "11", name: "Bolo de Cenoura", description: "Com cobertura de chocolate da Vó Lena", price: 8.90, category: "doces" },
  { id: "12", name: "Sonho", description: "Recheado com creme de baunilha", price: 6.90, category: "doces" },
  { id: "13", name: "Brigadeiro Gourmet", description: "Feito com chocolate belga", price: 4.50, category: "doces" },

  // Salgados
  { id: "14", name: "Coxinha", description: "Frango desfiado com massa crocante", price: 6.90, category: "salgados" },
  { id: "15", name: "Empada de Palmito", description: "Massa amanteigada com recheio cremoso", price: 7.50, category: "salgados" },
  { id: "16", name: "Quibe Frito", description: "Temperado com hortelã fresca", price: 6.50, category: "salgados" },
  { id: "17", name: "Esfiha de Carne", description: "Aberta, com carne temperada especial", price: 5.90, category: "salgados" },

  // Bebidas
  { id: "18", name: "Caldo de Cana", description: "Natural, geladinho", price: 6.00, category: "bebidas" },
  { id: "19", name: "Suco Natural", description: "Laranja, abacaxi ou maracujá", price: 7.90, category: "bebidas" },
  { id: "20", name: "Café Coado", description: "Feito na hora, do jeitinho da vó", price: 4.50, category: "bebidas" },
  { id: "21", name: "Refrigerante Lata", description: "Coca-Cola, Guaraná ou Fanta", price: 5.50, category: "bebidas" },

  // Combos
  { id: "22", name: "Combo Família", description: "4 pastéis + 1 caldo de cana 1L + 4 brigadeiros", price: 45.90, category: "combos", isPromo: true, originalPrice: 62.00, badge: "🔥 Mais Vendido" },
  { id: "23", name: "Combo Lanche da Tarde", description: "2 pastéis + 2 sucos naturais", price: 28.90, category: "combos", isPromo: true, originalPrice: 35.60 },
  { id: "24", name: "Combo Café da Vó", description: "Pão de queijo (6un) + café coado + bolo de cenoura", price: 22.90, category: "combos", isPromo: true, originalPrice: 26.30 },
];

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  discount: string;
  validUntil: string;
  color: "red" | "golden" | "green";
  code?: string;
}

export const promotions: Promotion[] = [
  {
    id: "promo1",
    title: "TERÇA DO PASTEL",
    subtitle: "Toda terça-feira",
    description: "Compre 2 pastéis e leve 3! Válido para todos os sabores.",
    discount: "LEVE 3 PAGUE 2",
    validUntil: "2026-12-31",
    color: "red",
    code: "TERCA3X2",
  },
  {
    id: "promo2",
    title: "COMBO FAMÍLIA FELIZ",
    subtitle: "Fins de semana",
    description: "Combo família com 30% de desconto nos fins de semana!",
    discount: "30% OFF",
    validUntil: "2026-12-31",
    color: "golden",
    code: "FAMILIA30",
  },
  {
    id: "promo3",
    title: "PRIMEIRA COMPRA",
    subtitle: "Novos clientes",
    description: "Ganhe frete grátis + 15% de desconto no seu primeiro pedido!",
    discount: "15% OFF + FRETE GRÁTIS",
    validUntil: "2026-12-31",
    color: "green",
    code: "BEMVINDO15",
  },
];

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  schedule: string;
  status: "ativo" | "férias" | "afastado";
}

export const employees: Employee[] = [
  { id: "e1", name: "Maria Silva", role: "Cozinheira", phone: "(11) 99999-1111", email: "maria@volena.com", schedule: "Seg-Sex 6h-14h", status: "ativo" },
  { id: "e2", name: "João Santos", role: "Atendente", phone: "(11) 99999-2222", email: "joao@volena.com", schedule: "Seg-Sex 8h-16h", status: "ativo" },
  { id: "e3", name: "Ana Costa", role: "Padeira", phone: "(11) 99999-3333", email: "ana@volena.com", schedule: "Seg-Sáb 5h-13h", status: "ativo" },
  { id: "e4", name: "Carlos Lima", role: "Entregador", phone: "(11) 99999-4444", email: "carlos@volena.com", schedule: "Seg-Dom 10h-22h", status: "ativo" },
  { id: "e5", name: "Fernanda Oliveira", role: "Caixa", phone: "(11) 99999-5555", email: "fernanda@volena.com", schedule: "Seg-Sex 12h-20h", status: "férias" },
];
