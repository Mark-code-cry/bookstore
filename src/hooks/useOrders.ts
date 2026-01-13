import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types/book';
import { useAuth } from '@/context/AuthContext';

export function useOrders() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['orders', user?.id],
    queryFn: async (): Promise<Order[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as unknown as Order[];
    },
    enabled: !!user,
  });
}

export function useOrderItems(orderId: string | null) {
  return useQuery({
    queryKey: ['order-items', orderId],
    queryFn: async (): Promise<OrderItem[]> => {
      if (!orderId) return [];

      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      return data as unknown as OrderItem[];
    },
    enabled: !!orderId,
  });
}

interface CreateOrderParams {
  subtotal: number;
  tax: number;
  shipping_cost: number;
  total: number;
  payment_method: Order['payment_method'];
  shipping_address?: string;
  billing_address?: string;
  items: {
    book_id: string;
    title: string;
    author: string;
    price: number;
    quantity: number;
  }[];
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (params: CreateOrderParams): Promise<Order> => {
      if (!user) throw new Error('Must be logged in to create an order');

      const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          subtotal: params.subtotal,
          tax: params.tax,
          shipping_cost: params.shipping_cost,
          total: params.total,
          payment_method: params.payment_method,
          shipping_address: params.shipping_address,
          billing_address: params.billing_address,
        } as any)
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = params.items.map((item) => ({
        order_id: order.id,
        book_id: item.book_id,
        title: item.title,
        author: item.author,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems as any);

      if (itemsError) throw itemsError;

      return order as unknown as Order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
