import { useEffect, useState } from 'react';
import { dishesClient } from '../services/clients';
import type { DishResponse } from '../services/apiClient';
import TabBar from '../components/TabBar';

function PodiumItem({ dish, rank, height, color }: {
  dish?: DishResponse; rank: number; height: string; color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      {rank === 1 && <span className="text-jin-gold text-sm">✦</span>}
      <span className="text-3xl">{dish ? '🍽️' : ''}</span>
      <p className="font-display text-xs text-jin-cream text-center max-w-[80px] leading-tight">
        {dish?.name ?? '—'}
      </p>
      <div className={`w-20 rounded-t-xl flex items-center justify-center ${height} ${color}`}>
        <span className="font-display text-2xl text-jin-cream">{rank}</span>
      </div>
    </div>
  );
}

function Podium({ dishes }: { dishes: DishResponse[] }) {
  const [second, first, third] = [dishes[1], dishes[0], dishes[2]];

  return (
    <div className="flex items-end justify-center gap-1.5 px-3 pt-6">
      <PodiumItem dish={second} rank={2} height="h-16" color="bg-jin-red-deep" />
      <PodiumItem dish={first}  rank={1} height="h-24" color="bg-jin-red" />
      <PodiumItem dish={third}  rank={3} height="h-12" color="bg-jin-red-deep/40" />
    </div>
  );
}

export default function HallOfFamePage() {
  const [dishes, setDishes] = useState<DishResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dishesClient.getRanking()
      .then(setDishes)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container relative">
      <div className="px-6 pt-14 pb-5 border-b border-white/10 text-center flex-shrink-0">
        <p className="text-[10px] tracking-[0.2em] uppercase text-jin-red-vivid mb-2">★ Hall of Fame ★</p>
        <h1 className="font-display text-4xl font-light text-jin-cream">
          The <em className="text-jin-red-vivid">Greatest</em> Hits
        </h1>
      </div>

      <div className="scroll-area">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-jin-muted text-sm">Loading...</p>
          </div>
        )}

        {!loading && dishes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl opacity-20">🏆</span>
            <p className="text-jin-muted text-sm">No ranked dishes yet.</p>
          </div>
        )}

        {dishes.length > 0 && <Podium dishes={dishes} />}

        {dishes.length > 0 && (
          <>
            <div className="flex items-baseline justify-between px-6 py-4">
              <span className="section-label">Full Ranking</span>
            </div>

            {dishes.map((dish, i) => (
              <div key={dish.id}
                className="flex items-center gap-4 px-4 py-3.5 border-b border-white/[0.06]">
                <span className={`font-display text-lg w-6 text-center flex-shrink-0
                  ${i < 3 ? 'text-jin-red-vivid' : 'text-jin-muted'}`}>
                  {i + 1}
                </span>
                <div className="w-11 h-11 rounded-xl bg-jin-ink-2 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🍽️</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-base text-jin-cream truncate">{dish.name}</p>
                  <p className="text-[11px] text-jin-gold mt-0.5">
                    {'★'.repeat(Math.floor(dish.avgRating ?? 0))} {dish.avgRating?.toFixed(1)}
                  </p>
                </div>
                <span className="font-display text-lg text-jin-gold flex-shrink-0">
                  {dish.avgRating?.toFixed(1)}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      <TabBar />
    </div>
  );
}
