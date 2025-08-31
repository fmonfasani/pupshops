import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { 
  BarChart3, 
  Package, 
  Calendar, 
  Users, 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2,
  DollarSign,
  ShoppingBag
} from "lucide-react";
import { api } from "@/lib/api";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  categoryId: z.string().optional(),
  stock: z.number().min(0, "Stock cannot be negative"),
  petType: z.enum(["dog", "cat", "both"]),
});

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().min(1, "Description is required"),
  basePrice: z.string().min(1, "Price is required"),
  duration: z.number().min(1, "Duration is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  petType: z.enum(["dog", "cat", "both"]),
});



type ProductFormData = z.infer<typeof productSchema>;
type ServiceFormData = z.infer<typeof serviceSchema>;

export default function Admin() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [editingService, setEditingService] = useState<any>(null);
  const [, setLocation] = useLocation();

  const { data: stats } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: api.getAdminStats,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
    queryFn: api.getProducts,
  });

  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
    queryFn: api.getServices,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: api.getOrders,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
    queryFn: api.getBookings,
  });

  useEffect(() => {
  if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
    toast({ title: "Unauthorized", description: "Admin access required.", variant: "destructive" });
    setTimeout(() => setLocation("/login"), 300);
  }
}, [isAuthenticated, isLoading, user, toast, setLocation]);

  if (isLoading || !isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const productForm = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      categoryId: "",
      stock: 0,
      petType: "both",
    },
  });

  const serviceForm = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "",
      description: "",
      basePrice: "",
      duration: 60,
      imageUrl: "",
      petType: "both",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: (data: ProductFormData) => api.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product created successfully!" });
      setIsProductDialogOpen(false);
      productForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductFormData> }) => 
      api.updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product updated successfully!" });
      setIsProductDialogOpen(false);
      setEditingProduct(null);
      productForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => api.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  const createServiceMutation = useMutation({
    mutationFn: (data: ServiceFormData) => api.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      toast({ title: "Service created successfully!" });
      setIsServiceDialogOpen(false);
      serviceForm.reset();
    },
    onError: () => {
      toast({ title: "Failed to create service", variant: "destructive" });
    },
  });

  const updateBookingMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      api.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({ title: "Booking status updated!" });
    },
    onError: () => {
      toast({ title: "Failed to update booking", variant: "destructive" });
    },
  });

  const handleCreateProduct = (data: ProductFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    productForm.reset({
      name: product.name,
      description: product.description || "",
      price: product.price,
      imageUrl: product.imageUrl || "",
      categoryId: product.categoryId || "",
      stock: product.stock,
      petType: product.petType,
    });
    setIsProductDialogOpen(true);
  };

  const handleCreateService = (data: ServiceFormData) => {
    if (editingService) {
      // Note: Service update would need to be implemented in the API
      toast({ title: "Service editing coming soon!", variant: "default" });
    } else {
      createServiceMutation.mutate(data);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': case 'completed': return 'bg-primary text-primary-foreground';
      case 'shipped': case 'confirmed': return 'bg-accent text-accent-foreground';
      case 'processing': case 'scheduled': return 'bg-blue-500 text-white';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Layout>
      <div className="py-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-admin-title">Admin Dashboard</h1>
            <p className="text-xl text-muted-foreground">Manage your pet store operations</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Sales</p>
                    <p className="text-2xl font-bold text-primary" data-testid="text-total-sales">
                      ${stats?.totalSales || '0.00'}
                    </p>
                  </div>
                  <DollarSign className="text-primary text-2xl" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Active Orders</p>
                    <p className="text-2xl font-bold text-accent" data-testid="text-active-orders">
                      {stats?.activeOrders || 0}
                    </p>
                  </div>
                  <ShoppingBag className="text-accent text-2xl" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Today's Appointments</p>
                    <p className="text-2xl font-bold text-primary" data-testid="text-today-appointments">
                      {stats?.todayBookings || 0}
                    </p>
                  </div>
                  <Calendar className="text-primary text-2xl" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">Total Products</p>
                    <p className="text-2xl font-bold text-accent" data-testid="text-total-products">
                      {products.length}
                    </p>
                  </div>
                  <Package className="text-accent text-2xl" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
              <TabsTrigger value="services" data-testid="tab-services">Services</TabsTrigger>
              <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
              <TabsTrigger value="bookings" data-testid="tab-bookings">Bookings</TabsTrigger>
            </TabsList>

            {/* Products Management */}
            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Product Management</CardTitle>
                  <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-primary text-primary-foreground"
                        onClick={() => {
                          setEditingProduct(null);
                          productForm.reset();
                        }}
                        data-testid="button-add-product"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle data-testid="text-product-dialog-title">
                          {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...productForm}>
                        <form onSubmit={productForm.handleSubmit(handleCreateProduct)} className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={productForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Product Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Premium Dog Food" {...field} data-testid="input-product-name" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={productForm.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price ($)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="24.99" {...field} data-testid="input-product-price" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={productForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Product description..." {...field} data-testid="textarea-product-description" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={productForm.control}
                              name="stock"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stock</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="100" 
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                      data-testid="input-product-stock"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={productForm.control}
                              name="petType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Pet Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-product-pet-type">
                                        <SelectValue placeholder="Select pet type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="dog">Dogs</SelectItem>
                                      <SelectItem value="cat">Cats</SelectItem>
                                      <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={productForm.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URL (optional)</FormLabel>
                                <FormControl>
                                  <Input placeholder="https://example.com/image.jpg" {...field} data-testid="input-product-image" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={createProductMutation.isPending || updateProductMutation.isPending}
                            data-testid="button-save-product"
                          >
                            {editingProduct ? 'Update Product' : 'Create Product'}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product: any) => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg" data-testid={`row-product-${product.id}`}>
                        <div className="flex items-center gap-4">
                          <img 
                            src={product.imageUrl || "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60"} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-md"
                            data-testid={`img-product-${product.id}`}
                          />
                          <div>
                            <h4 className="font-medium" data-testid={`text-product-name-${product.id}`}>{product.name}</h4>
                            <p className="text-sm text-muted-foreground" data-testid={`text-product-stock-${product.id}`}>
                              Stock: {product.stock} | ${product.price}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="capitalize" data-testid={`badge-product-type-${product.id}`}>
                            {product.petType === 'both' ? 'Dogs & Cats' : product.petType}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleEditProduct(product)}
                            data-testid={`button-edit-product-${product.id}`}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => deleteProductMutation.mutate(product.id)}
                            disabled={deleteProductMutation.isPending}
                            data-testid={`button-delete-product-${product.id}`}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Management */}
            <TabsContent value="services">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Service Management</CardTitle>
                  <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        className="bg-accent text-accent-foreground"
                        onClick={() => {
                          setEditingService(null);
                          serviceForm.reset();
                        }}
                        data-testid="button-add-service"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Service
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle data-testid="text-service-dialog-title">
                          {editingService ? 'Edit Service' : 'Add New Service'}
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...serviceForm}>
                        <form onSubmit={serviceForm.handleSubmit(handleCreateService)} className="space-y-4">
                          <FormField
                            control={serviceForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Service Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="Veterinary Care" {...field} data-testid="input-service-name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={serviceForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea placeholder="Service description..." {...field} data-testid="textarea-service-description" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-3 gap-4">
                            <FormField
                              control={serviceForm.control}
                              name="basePrice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Base Price ($)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="75.00" {...field} data-testid="input-service-price" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={serviceForm.control}
                              name="duration"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Duration (minutes)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      placeholder="60" 
                                      {...field}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 60)}
                                      data-testid="input-service-duration"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={serviceForm.control}
                              name="petType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Pet Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger data-testid="select-service-pet-type">
                                        <SelectValue placeholder="Select pet type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="dog">Dogs</SelectItem>
                                      <SelectItem value="cat">Cats</SelectItem>
                                      <SelectItem value="both">Both</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={createServiceMutation.isPending}
                            data-testid="button-save-service"
                          >
                            {editingService ? 'Update Service' : 'Create Service'}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {services.map((service: any) => (
                      <div key={service.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg" data-testid={`row-service-${service.id}`}>
                        <div>
                          <h4 className="font-medium" data-testid={`text-service-name-${service.id}`}>{service.name}</h4>
                          <p className="text-sm text-muted-foreground" data-testid={`text-service-details-${service.id}`}>
                            ${service.basePrice} | {service.duration}min | {service.petType}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="capitalize" data-testid={`badge-service-type-${service.id}`}>
                            {service.petType === 'both' ? 'Dogs & Cats' : service.petType}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Orders Management */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.map((order: any) => (
                      <div key={order.id} className="p-4 bg-muted/20 rounded-lg" data-testid={`row-order-${order.id}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold" data-testid={`text-order-id-${order.id}`}>
                              Order #{order.id.slice(-8).toUpperCase()}
                            </p>
                            <p className="text-sm text-muted-foreground" data-testid={`text-order-date-${order.id}`}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={getStatusColor(order.status)} data-testid={`badge-order-status-${order.id}`}>
                              {order.status}
                            </Badge>
                            <span className="text-lg font-bold text-primary" data-testid={`text-order-amount-${order.id}`}>
                              ${order.totalAmount}
                            </span>
                          </div>
                        </div>
                        {order.shippingAddress && (
                          <p className="text-sm text-muted-foreground" data-testid={`text-order-address-${order.id}`}>
                            Ship to: {order.shippingAddress}
                          </p>
                        )}
                      </div>
                    ))}
                    {orders.length === 0 && (
                      <div className="text-center py-8" data-testid="text-no-orders">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No orders yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Management */}
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.map((booking: any) => (
                      <div key={booking.id} className="p-4 bg-muted/20 rounded-lg" data-testid={`row-booking-${booking.id}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-semibold" data-testid={`text-booking-service-${booking.id}`}>{booking.service.name}</p>
                            <p className="text-sm text-muted-foreground" data-testid={`text-booking-pet-${booking.id}`}>
                              {booking.petName} ({booking.petType})
                            </p>
                            <p className="text-sm text-muted-foreground" data-testid={`text-booking-datetime-${booking.id}`}>
                              {new Date(booking.appointmentDate).toLocaleDateString()} at {booking.appointmentTime}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Select 
                              value={booking.status} 
                              onValueChange={(status) => updateBookingMutation.mutate({ id: booking.id, status })}
                            >
                              <SelectTrigger className="w-32" data-testid={`select-booking-status-${booking.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <span className="text-lg font-bold text-primary" data-testid={`text-booking-price-${booking.id}`}>
                              ${booking.price}
                            </span>
                          </div>
                        </div>
                        {booking.notes && (
                          <p className="text-sm text-muted-foreground" data-testid={`text-booking-notes-${booking.id}`}>
                            Notes: {booking.notes}
                          </p>
                        )}
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <div className="text-center py-8" data-testid="text-no-bookings">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">No appointments scheduled yet.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
