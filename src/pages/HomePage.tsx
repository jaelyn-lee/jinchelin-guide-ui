import { useGetReviewsQuery } from '@/api'
import { ReviewCard } from '@/components'

export default function HomePage() {
  const { data: reviews, isLoading } = useGetReviewsQuery()

  return (
    <div className="page-container relative">
      <div className="bg-jin-red px-6 pt-6 pb-6 shrink-0">
        <p className="text-[10px] tracking-[0.2em] uppercase text-jin-blush mb-2 flex items-center gap-2">
          <span className="block w-4 h-px bg-jin-blush" />
          The Jinchelin Guide
        </p>
        <h1 className="font-display text-3xl font-light text-jin-cream leading-tight">
          His Kitchen,
          <br />
          <em className="text-jin-blush">Your Verdict.</em>
        </h1>
        <p className="text-xs text-jin-blush/70 mt-3 font-light">
          A private record of every dish he's ever made for you.
        </p>
      </div>

      <div className="scroll-area">
        <div className="flex items-baseline justify-between px-6 py-5">
          <span className="section-label">Recent Reviews</span>
          <span className="text-[11px] text-jin-red-vivid">
            {reviews?.length} dishes
          </span>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-jin-muted text-sm">Loading...</p>
          </div>
        )}

        {!isLoading && reviews?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl opacity-20">🍽️</span>
            <p className="text-jin-muted text-sm">
              No reviews yet. Add the first one!
            </p>
          </div>
        )}

        {reviews?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}
