import { useState } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryBar from "@/components/CategoryBar";
import MenuCard from "@/components/MenuCard";
import PromoCarousel from "@/components/PromoCarousel";
import { menuItems, categories } from "@/data/menuData";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredItems = activeCategory === "all"
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const groupedItems = activeCategory === "all"
    ? categories.map(cat => ({
        category: cat,
        items: menuItems.filter(i => i.category === cat.id),
      })).filter(g => g.items.length > 0)
    : [{ category: categories.find(c => c.id === activeCategory)!, items: filteredItems }];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      <main className="container mx-auto px-4 pb-20">
        <PromoCarousel />
        
        <section id="cardapio" className="pt-2 pb-8">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-1 flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden>
                <path d="M8 4.5h8.5A2.5 2.5 0 0 1 19 7v12.5H6.5A1.5 1.5 0 0 1 5 18V7a2.5 2.5 0 0 1 2.5-2.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M8 4.5v2.2M16 4.5v2.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            Cardápio
          </h2>
          <p className="text-sm text-muted-foreground mb-2">Escolha seus favoritos e peça delivery!</p>
          <CategoryBar activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

          <div className="space-y-8 mt-4">
            {groupedItems.map(group => (
              <div key={group.category.id}>
                <h3 className="font-heading text-lg font-bold text-foreground mb-3">
                  {group.category.icon} {group.category.name}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.items.map(item => (
                    <MenuCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-card border-t border-border py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="font-heading text-lg font-bold text-foreground">Lanchonete Vó Lena</p>
          <p className="text-sm text-muted-foreground mt-1">Pastelaria & Padaria — Sabor de família desde sempre ❤️</p>
          <p className="text-xs text-muted-foreground mt-3">© 2026 Vó Lena. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
