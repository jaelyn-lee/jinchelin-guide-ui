import { useEffect, useState } from 'react';
import { categoriesClient, dishesClient } from '../services/clients';
import type { CategoryResponse, DishResponse } from '../services/apiClient';
import TabBar from '../components/TabBar';

export default function MenuPage() {
  const [dishes, setDishes]         = useState<DishResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [search, setSearch]         = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    Promise.all([dishesClient.getAll(undefined, undefined, undefined), categoriesClient.getAll()])
      .then(([d, c]) => { setDishes(d); setCategories(c); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = dishes.filter(d => {
    const matchSearch = d.name?.toLowerCase().includes(search.toLowerCase()) ?? false;
    const matchCat    = !activeCategory || d.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="page-container relative">
      <div className="px-6 pt-14 pb-5 border-b border-white/10 flex-shrink-0">
        <h1 className="font-display text-4xl font-light text-jin-cream">
          All <em className="text-jin-red-vivid">Dishes</em>
        </h1>
        <p className="text-xs text-jin-muted mt-1">{dishes.length} recipes reviewed</p>
      </div>

      <div className="px-4 pt-4 flex-shrink-0">
        <div className="flex items-center gap-3 bg-jin-ink-2 border border-white/10 rounded-2xl px-4 py-3">
          <svg className="w-4 h-4 stroke-jin-muted flex-shrink-0" viewBox="0 0 24 24" fill="none" strokeWidth={1.8} strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className="bg-transparent border-none outline-none font-sans text-sm text-jin-cream w-full placeholder:text-jin-muted"
            placeholder="Search dishes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-2 px-4 py-3 overflow-x-auto scroll-hide flex-shrink-0">
        <button
          onClick={() => setActiveCategory(null)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] border transition-colors
            ${!activeCategory ? 'bg-jin-red border-jin-red text-jin-cream' : 'border-white/10 text-jin-muted'}`}>
          All
        </button>
        {categories.map(c => (
          <button key={c.id}
            onClick={() => setActiveCategory(activeCategory === c.name ? null : c.name ?? null)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[11px] border transition-colors
              ${activeCategory === c.name ? 'bg-jin-red border-jin-red text-jin-cream' : 'border-white/10 text-jin-muted'}`}>
            {c.name}
          </button>
        ))}
      </div>

      <div className="scroll-area">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-jin-muted text-sm">Loading...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl opacity-20">🔍</span>
            <p className="text-jin-muted text-sm">No dishes found.</p>
          </div>
        )}

        {filtered.map((dish, i) => (
          <div key={dish.id}
            className="flex items-center gap-4 px-4 py-4 border-b border-white/[0.06]">
            <span className="font-display text-base text-jin-muted w-5 text-center flex-shrink-0">
              {i + 1}
            </span>
            <div className="w-12 h-12 rounded-xl bg-jin-ink-2 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display text-base text-jin-cream truncate">{dish.name}</p>
              <p className="text-[11px] text-jin-muted mt-0.5">{dish.category ?? '—'}</p>
            </div>
            <span className="font-display text-lg text-jin-gold flex-shrink-0">
              {(dish.avgRating ?? 0) > 0 ? dish.avgRating?.toFixed(1) : '—'}
            </span>
          </div>
        ))}
      </div>

      <TabBar />
    </div>
  );
}
