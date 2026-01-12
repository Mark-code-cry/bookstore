import { useFeaturedBooks } from '@/hooks/useBooks';
import { Book } from '@/types/book';
import { StarRating } from './StarRating';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Sparkles, Loader2 } from 'lucide-react';

interface HeroSectionProps {
  onBookClick: (book: Book) => void;
}

export function HeroSection({ onBookClick }: HeroSectionProps) {
  const { data: featuredBooks = [], isLoading } = useFeaturedBooks();
  const { addToCart } = useCart();

  if (isLoading) {
    return (
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (featuredBooks.length === 0) return null;

  return (
    <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Featured Books</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBooks.slice(0, 4).map((book) => (
            <div
              key={book.id}
              className="bg-card rounded-xl shadow-card overflow-hidden cursor-pointer group hover:shadow-card-hover transition-shadow"
              onClick={() => onBookClick(book)}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={book.image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'}
                  alt={book.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
                  Featured
                </div>
              </div>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(book);
                    }}
                    className="gap-1"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
