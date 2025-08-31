import CartModal from "./CartModal";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "../components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { ShoppingCart, Menu, X, Heart, Star } from "lucide-react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { cartItemCount } = useCart();
  const [location] = useLocation();

  return (
    <>
      <nav className="sticky top-0 z-50 glass-effect border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2" data-testid="link-home">
                <Heart className="text-primary text-2xl" fill="currentColor" />
                <span className="text-2xl font-bold text-primary">PupShops</span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/products" data-testid="link-products">
                  <span className={`text-muted-foreground hover:text-primary transition-colors ${location === '/products' ? 'text-primary font-medium' : ''}`}>
                    Products
                  </span>
                </Link>
                <Link href="/services" data-testid="link-services">
                  <span className={`text-muted-foreground hover:text-primary transition-colors ${location === '/services' ? 'text-primary font-medium' : ''}`}>
                    Services
                  </span>
                </Link>
                {isAuthenticated && (
                  <Link href="/profile" data-testid="link-profile">
                    <span className={`text-muted-foreground hover:text-primary transition-colors ${location === '/profile' ? 'text-primary font-medium' : ''}`}>
                      Profile
                    </span>
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link href="/admin" data-testid="link-admin">
                    <span className={`text-muted-foreground hover:text-primary transition-colors ${location === '/admin' ? 'text-primary font-medium' : ''}`}>
                      Admin
                    </span>
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <>
                  <button 
                    className="relative p-2 text-muted-foreground hover:text-primary transition-colors"
                    onClick={() => setIsCartOpen(true)}
                    data-testid="button-cart"
                  >
                    <ShoppingCart className="text-xl" />
                    {cartItemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium" data-testid="text-cart-count">
                        {cartItemCount}
                      </span>
                    )}
                  </button>
                  <div className="flex items-center space-x-2">
                    {user?.profileImageUrl && (
                      <img 
                        src={user.profileImageUrl} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full object-cover"
                        data-testid="img-profile"
                      />
                    )}
                    <div className="flex items-center space-x-1">
                      <Star className="text-primary text-sm" fill="currentColor" />
                      <span className="text-sm font-medium text-primary" data-testid="text-points">{user?.points || 0}</span>
                    </div>
                    <a href="/api/logout" data-testid="button-logout">
                      <Button variant="outline" size="sm">
                        Log Out
                      </Button>
                    </a>
                  </div>
                </>
              )}
              {!isAuthenticated && (
                <a href="/api/login" data-testid="button-login">
                  <Button className="bg-primary text-primary-foreground hover:opacity-90">
                    Sign In
                  </Button>
                </a>
              )}
              <button 
                className="md:hidden p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-border py-4">
              <div className="flex flex-col space-y-3">
                <Link href="/products" data-testid="link-products-mobile">
                  <span className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
                    Products
                  </span>
                </Link>
                <Link href="/services" data-testid="link-services-mobile">
                  <span className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
                    Services
                  </span>
                </Link>
                {isAuthenticated && (
                  <Link href="/profile" data-testid="link-profile-mobile">
                    <span className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors">
                      Profile
                    </span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Modal */}
      {isCartOpen && <CartModal onClose={() => setIsCartOpen(false)} />}
    </>
  );
}
