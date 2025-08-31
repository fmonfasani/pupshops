import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Heart, Truck, Star, ShoppingCart, Calendar } from "lucide-react";
import { api } from "../lib/api";
import BookingModal from "../components/BookingModal";
import { useCart } from "../hooks/useCart";

export default function Landing() {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
    queryFn: api.getProducts,
  });
  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
    queryFn: api.getServices,
  });
  const { addToCart, isAdding } = useCart();

  const featuredProducts = products.slice(0, 4);

  const handleBookService = (service: any) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const handleAddToCart = (productId: string) => {
    addToCart({ productId, quantity: 1 });
  };

  return (
    <div className="bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Heart className="text-primary text-2xl" fill="currentColor" />
                <span className="text-2xl font-bold text-primary">PupShops</span>
              </div>
              <div className="hidden md:flex space-x-6">
                <a href="#products" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-products-nav">Products</a>
                <a href="#services" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-services-nav">Services</a>
                <a href="#about" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-about-nav">About</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/api/login" data-testid="button-signin">
                <Button className="bg-primary text-primary-foreground hover:opacity-90">
                  Sign In
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080" 
            alt="Adorable kitten and puppy playing together" 
            className="w-full h-full object-cover opacity-20"
            data-testid="img-hero-background"
          />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" data-testid="text-hero-title">
            Everything your 
            <span className="text-primary">furry friend</span>
            <br />needs
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            From premium food to professional grooming services, we've got your pet covered with love and care.
          </p>

          <div className="mb-8">
            <img 
              src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400" 
              alt="Kitten and puppy cuddling on soft blanket" 
              className="mx-auto rounded-3xl shadow-2xl max-w-md w-full"
              data-testid="img-hero-pets"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#products">
              <Button className="bg-primary text-primary-foreground px-8 py-4 text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105" data-testid="button-shop-now">
                Shop Now
              </Button>
            </a>
            <a href="#services">
              <Button className="bg-accent text-accent-foreground px-8 py-4 text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105" data-testid="button-book-services">
                Book Services
              </Button>
            </a>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <Card className="bg-card/50 backdrop-blur-sm border border-border" data-testid="card-feature-delivery">
              <CardContent className="p-6">
                <Truck className="text-primary text-3xl mb-3 mx-auto" />
                <h3 className="font-semibold mb-2">Free Delivery</h3>
                <p className="text-muted-foreground">On orders over $50</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border border-border" data-testid="card-feature-care">
              <CardContent className="p-6">
                <Heart className="text-accent text-3xl mb-3 mx-auto" fill="currentColor" />
                <h3 className="font-semibold mb-2">Expert Care</h3>
                <p className="text-muted-foreground">Certified professionals</p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border border-border" data-testid="card-feature-reviews">
              <CardContent className="p-6">
                <Star className="text-primary text-3xl mb-3 mx-auto" fill="currentColor" />
                <h3 className="font-semibold mb-2">5-Star Reviews</h3>
                <p className="text-muted-foreground">Trusted by pet parents</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-products-title">Featured Products</h2>
            <p className="text-xl text-muted-foreground">Premium quality products your pets will love</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product: any) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-shadow border border-border" data-testid={`card-product-${product.id}`}>
                <img 
                  src={product.imageUrl || "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                  data-testid={`img-product-${product.id}`}
                />
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2" data-testid={`text-product-name-${product.id}`}>{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3" data-testid={`text-product-description-${product.id}`}>{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-primary" data-testid={`text-product-price-${product.id}`}>${product.price}</span>
                    <Button 
                      className="bg-accent text-accent-foreground hover:opacity-90"
                      onClick={() => handleAddToCart(product.id)}
                      disabled={isAdding}
                      data-testid={`button-add-cart-${product.id}`}
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/api/login">
              <Button className="bg-primary text-primary-foreground px-8 py-3 font-semibold hover:opacity-90" data-testid="button-view-all-products">
                View All Products
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-services-title">Professional Services</h2>
            <p className="text-xl text-muted-foreground">Expert care for your beloved pets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.slice(0, 4).map((service: any) => (
              <Card key={service.id} className="p-6 text-center hover:shadow-xl transition-shadow" data-testid={`card-service-${service.id}`}>
                <CardContent className="p-0">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-primary text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" data-testid={`text-service-name-${service.id}`}>{service.name}</h3>
                  <p className="text-muted-foreground mb-4" data-testid={`text-service-description-${service.id}`}>{service.description}</p>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-primary" data-testid={`text-service-price-${service.id}`}>From ${service.basePrice}</span>
                  </div>
                  <Button 
                    className="w-full bg-accent text-accent-foreground hover:opacity-90"
                    onClick={() => handleBookService(service)}
                    data-testid={`button-book-${service.id}`}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Special Promotions */}
      <section className="py-12 bg-gradient-to-r from-accent to-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4" data-testid="text-promo-title">🎉 Limited Time Offer!</h2>
            <p className="text-xl text-white/90 mb-6">Get 20% off your first order + Free grooming session</p>
            <a href="/api/login">
              <Button className="bg-white text-foreground px-8 py-3 font-semibold hover:bg-gray-100" data-testid="button-claim-offer">
                Claim Offer Now
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Happy Customers Gallery */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4" data-testid="text-gallery-title">Happy Furry Friends</h2>
            <p className="text-xl text-muted-foreground">See the joy we bring to pets and their families</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              "https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
              "https://images.unsplash.com/photo-1574158622682-e40e69881006?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
              "https://images.unsplash.com/photo-15738655273-52738655273?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
              "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300",
              "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300"
            ].map((src, index) => (
              <img 
                key={index}
                src={src}
                alt={`Happy pet ${index + 1}`}
                className="rounded-xl shadow-lg hover:shadow-xl transition-shadow object-cover aspect-square"
                data-testid={`img-gallery-${index}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="text-primary text-xl" fill="currentColor" />
                <span className="text-xl font-bold text-primary">PupShops</span>
              </div>
              <p className="text-muted-foreground">Everything your furry friend needs in one place. Quality products and professional services for dogs and cats.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Products</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Dog Food</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cat Food</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Toys & Accessories</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Health & Wellness</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Services</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Veterinary Care</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Grooming</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pet Boarding</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Dog Walking</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Connect</h4>
              <div className="flex space-x-4 mb-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
              </div>
              <p className="text-muted-foreground text-sm">📧 hello../pupshops.com</p>
              <p className="text-muted-foreground text-sm">📞 (555) 123-PAWS</p>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2023 PupShops. All rights reserved. Made with ❤️ for pet lovers.</p>
          </div>
        </div>
      </footer>

      {isBookingOpen && (
        <BookingModal 
          onClose={() => setIsBookingOpen(false)} 
          selectedService={selectedService}
        />
      )}
    </div>
  );
}