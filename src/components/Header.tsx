import { ShoppingCart, Menu, X, Instagram } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Link, useLocation } from "react-router-dom";
import logoImg from "@/assets/logo-vo-lena.png";
import { formatStoreHoursLabel, isStoreOpenNow } from "@/lib/storeConfig";

const Header = () => {
  const instagramUrl = "https://www.instagram.com/lanchonete_e_mercearia_vo_lena?igsh=MTdvZ2ZsMjVqbmNqdA==";
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Cardapio" },
    { to: "/promocoes", label: "Promocoes" },
    { to: "/admin", label: "Admin" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img src={logoImg} alt="Vo Lena" className="h-12 w-12 object-contain" width={48} height={48} />
          <div>
            <h1 className="font-heading text-lg font-bold text-foreground leading-none">Vo Lena</h1>
            <p className="text-xs text-muted-foreground">Pastelaria & Padaria</p>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5 rounded-full border border-border px-2 py-1 sm:px-3 text-[10px] sm:text-xs font-semibold max-w-[6.5rem] sm:max-w-none overflow-hidden"
            title={formatStoreHoursLabel()}
          >
            <span
              className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${isStoreOpenNow() ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,.7)]" : "bg-red-500"}`}
            />
            <span className={isStoreOpenNow() ? "text-green-700 dark:text-green-400" : "text-red-600"}>
              {isStoreOpenNow() ? "Aberto" : "Fechado"}
            </span>
          </div>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram da Lanchonete Vo Lena"
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <Instagram className="h-5 w-5 text-foreground" />
          </a>
          <Link to="/carrinho" className="relative p-2 rounded-full hover:bg-secondary transition-colors">
            <ShoppingCart className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 animate-slide-in">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => setMenuOpen(false)}
            className="block py-3 text-sm font-semibold text-muted-foreground"
          >
            Instagram
          </a>
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={`block py-3 text-sm font-semibold ${
                location.pathname === link.to ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Header;
