import { X, Minus, Plus, Trash2, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, updateQuantity, removeFromCart, subtotal, isLoading, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const createOrderMutation = useCreateOrder();

  if (!isOpen) return null;

  const tax = subtotal * 0.08;
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + tax + shipping;
  const freeShippingRemaining = Math.max(0, 50 - subtotal);

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (!isAuthenticated) {
      toast.error('Please log in to place an order');
      onClose();
      return;
    }

    try {
      await createOrderMutation.mutateAsync({
        subtotal,
        tax,
        shipping_cost: shipping,
        total,
        payment_method: 'credit_card', // Default payment method, could be made configurable
        items: items.map(item => ({
          book_id: item.book_id,
          title: item.book?.title || 'Unknown Book',
          author: item.book?.author || 'Unknown Author',
          price: item.book?.price || 0,
          quantity: item.quantity,
        })),
      });

      toast.success('Order placed successfully!');
      await clearCart();
      onClose();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(`Failed to place order: ${error.message || 'Please try again.'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-card rounded-xl shadow-modal w-full max-w-lg max-h-[90vh] overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold text-foreground">Shopping Cart</h2>
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading cart...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">
                Start shopping to add items
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-secondary rounded-lg"
                >
                  <img
                    src={item.book?.image_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop'}
                    alt={item.book?.title || 'Book'}
                    className="w-16 h-20 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-foreground truncate">
                      {item.book?.title || 'Unknown Book'}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {item.book?.author || 'Unknown Author'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${(item.book?.price || 0).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.book_id, item.quantity - 1)
                        }
                        className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.book_id, item.quantity + 1)
                        }
                        className="w-7 h-7 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.book_id)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <span className="font-bold text-foreground">
                      ${((item.book?.price || 0) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-border space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="text-foreground">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax (8%):</span>
              <span className="text-foreground">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping:</span>
              <span className="text-foreground">
                {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            {freeShippingRemaining > 0 && (
              <p className="text-sm text-primary">
                Add ${freeShippingRemaining.toFixed(2)} more for free shipping!
              </p>
            )}
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
              <span className="text-foreground">Total:</span>
              <span className="text-foreground">${total.toFixed(2)}</span>
            </div>
            <Button 
              className="w-full" 
              size="lg" 
              onClick={handleCheckout}
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? 'Processing...' : 'Proceed to Checkout'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
