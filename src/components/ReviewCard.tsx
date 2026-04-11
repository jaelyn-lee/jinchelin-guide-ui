import type { Review } from '@/api'

export const ReviewCard = ({ review }: { review: Review }) => {
  return (
    <div className="card">
      <div className="relative w-full h-44 bg-jin-ink-2 flex items-center justify-center overflow-hidden">
        {review.photoUrl ? (
          <img
            src={review.photoUrl}
            alt={review.dishName}
            className="w-auto h-full object-cover"
          />
        ) : (
          <span className="text-5xl opacity-40">🍽️</span>
        )}
        <div
          className="absolute top-3 right-3 bg-jin-red px-3 py-1 rounded-lg
                        font-display text-lg text-jin-cream flex items-baseline gap-1"
        >
          {review.rating?.toFixed(1)}
          <span className="text-[10px] text-jin-cream/60 font-sans">/ 10</span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-[10px] tracking-[0.15em] uppercase text-jin-muted mb-1">
          {review.category ?? 'N/A'}
        </p>
        <h3 className="font-display text-xl text-jin-cream mb-2">
          {review.dishName}
        </h3>
        {review.reviewText && (
          <p className="text-xs text-jin-muted leading-relaxed">
            {review.reviewText}
          </p>
        )}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/10">
          <span className="text-[11px] text-jin-muted/70">
            {review.reviewedAt
              ? new Date(review.reviewedAt).toLocaleDateString('en-NZ', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : ''}
          </span>
          <span className="font-display text-sm text-jin-gold">
            {(review.rating ?? 0).toFixed(1)}
            <span className="text-[10px] text-jin-muted ml-1">/ 10</span>
          </span>
        </div>
      </div>
    </div>
  )
}
