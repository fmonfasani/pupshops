import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "..//hooks/useAuth";
import { useCart } from "..//hooks/useCart";
import { useToast } from "..//hooks/use-toast";
import Layout from "..//components/Layout";
import { Button } from "..//components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "..//components/ui/card";
import { Input } from "..//components/ui/input";
import { Textarea } from "..//components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "..//components/ui/form";
import { Separator } from "..//components/ui/separator";
import { CreditCard, MapPin, ShoppingBag, CheckCircle } from "lucide-react";
import { api } from "..//lib/api";
import { useLocation } from "wouter";

const checkoutSchema = z.object({
  shippingAddress: z.string().min(10, "Please provide a complete shipping address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Valid ZIP code is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  specialInstructions: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      specialInstructions: "",
    },
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }

    // Redirect if cart is empty
    if (!isLoading && isAuthenticated && cartItems.length === 0 && !orderCompleted) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Add some products first!",
        variant: "destructive",
      });
      setLocation("/products");
    }
  }, [isAuthenticated, isLoading, cartItems.length, orderCompleted, toast, setLocation]);

  const createOrderMutation = useMutation({
    mutationFn: (data: CheckoutFormData) => {
      const orderItems = cartItems.map((item: any) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const fullAddress = `${data.shippingAddress}, ${data.city}, ${data.state} ${data.zipCode}`;

      return api.createOrder({
        items: orderItems,
        totalAmount: cartTotal.toFixed(2),
        shippingAddress: fullAddress,
      });
    },
    onSuccess: () => {
      setIsProcessing(false);
      setOrderCompleted(true);
      toast({
        title: "Order placed successfully!",
        description: "You'll receive an email confirmation shortly.",
      });
      clearCart();
    },
    onError: (error: any) => {
      setIsProcessing(false);
      toast({
        title: "Order failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      createOrderMutation.mutate(data);
    }, 2000);
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (orderCompleted) {
    return (
      <Layout>
        <div className="py-8 bg-background min-h-screen">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center">
              <CardContent className="p-12">
                <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4" data-testid="text-order-success">Order Confirmed!</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Thank you for your purchase. Your order has been received and will be processed shortly.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button onClick={() => setLocation("/profile")} data-testid="button-view-orders">
                    View My Orders
                  </Button>
                  <Button variant="outline" onClick={() => setLocation("/products")} data-testid="button-continue-shopping">
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="py-8 bg-background min-h-screen">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="text-center">
              <CardContent className="p-12">
                <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Add some products to your cart before checking out.
                </p>
                <Button onClick={() => setLocation("/products")} data-testid="button-shop-products">
                  Shop Products
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <Layout>
      <div className="py-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8" data-testid="text-checkout-title">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping Information */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="text-primary" />
                    Shipping Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="shippingAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main Street" {...field} data-testid="input-address" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="New York" {...field} data-testid="input-city" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="NY" {...field} data-testid="input-state" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="zipCode"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="10001" {...field} data-testid="input-zip" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="(555) 123-4567" {...field} data-testid="input-phone" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="specialInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Instructions (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Delivery instructions, gate codes, etc..." 
                                {...field} 
                                data-testid="textarea-instructions"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Payment Section */}
                      <Card className="mt-6">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <CreditCard className="text-accent" />
                            Payment Method
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="p-4 bg-muted/20 rounded-lg text-center">
                            <CreditCard className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Payment processing will be integrated with Stripe in production
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              For demo purposes, orders will be created without actual payment
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Button 
                        type="submit" 
                        className="w-full bg-primary text-primary-foreground py-4 text-lg font-semibold"
                        disabled={isProcessing || createOrderMutation.isPending}
                        data-testid="button-place-order"
                      >
                        {isProcessing ? "Processing Order..." : `Place Order - $${total.toFixed(2)}`}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cartItems.map((item: any) => (
                      <div key={item.id} className="flex justify-between items-center" data-testid={`summary-item-${item.id}`}>
                        <div className="flex items-center gap-3">
                          <img 
                            src={item.product.imageUrl || "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"} 
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded-md"
                            data-testid={`img-summary-${item.id}`}
                          />
                          <div>
                            <p className="font-medium text-sm" data-testid={`text-summary-name-${item.id}`}>{item.product.name}</p>
                            <p className="text-xs text-muted-foreground" data-testid={`text-summary-quantity-${item.id}`}>Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium" data-testid={`text-summary-total-${item.id}`}>
                          ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping:</span>
                      <span data-testid="text-shipping">
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span data-testid="text-tax">${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span className="text-primary" data-testid="text-final-total">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  {subtotal >= 50 && (
                    <div className="p-3 bg-primary/10 rounded-lg text-center">
                      <p className="text-sm text-primary font-medium" data-testid="text-free-shipping">
                        🎉 You qualified for FREE shipping!
                      </p>
                    </div>
                  )}

                  {/* Points to be earned */}
                  <div className="p-3 bg-accent/10 rounded-lg text-center">
                    <p className="text-sm text-accent-foreground" data-testid="text-points-earned">
                      You'll earn {Math.floor(total)} Paw Points with this order!
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
