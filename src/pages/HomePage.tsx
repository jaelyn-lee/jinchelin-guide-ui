import { useEffect, useState } from 'react';
import { reviewsClient } from '../services/clients';
import type { ReviewResponse } from '../services/apiClient';
import TabBar from '../components/TabBar';

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span className="text-jin-gold text-xs tracking-widest">
      {'★'.repeat(Math.floor(rating))}{'☆'.repeat(5 - Math.floor(rating))}
    </span>
  );
}

function ReviewCard({ review }: { review: ReviewResponse }) {
  return (
    <div className="card">
      <div className="relative w-full h-44 bg-jin-ink-2 flex items-center justify-center overflow-hidden">
        {review.photoUrl ? (
          <img src={review.photoUrl} alt={review.dishName}
            className="w-full h-full object-cover" />
        ) : (
          <span className="text-5xl opacity-40">🍽️</span>
        )}
        <div className="absolute top-3 right-3 bg-jin-red px-3 py-1 rounded-lg
                        font-display text-lg text-jin-cream flex items-baseline gap-1">
          {review.rating?.toFixed(1)}
          <span className="text-[10px] text-jin-cream/60 font-sans">/ 5</span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-[10px] tracking-[0.15em] uppercase text-jin-muted mb-1">
          {review.category ?? 'Uncategorised'}
        </p>
        <h3 className="font-display text-xl text-jin-cream mb-2">{review.dishName}</h3>
        {review.reviewText && (
          <p className="text-xs text-jin-muted leading-relaxed">{review.reviewText}</p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <span className="text-[11px] text-jin-muted/70">
            {review.reviewedAt
              ? new Date(review.reviewedAt).toLocaleDateString('en-NZ', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })
              : ''}
          </span>
          <StarDisplay rating={review.rating ?? 0} />
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    reviewsClient.getAll()
      .then(setReviews)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container relative">
      <div className="bg-jin-red px-6 pt-14 pb-6 flex-shrink-0">
        <p className="text-[10px] tracking-[0.2em] uppercase text-jin-blush mb-2 flex items-center gap-2">
          <span className="block w-4 h-px bg-jin-blush" />
          The Jinchelin Guide
        </p>
        <h1 className="font-display text-4xl font-light text-jin-cream leading-tight">
          His Kitchen,<br />
          <em className="text-jin-blush">Your Verdict.</em>
        </h1>
        <p className="text-xs text-jin-blush/70 mt-3 font-light">
          A private record of every dish he's ever made for you.
        </p>
      </div>

      <div className="scroll-area">
        <div className="flex items-baseline justify-between px-6 py-5">
          <span className="section-label">Recent Reviews</span>
          <span className="text-[11px] text-jin-red-vivid">{reviews.length} dishes</span>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-jin-muted text-sm">Loading...</p>
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl opacity-20">🍽️</span>
            <p className="text-jin-muted text-sm">No reviews yet. Add the first one!</p>
          </div>
        )}

        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      <TabBar />
    </div>
  );
}
