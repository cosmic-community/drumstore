import { Review } from '@/types'

interface ReviewCardProps {
  review: Review
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const rating = parseInt(review.metadata.rating.key)
  
  return (
    <div className="bg-primary-light rounded-lg p-6 border border-neutral-800">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-white mb-1">
            {review.metadata.reviewer_name}
          </h4>
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < rating ? 'fill-current' : 'fill-neutral-700'}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            {review.metadata.verified_purchase && (
              <span className="badge bg-green-500/20 text-green-400 border border-green-500/30 text-xs">
                Verified Purchase
              </span>
            )}
          </div>
        </div>
        {review.metadata.review_date && (
          <span className="text-sm text-neutral-400">
            {new Date(review.metadata.review_date).toLocaleDateString()}
          </span>
        )}
      </div>
      
      {review.metadata.review_text && (
        <p className="text-neutral-300 leading-relaxed">
          {review.metadata.review_text}
        </p>
      )}
    </div>
  )
}