import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "./useAuth";

export function useCart() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, isLoading: isLoadingUser } = useAuth();

  const { data: cartItems = [], isLoading, refetch } = useQuery({
    queryKey: ["/api/cart"],
    queryFn: () => api.getCart(),
    enabled: !!user,
    retry: false, // Don't retry cart requests on auth failures
  });

  // Ensure cartItems is always an array
  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity?: number }) =>
      api.addToCart(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart",
        description: "Product added to your cart successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to add items to cart.",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: string; quantity: number }) =>
      api.updateCartItem(id, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update cart item",
        variant: "destructive",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (id: string) => api.removeFromCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Removed from cart",
        description: "Item removed from your cart",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: api.clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const cartTotal = safeCartItems.reduce((total: number, item: any) => {
    return total + (parseFloat(item.product.price) * item.quantity);
  }, 0);

  const cartItemCount = safeCartItems.reduce((total: number, item: any) => total + item.quantity, 0);

  return {
    cartItems: safeCartItems,
    cartTotal,
    cartItemCount,
    isLoading,
    refetch,
    addToCart: addToCartMutation.mutate,
    updateCart: updateCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAdding: addToCartMutation.isPending,
    isUpdating: updateCartMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
  };
}