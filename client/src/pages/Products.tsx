import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/useCart";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search } from "lucide-react";
import { api } from "@/lib/api";

export default function Products() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [petFilter, setPetFilter] = useState("");
  
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
    queryFn: api.getProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: api.getCategories,
  });

  const { addToCart, isAdding } = useCart();

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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Filter products based on search and filters
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
    const matchesPetType = !petFilter || product.petType === petFilter || product.petType === 'both';
    
    return matchesSearch && matchesCategory && matchesPetType;
  });

  const handleAddToCart = (productId: string) => {
    addToCart({ productId, quantity: 1 });
  };

  return (
    <Layout>
      <div className="py-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-products-page-title">Pet Products</h1>
            <p className="text-xl text-muted-foreground">Everything your pet needs for a happy, healthy life</p>
          </div>

          {/* Filters */}
          <div className="bg-card p-6 rounded-xl shadow-lg border border-border mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-products"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger data-testid="select-category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" data-testid="option-all-categories">All Categories</SelectItem>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id} data-testid={`option-category-${category.id}`}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={petFilter} onValueChange={setPetFilter}>
                <SelectTrigger data-testid="select-pet-filter">
                  <SelectValue placeholder="All Pets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="" data-testid="option-all-pets">All Pets</SelectItem>
                  <SelectItem value="dog" data-testid="option-dogs">Dogs</SelectItem>
                  <SelectItem value="cat" data-testid="option-cats">Cats</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setPetFilter("");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product: any) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow border border-border" data-testid={`card-product-${product.id}`}>
                <img 
                  src={product.imageUrl || "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  data-testid={`img-product-${product.id}`}
                />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                    {product.stock <= 5 && product.stock > 0 && (
                      <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full" data-testid={`text-stock-low-${product.id}`}>
                        Low Stock
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm mb-3" data-testid={`text-product-description-${product.id}`}>
                    {product.description}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full capitalize" data-testid={`text-pet-type-${product.id}`}>
                      {product.petType === 'both' ? 'Dogs & Cats' : product.petType}
                    </span>
                    <span className="text-xs text-muted-foreground" data-testid={`text-stock-${product.id}`}>
                      {product.stock} in stock
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary" data-testid={`text-product-price-${product.id}`}>
                      ${product.price}
                    </span>
                    <Button 
                      className="bg-accent text-accent-foreground hover:opacity-90"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={isAdding || product.stock === 0}
                      data-testid={`button-add-cart-${product.id}`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12" data-testid="text-no-products">
              <p className="text-muted-foreground">No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
