import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  showCount?: boolean;
}

export function StarRating({ rating, reviewCount, showCount = true }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < fullStars
                ? 'fill-rating text-rating'
                : i === fullStars && hasHalfStar
                ? 'fill-rating/50 text-rating'
                : 'text-muted-foreground/30'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">{rating}</span>
      {showCount && reviewCount !== undefined && (
        <span className="text-sm text-muted-foreground">
          ({reviewCount} reviews)
        </span>
      )}
    </div>
  );
}
