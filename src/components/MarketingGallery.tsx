import cardapioLanches from "@/assets/marketing/cardapio-lanches.jpg";
import cardapioPasteis from "@/assets/marketing/cardapio-pasteis.jpg";
import fachada from "@/assets/marketing/fachada-vo-lena.jpg";
import flyer from "@/assets/marketing/flyer-vo-lena.jpg";
import salaoSinuca from "@/assets/marketing/salao-sinuca.jpg";

const images = [
  { src: fachada, alt: "Fachada da Lanchonete e Padaria Vó Lena na Rua Narlir Miguel, 702" },
  { src: salaoSinuca, alt: "Salão com mesa de sinuca e painéis de pastel, pão e sinuca" },
  { src: cardapioPasteis, alt: "Cardápio de pastéis com preços" },
  { src: cardapioLanches, alt: "Cardápio de lanches e salgados com preços" },
  { src: flyer, alt: "Panfleto Vó Lena: pastéis, pães, sinuca e endereço" },
];

const MarketingGallery = () => {
  return (
    <section id="marketing" className="py-6">
      <h2 className="font-heading text-2xl font-bold text-foreground mb-1">📸 Conheça a Vó Lena</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Nossa loja, nossos cardápios e aquele ambiente que você já conhece.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {images.map(image => (
          <a
            key={image.src}
            href={image.src}
            target="_blank"
            rel="noreferrer"
            className="group overflow-hidden rounded-2xl border border-orange-100/70 dark:border-amber-900/40 bg-card shadow-sm"
          >
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105 sm:h-56"
            />
          </a>
        ))}
      </div>
    </section>
  );
};

export default MarketingGallery;
