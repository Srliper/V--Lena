import { Promotion } from "@/data/menuData";
import { Clock, Tag } from "lucide-react";

interface PromoCardProps {
  promo: Promotion;
}

const colorMap = {
  red: "from-accent to-accent/80",
  golden: "from-promo-golden to-primary",
  green: "from-emerald-500 to-emerald-600",
};

const PromoCard = ({ promo }: PromoCardProps) => {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colorMap[promo.color]} p-5 text-accent-foreground shadow-lg hover:shadow-xl transition-shadow`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">{promo.subtitle}</p>
        <h3 className="font-heading text-xl font-extrabold mb-2">{promo.title}</h3>
        <p className="text-sm opacity-90 mb-3">{promo.description}</p>
        
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-bold">
            <Tag className="h-3 w-3" />
            {promo.discount}
          </span>
          {promo.code && (
            <span className="inline-flex items-center gap-1 text-xs opacity-80">
              <Clock className="h-3 w-3" />
              Código: <strong>{promo.code}</strong>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromoCard;
