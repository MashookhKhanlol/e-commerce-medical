import Link from "next/link";

interface Category {
  id: string;
  name: string;
  handle: string;
}

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string;
}

const ALL_OPTION = { id: "all", name: "All Medicines", handle: "" };

/**
 * Category filter sidebar — Server Component.
 * Each item is a plain <Link> that updates the ?category= search param.
 * Active state determined by comparing the current URL's category param.
 */
export function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const items = [ALL_OPTION, ...categories];

  return (
    <aside className="listing-sidebar" aria-label="Filter by category">
      <p className="listing-sidebar__title">Categories</p>
      <nav className="listing-sidebar__items" aria-label="Product categories">
        {items.map((cat) => {
          const isActive =
            cat.handle === ""
              ? !activeCategory
              : activeCategory === cat.handle;

          const href =
            cat.handle === "" ? "/medicines" : `/medicines?category=${cat.handle}`;

          return (
            <Link
              key={cat.id}
              href={href}
              id={`category-filter-${cat.handle || "all"}`}
              className={`sidebar-item ${isActive ? "sidebar-item--active" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              {cat.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
