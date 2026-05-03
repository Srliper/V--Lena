import heroImg from "@/assets/hero-pasteis.jpg";

const HeroBanner = () => {
  return (
    <section className="relative h-[340px] md:h-[420px] overflow-hidden">
      <img
        src={heroImg}
        alt="Pastéis quentinhos da Vó Lena"
        className="absolute inset-0 w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-lg text-primary-foreground">
          <h2 className="font-heading text-4xl md:text-5xl font-extrabold leading-tight mb-3 drop-shadow-lg">
            O sabor que a<br />família merece
          </h2>
          <p className="font-body text-base md:text-lg opacity-90 mb-5">
            Pastéis crocantes, pães fresquinhos e muito carinho — direto da cozinha da Vó Lena pra sua casa.
          </p>
          <div className="flex gap-3">
            <a href="#cardapio" className="inline-flex items-center px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm shadow-lg hover:opacity-90 transition-opacity">
              Ver Cardápio
            </a>
            <a href="#promocoes" className="inline-flex items-center px-6 py-3 rounded-full bg-accent text-accent-foreground font-semibold text-sm shadow-lg animate-pulse-promo">
              🔥 Promoções
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
