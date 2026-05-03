import { promotions } from "@/data/menuData";
import PromoCard from "./PromoCard";

const PromoCarousel = () => {
  return (
    <section id="promocoes" className="py-6">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-4">🔥 Promoções Exclusivas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promotions.map(promo => (
          <PromoCard key={promo.id} promo={promo} />
        ))}
      </div>
    </section>
  );
};

export default PromoCarousel;
