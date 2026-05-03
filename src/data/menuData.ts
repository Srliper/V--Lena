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
  { id: "pasteis", name: "Pasteis", icon: "🥟" },
  { id: "salgados", name: "Salgados", icon: "🥐" },
  { id: "lanches", name: "Lanches", icon: "🥪" },
  { id: "bebidas", name: "Bebidas", icon: "🥤" },
];

export const menuItems: MenuItem[] = [
  // Pasteis (precos informados)
  { id: "p1", name: "Pastel de Carne", description: "Pastel frito na hora, massa crocante", price: 13, category: "pasteis" },
  { id: "p2", name: "Pastel de Frango", description: "Frango temperado", price: 13, category: "pasteis" },
  { id: "p3", name: "Pastel de Calabresa", description: "Calabresa com cebola", price: 13, category: "pasteis" },
  { id: "p4", name: "Pastel de Queijo", description: "Queijo derretido", price: 12, category: "pasteis" },
  { id: "p5", name: "Pastel de Pizza", description: "Mussarela, presunto, tomate", price: 14, category: "pasteis" },
  { id: "p6", name: "Pastel de Palmito", description: "Palmito cremoso", price: 14, category: "pasteis" },
  { id: "p7", name: "Pastel c/ Queijo", description: "Recheio com queijo extra", price: 14, category: "pasteis" },
  { id: "p8", name: "Pastel c/ Calabresa", description: "Calabresa e queijo", price: 14, category: "pasteis" },
  { id: "p9", name: "Pastel com Cheddar", description: "Cheddar cremoso", price: 14, category: "pasteis" },
  { id: "p10", name: "Pastel X-Salada", description: "Carne, alface, tomate, maionese", price: 15, category: "pasteis", badge: "Top" },

  // Salgados
  { id: "s1", name: "Coxinha Rizzoli", description: "Coxinha premium com molhos a parte sob consulta", price: 8, category: "salgados", badge: "Rizzoli" },
  { id: "s2", name: "Esfirra de Carne", description: "Massa fofinha, carne temperada", price: 8, category: "salgados" },
  { id: "s3", name: "Esfirra de Bauru", description: "Presunto, mussarela e tomate", price: 8, category: "salgados" },

  // Lanches / paes na chapa
  { id: "l1", name: "Pao na Chapa", description: "Pao frances na manteiga na chapa", price: 5, category: "lanches" },
  { id: "l2", name: "Pao com Requeijao", description: "Pao na chapa com requeijao cremoso", price: 6, category: "lanches" },

  // Bebidas - refrigerantes e sucos (precos informados)
  { id: "b1", name: "Fruvale (sem gas)", description: "Suco Fruvale, embalagem sem gas", price: 5, category: "bebidas" },
  { id: "b2", name: "Agua mineral", description: "Garrafa/agua 500ml", price: 3, category: "bebidas" },
  { id: "b3", name: "Bally", description: "Bebida Bally", price: 9, category: "bebidas" },
  { id: "b4", name: "Ross 350ml (sabores)", description: "Abacaxi, limonada ou Tubaína 350ml", price: 6, category: "bebidas" },
  { id: "b5", name: "Power", description: "Energético Power", price: 7, category: "bebidas" },
  { id: "b6", name: "Kapo Uva", description: "Suco Kapo sabor uva", price: 4, category: "bebidas" },
  { id: "b7", name: "Kapo Abacaxi", description: "Suco Kapo sabor abacaxi", price: 4, category: "bebidas" },
  { id: "b8", name: "Del Vale 350ml", description: "Suco Del Vale", price: 3.5, category: "bebidas" },
  { id: "b9", name: "Cerveja Brahma lata", description: "Lata 350ml", price: 6, category: "bebidas" },
  { id: "b10", name: "Cerveja Skol lata", description: "Lata 350ml", price: 6, category: "bebidas" },
  { id: "b11", name: "Del Vale 1,5L", description: "Suco Del Vale garrafa 1,5 litros", price: 6, category: "bebidas" },
  { id: "b12", name: "Coquinha 1L", description: "Refrigerante sabor cola 1 litro", price: 3.5, category: "bebidas" },
  { id: "b13", name: "Sprite lata", description: "Refrigerante lata", price: 6, category: "bebidas" },
  { id: "b14", name: "Fanta lata", description: "Refrigerante lata (sabores conforme estoque)", price: 6, category: "bebidas" },
  { id: "b15", name: "Coca-Cola lata", description: "Refrigerante lata 350ml", price: 6, category: "bebidas" },
  { id: "b16", name: "Coca-Cola 2L", description: "Refrigerante garrafa 2 litros", price: 15, category: "bebidas" },
  { id: "b17", name: "Suquita 2L", description: "Refrigerante garrafa 2 litros", price: 10, category: "bebidas" },
  { id: "b18", name: "Agua 1,5L", description: "Agua mineral garrafa 1,5 litros", price: 8, category: "bebidas" },
  { id: "b19", name: "Tubaína garrafa", description: "Tubaína tradicional", price: 8, category: "bebidas" },
  { id: "b20", name: "Refrigerante Tubaína 2L", description: "Garrafa 2 litros", price: 10, category: "bebidas" },
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
    title: "DELIVERY RAPIDO",
    subtitle: "Pastelaria e lanchonete",
    description: "Coxinhas, pasteis, molhos e muito mais. Peça pelo site e receba em casa!",
    discount: "ENTREGA",
    validUntil: "2026-12-31",
    color: "red",
    code: "DELIVERY",
  },
  {
    id: "promo2",
    title: "COMBO PASTEL + REFRI",
    subtitle: "Consulte sabores",
    description: "Monte seu combo com pasteis e bebidas geladas.",
    discount: "COMBO",
    validUntil: "2026-12-31",
    color: "golden",
    code: "COMBO",
  },
  {
    id: "promo3",
    title: "PRIMEIRA COMPRA",
    subtitle: "Novos clientes",
    description: "Chame no WhatsApp e confira condicoes especiais na regiao.",
    discount: "WHATSAPP",
    validUntil: "2026-12-31",
    color: "green",
    code: "NOVO",
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
