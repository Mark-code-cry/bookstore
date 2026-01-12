import { X, ShoppingCart, Package } from 'lucide-react';
import { Book } from '@/types/book';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

interface BookDetailsModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BookDetailsModal({ book, isOpen, onClose }: BookDetailsModalProps) {
  const { addToCart } = useCart();

  if (!isOpen || !book) return null;

  const handleAddToCart = () => {
    addToCart(book);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-xl shadow-modal w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Book Details</h2>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 grid md:grid-cols-2 gap-8 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Image */}
          <div className="aspect-[3/4] rounded-lg overflow-hidden">
            <img
              src={book.image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'}
              alt={book.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-foreground">{book.title}</h3>
            <p className="text-muted-foreground">by {book.author}</p>
            
            <StarRating rating={book.rating} reviewCount={book.review_count} />

            <p className="text-3xl font-bold text-foreground">
              ${book.price.toFixed(2)}
            </p>

            {book.stock_quantity > 0 ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Package className="w-4 h-4" />
                In Stock ({book.stock_quantity} available)
              </div>
            ) : (
              <div className="text-sm text-destructive">Out of Stock</div>
            )}

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleAddToCart}
              disabled={book.stock_quantity === 0}
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </Button>

            <div className="border-t border-border pt-4 space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Description</h4>
                <p className="text-muted-foreground">{book.description || 'No description available.'}</p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Details</h4>
                <dl className="space-y-1 text-sm">
                  <div className="flex">
                    <dt className="text-muted-foreground w-24">Category:</dt>
                    <dd className="text-foreground">{book.category}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-muted-foreground w-24">ISBN:</dt>
                    <dd className="text-foreground">{book.isbn || 'N/A'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="text-muted-foreground w-24">Author:</dt>
                    <dd className="text-foreground">{book.author}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
