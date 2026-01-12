import { ShoppingCart } from 'lucide-react';
import { Book } from '@/types/book';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface BookCardProps {
  book: Book;
  onViewDetails: (book: Book) => void;
}

export function BookCard({ book, onViewDetails }: BookCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book);
  };

  return (
    <div
      className="book-card cursor-pointer group"
      onClick={() => onViewDetails(book)}
    >
      {/* Book Cover */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={book.image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Book Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground">{book.author}</p>
        
        <StarRating rating={book.rating} reviewCount={book.review_count} />

        <div className="flex items-center justify-between pt-2">
          <span className="text-lg font-bold text-foreground">
            ${book.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={handleAddToCart}
            className="gap-1"
          >
            <ShoppingCart className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  );
}
