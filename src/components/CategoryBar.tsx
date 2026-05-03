import { categories } from "@/data/menuData";

interface CategoryBarProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const CategoryBar = ({ activeCategory, onCategoryChange }: CategoryBarProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto py-4 px-1 scrollbar-hide">
      <button
        onClick={() => onCategoryChange("all")}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
          activeCategory === "all"
            ? "bg-primary text-primary-foreground shadow-md"
            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
        }`}
      >
        🍽️ Todos
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            activeCategory === cat.id
              ? "bg-primary text-primary-foreground shadow-md"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {cat.icon} {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryBar;
