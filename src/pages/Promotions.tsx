import Header from "@/components/Header";
import PromoCard from "@/components/PromoCard";
import { promotions } from "@/data/menuData";
import { buildStoreWhatsAppUrl } from "@/lib/whatsapp";

const promoWhatsAppMessage =
  "Olá! Vim pelo site da Lanchonete Vó Lena e quero saber das promoções e ofertas. 🥟";

const Promotions = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">🔥 Promoções</h1>
        <p className="text-muted-foreground mb-8">Aproveite as ofertas especiais da Vó Lena!</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promotions.map(promo => (
            <PromoCard key={promo.id} promo={promo} />
          ))}
        </div>

        <section className="mt-12 bg-card rounded-xl border border-border p-8 text-center">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-3">📱 Quer receber promoções exclusivas?</h2>
          <p className="text-muted-foreground mb-5">Entre no nosso grupo do WhatsApp e fique por dentro de todas as ofertas!</p>
          <a
            href={buildStoreWhatsAppUrl(promoWhatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-8 py-3 rounded-full bg-accent text-accent-foreground font-bold text-sm shadow-lg"
          >
            Entrar no Grupo
          </a>
        </section>
      </main>
    </div>
  );
};

export default Promotions;
