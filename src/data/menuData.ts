/** Adicionais comuns para salgados, pasteis e lanches (quando o item permite). */
export const EXTRAS_LANCHES: MenuExtra[] = [
  { id: "ex-bacon", label: "+ Bacon", price: 1 },
  { id: "ex-catu", label: "+ Catupiry", price: 1 },
  { id: "ex-queijo", label: "+ Queijo", price: 1 },
  { id: "ex-maio", label: "+ Maionese", price: 1 },
];

export interface MenuExtra {
  id: string;
  label: string;
  price: number;
}

/** Bebidas: escolha de volume — preço final da unidade. */
export interface MenuSizeChoice {
  id: string;
  label: string;
  price: number;
}

export interface MenuVariantChoice {
  id: string;
  label: string;
  priceAddon: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  /** Preço base (itens sem tamanho obrigatorio); com `sizes`, o cliente escolhe o preço pela linha. */
  price: number;
  category: string;
  image?: string;
  isPromo?: boolean;
  originalPrice?: number;
  badge?: string;
  sizes?: MenuSizeChoice[];
  variants?: MenuVariantChoice[];
  extras?: MenuExtra[];
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

/** Fotos reais do cardápio (`public/menu/`). */
const img = {
  pastelCarne: "/menu/pastel-carne-foto.png",
  pastelFrango: "/menu/pastel-frango.png",
  pastelCarneSeca: "/menu/pastel-carne-seca.png",
  pastelQueijo: "/menu/pastel-queijo.png",
  pastelCalabresa: "/menu/pastel-calabresa.png",
  pastelXSalada: "/menu/pastel-xsalada.png",
  pastelVarios: "/menu/pastel-varios.png",
  esfirra: "/menu/esfirra.png",
  esfirraCarne: "/menu/esfirra-carne.png",
  baconHamburguer: "/menu/bacon-hamburguer.png",
  hamburguerArtesanal: "/menu/hamburguer-artesanal.png",
  paoRequeijao: "/menu/pao-requeijao.png",
  paoNaChapa: "/menu/pao-na-chapa.png",
  coxinha: "/menu/coxinha.png",
  bolinhoCaipira: "/menu/bolinho-frango-caipira.png",
  rizzoli: "/menu/rizzoli.png",
  xburguer: "/menu/xburguer.png",
  misto: "/menu/misto-quente.png",
  sprite: "/menu/sprite.png",
  fanta: "/menu/fanta.png",
  suco: "/menu/suco-del-valle.png",
  cervejaSkol: "/menu/cerveja-skol.png",
  energeticoBaly: "/menu/energetico-baly.png",
  fruvale: "/menu/fruvale-nova.png",
  kapo: "/menu/kapo.png",
  powerade: "/menu/powerade.png",
  coquinha: "/menu/coquinha-nova.png",
  sukita2l: "/menu/sukita-2l-nova.png",
  tubaina2l: "/menu/tubaina-2l.png",
  tubainaGarrafa: "/menu/tubaina-garrafa.png",
  rossiLimonada: "/menu/rossi-limonada.png",
  coke: "/menu/coca-cola.png",
  agua: "/menu/agua-garrafa.png",
};

const COCA_SIZES: MenuSizeChoice[] = [{ id: "350", label: "350 ml (lata)", price: 6 }];

const SPRITE_SIZES: MenuSizeChoice[] = [
  { id: "350", label: "Lata 350 ml", price: 6 },
  { id: "2l", label: "Garrafa 2 L", price: 10 },
];

const FANTA_SIZES: MenuSizeChoice[] = [{ id: "350", label: "350 ml (lata)", price: 6 }];

const FRUVALE_SIZES: MenuSizeChoice[] = [
  { id: "1", label: "1 L", price: 8 },
  { id: "1.5", label: "1,5 L", price: 10 },
];

const DEL_VALLE_SIZES: MenuSizeChoice[] = [
  { id: "450", label: "450 ml", price: 5 },
  { id: "1.5", label: "1,5 L", price: 9 },
];

const AGUA_SIZES: MenuSizeChoice[] = [
  { id: "510", label: "510 ml", price: 3.5 },
  { id: "1.5", label: "1,5 L", price: 9 },
];

const CERVEJA_LATA: MenuSizeChoice[] = [{ id: "350", label: "350 ml (lata)", price: 6 }];

export const menuItems: MenuItem[] = [
  { id: "p1", name: "Pastel de Carne", description: "Carne em cubos temperada, massa crocante frita na hora", price: 13, category: "pasteis", image: img.pastelCarne, extras: EXTRAS_LANCHES },
  { id: "p2", name: "Pastel de Frango", description: "Frango desfiado com queijo cremoso", price: 13, category: "pasteis", image: img.pastelFrango, extras: EXTRAS_LANCHES },
  {
    id: "p3",
    name: "Pastel de Calabresa",
    description: "Salgado pastel calabresa com cebola na medida",
    price: 13,
    category: "pasteis",
    image: img.pastelCalabresa,
    extras: EXTRAS_LANCHES,
    badge: "Clássico",
  },
  {
    id: "p4",
    name: "Pastel de Queijo",
    description: "Queijo derretido",
    price: 13,
    category: "pasteis",
    image: img.pastelQueijo,
    extras: EXTRAS_LANCHES,
  },
  { id: "p5", name: "Pastel de Pizza", description: "Mussarela, presunto, tomate", price: 14, category: "pasteis", image: img.pastelXSalada, extras: EXTRAS_LANCHES },
  { id: "p6", name: "Pastel de Palmito", description: "Palmito cremoso", price: 13, category: "pasteis", image: img.pastelCarneSeca, extras: EXTRAS_LANCHES },
  { id: "p7", name: "Pastel c/ Queijo", description: "Recheio com queijo extra", price: 13, category: "pasteis", image: img.pastelQueijo, extras: EXTRAS_LANCHES },
  {
    id: "p8",
    name: "Pastel c/ Calabresa",
    description: "Calabresa e queijo na massa crocante",
    price: 13,
    category: "pasteis",
    image: img.pastelCalabresa,
    extras: EXTRAS_LANCHES,
  },
  {
    id: "p10",
    name: "Pastel X-Salada",
    description: "Versão pastel: carne, alface, tomate e maionese",
    price: 14,
    category: "pasteis",
    image: img.pastelXSalada,
    extras: EXTRAS_LANCHES,
    badge: "Top",
  },
  {
    id: "p9",
    name: "Pastel com Cheddar",
    description: "Cheddar cremoso",
    price: 13,
    category: "pasteis",
    image: img.pastelQueijo,
    extras: EXTRAS_LANCHES,
  },

  {
    id: "sriz",
    name: "Rizzoli (salgado especial)",
    description: "Pastel premium em formato meia-lua, recheio de carne desfiada — receita especial da casa",
    price: 8,
    category: "salgados",
    badge: "Rizzoli",
    image: img.rizzoli,
    extras: EXTRAS_LANCHES,
  },
  {
    id: "scox",
    name: "Coxinha tradicional",
    description: "Coxinha comum de frango (separada do Rizzoli)",
    price: 8,
    category: "salgados",
    image: img.coxinha,
    variants: [
      { id: "sem", label: "Sem catupiry", priceAddon: 0 },
      { id: "com", label: "Com catupiry", priceAddon: 1.5 },
    ],
    extras: EXTRAS_LANCHES,
  },
  {
    id: "sbol",
    name: "Bolinho de frango caipira",
    description: "Empanado crocante com frango desfiado e toque de ervas — estilo caipira",
    price: 8,
    category: "salgados",
    image: img.bolinhoCaipira,
    extras: EXTRAS_LANCHES,
  },
  { id: "s2", name: "Esfirra de Carne", description: "Massa assada, carne temperada com ervas", price: 8, category: "salgados", image: img.esfirraCarne, extras: EXTRAS_LANCHES },
  { id: "s3", name: "Esfirra de Bauru", description: "Presunto, mussarela e tomate", price: 8, category: "salgados", image: img.esfirra, extras: EXTRAS_LANCHES },

  {
    id: "lxsal",
    name: "X-Salada",
    description: "Hambúrguer, queijo, alface, tomate e maionese",
    price: 18,
    category: "lanches",
    image: img.xburguer,
    extras: EXTRAS_LANCHES,
  },
  {
    id: "lbac",
    name: "Bacon com hambúrguer",
    description: "Hambúrguer com fatias crocantes de bacon",
    price: 20,
    category: "lanches",
    image: img.baconHamburguer,
    extras: EXTRAS_LANCHES,
  },
  {
    id: "lham",
    name: "Hambúrguer artesanal",
    description: "Escolha 1, 2 ou 3 carnes (+ queijo conforme combinado na loja)",
    price: 16,
    category: "lanches",
    image: img.hamburguerArtesanal,
    variants: [
      { id: "h1", label: "1 hambúrguer", priceAddon: 0 },
      { id: "h2", label: "2 hambúrgueres", priceAddon: 6 },
      { id: "h3", label: "3 hambúrgueres", priceAddon: 12 },
    ],
    extras: EXTRAS_LANCHES,
  },
  {
    id: "lmisto",
    name: "Misto quente",
    description: "Pão de forma, presunto e mussarela na chapa",
    price: 10,
    category: "lanches",
    image: img.misto,
    extras: EXTRAS_LANCHES,
  },
  { id: "l1", name: "Pão na Chapa", description: "Pão artesanal na manteiga, dourado na chapa", price: 5, category: "lanches", image: img.paoNaChapa, extras: EXTRAS_LANCHES },
  { id: "l2", name: "Pão com Requeijão", description: "Pão na chapa com requeijão cremoso", price: 6, category: "lanches", image: img.paoRequeijao, extras: EXTRAS_LANCHES },

  {
    id: "b15",
    name: "Coca-Cola",
    description: "Lata 350 ml — com açúcar (original) ou sem açúcar (Zero).",
    price: 6,
    category: "bebidas",
    image: img.coke,
    sizes: COCA_SIZES,
    variants: [
      { id: "com-acucar", label: "Com açúcar (sabor original)", priceAddon: 0 },
      { id: "sem-acucar", label: "Sem açúcar (Zero / sem açúcar)", priceAddon: 0 },
    ],
  },
  {
    id: "b13",
    name: "Sprite",
    description: "Limão — lata 350 ml ou garrafa 2 L",
    price: 6,
    category: "bebidas",
    image: img.sprite,
    sizes: SPRITE_SIZES,
  },
  {
    id: "b14",
    name: "Fanta",
    description: "Lata 350 ml — sabor conforme estoque",
    price: 6,
    category: "bebidas",
    image: img.fanta,
    sizes: FANTA_SIZES,
  },
  {
    id: "b1",
    name: "Fruvale",
    description: "Suco pronto — escolha sabor e volume (1 L ou 1,5 L)",
    price: 8,
    category: "bebidas",
    image: img.fruvale,
    sizes: FRUVALE_SIZES,
    variants: [
      { id: "laranja", label: "Laranja", priceAddon: 0 },
      { id: "uva", label: "Uva", priceAddon: 0 },
    ],
  },
  {
    id: "b2",
    name: "Água mineral",
    description: "Garrafa — escolha o tamanho e se prefere natural ou com gás.",
    price: 3.5,
    category: "bebidas",
    image: img.agua,
    sizes: AGUA_SIZES,
    variants: [
      { id: "sem-gas", label: "Sem gás (natural)", priceAddon: 0 },
      { id: "com-gas", label: "Com gás", priceAddon: 0 },
    ],
  },
  {
    id: "b11",
    name: "Del Valle",
    description: "Suco de fruta — escolha o volume (450 ml ou 1,5 L)",
    price: 5,
    category: "bebidas",
    image: img.suco,
    sizes: DEL_VALLE_SIZES,
  },
  {
    id: "b19",
    name: "Cerveja lata ou latão",
    description: "Escolha a marca e o volume",
    price: 6,
    category: "bebidas",
    image: img.cervejaSkol,
    sizes: CERVEJA_LATA,
    variants: [
      { id: "skol", label: "Skol", priceAddon: 0 },
      { id: "brahma", label: "Brahma", priceAddon: 0 },
      { id: "antarctica", label: "Antarctica", priceAddon: 0 },
    ],
  },
  {
    id: "b5",
    name: "Energético Baly",
    description: "Tradicional — latão 473 ml (taurina, inositol)",
    price: 10,
    category: "bebidas",
    image: img.energeticoBaly,
  },
  {
    id: "b20",
    name: "Powerade",
    description: "Isotônico — garrafa individual",
    price: 7,
    category: "bebidas",
    image: img.powerade,
    variants: [{ id: "uva", label: "Uva", priceAddon: 0 }],
  },
  {
    id: "b21",
    name: "Kapo Del Valle",
    description: "Suco pronto em pouch — escolha uva ou abacaxi",
    price: 4,
    category: "bebidas",
    image: img.kapo,
    variants: [
      { id: "uva", label: "Uva", priceAddon: 0 },
      { id: "abacaxi", label: "Abacaxi", priceAddon: 0 },
    ],
  },
  {
    id: "b22",
    name: "Coquinha",
    description: "Coca-Cola PET pequena (caçulinha)",
    price: 3.5,
    category: "bebidas",
    image: img.coquinha,
  },
  {
    id: "b23",
    name: "Sukita 2 L",
    description: "Refrigerante laranja — garrafa 2 litros",
    price: 10,
    category: "bebidas",
    image: img.sukita2l,
  },
  {
    id: "b24",
    name: "Tubaina 2 L",
    description: "Itubaína Original — garrafa 2 litros",
    price: 10,
    category: "bebidas",
    image: img.tubaina2l,
  },
  {
    id: "b25",
    name: "Tubaina garrafa",
    description: "Itubaína Original — garrafa individual (~600 ml)",
    price: 8,
    category: "bebidas",
    image: img.tubainaGarrafa,
  },
  {
    id: "b26",
    name: "Tubaina",
    description: "Itubaína Original — lata ou PET pequeno",
    price: 6,
    category: "bebidas",
    image: img.tubainaGarrafa,
  },
  {
    id: "b27",
    name: "Rossi abacaxi limonada",
    description: "Refrigerante sabor abacaxi limonada",
    price: 6,
    category: "bebidas",
    image: img.rossiLimonada,
  },
];

export function getMenuItemById(id: string): MenuItem | undefined {
  return menuItems.find(m => m.id === id);
}

export function menuItemNeedsModal(item: MenuItem): boolean {
  return (
    (item.sizes?.length ?? 0) > 0 ||
    (item.variants?.length ?? 0) > 0 ||
    (item.extras?.length ?? 0) > 0
  );
}

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
  { id: "e6", name: "Luis Fernando Bedim", role: "Gestor", phone: "(15) 99830-2282", email: "luis@volena.com", schedule: "Seg-Dom", status: "ativo" },
  { id: "e7", name: "Maquinho", role: "Proprietário", phone: "(11) 99339-4537", email: "a.marcos2050@gmail.com", schedule: "Seg-Dom", status: "ativo" },
];
