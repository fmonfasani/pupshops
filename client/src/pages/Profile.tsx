import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import Layout from "../components/Layout";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Calendar, Package, Star, Award, Clock, CheckCircle, Truck, MapPin } from "lucide-react";
import { api } from "../lib/api";

export default function Profile() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: api.getOrders,
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["/api/bookings"],
    queryFn: api.getBookings,
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const getUserLevel = (points: number) => {
    if (points >= 2000) return { level: 'Gold', color: 'text-yellow-600', progress: 100, nextLevel: 'Gold (Max)' };
    if (points >= 1000) return { level: 'Silver', color: 'text-gray-600', progress: (points - 1000) / 1000 * 100, nextLevel: 'Gold' };
    return { level: 'Bronze', color: 'text-amber-600', progress: points / 1000 * 100, nextLevel: 'Silver' };
  };

  const userLevelInfo = getUserLevel(user?.points || 0);
  const pointsToNext = userLevelInfo.level === 'Bronze' ? 1000 - (user?.points || 0) : 
                      userLevelInfo.level === 'Silver' ? 2000 - (user?.points || 0) : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': case 'completed': return 'bg-primary text-primary-foreground';
      case 'shipped': case 'confirmed': return 'bg-accent text-accent-foreground';
      case 'processing': case 'scheduled': return 'bg-blue-500 text-white';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getOrderIcon = (status: string) => {
    switch (status) {
      case 'delivered': return CheckCircle;
      case 'shipped': return Truck;
      case 'processing': return Clock;
      default: return Package;
    }
  };

  return (
    <Layout>
      <div className="py-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-card p-6 rounded-xl shadow-lg border border-border mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex-shrink-0">
                <img 
                  src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                  data-testid="img-profile-avatar"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2" data-testid="text-profile-name">
                  {user?.firstName || user?.email?.split('..')[0] || 'Pet Parent'}
                </h1>
                <p className="text-muted-foreground mb-4" data-testid="text-profile-email">{user?.email}</p>
                
                {/* Points and Level */}
                <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
                  <div className="flex items-center gap-2">
                    <Star className="text-primary" fill="currentColor" />
                    <span className="text-lg font-semibold" data-testid="text-profile-points">{user?.points || 0} Paw Points</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className={`${userLevelInfo.color}`} />
                    <span className={`font-semibold ${userLevelInfo.color}`} data-testid="text-profile-level">{userLevelInfo.level} Member</span>
                  </div>
                </div>

                {/* Progress to next level */}
                {pointsToNext > 0 && (
                  <div className="mt-4 max-w-md">
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <span>Progress to {userLevelInfo.nextLevel}</span>
                      <span>{pointsToNext} points needed</span>
                    </div>
                    <Progress value={userLevelInfo.progress} className="h-2" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tabs for Orders and Bookings */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="orders" data-testid="tab-orders">Order History</TabsTrigger>
              <TabsTrigger value="bookings" data-testid="tab-bookings">My Appointments</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="text-primary" />
                    Order History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8" data-testid="text-no-orders">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders yet. Start shopping to see your order history!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => {
                        const StatusIcon = getOrderIcon(order.status);
                        return (
                          <Card key={order.id} className="border border-border" data-testid={`card-order-${order.id}`}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <p className="font-semibold" data-testid={`text-order-id-${order.id}`}>
                                    Order #{order.id.slice(-8).toUpperCase()}
                                  </p>
                                  <p className="text-sm text-muted-foreground" data-testid={`text-order-date-${order.id}`}>
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge className={getStatusColor(order.status)} data-testid={`badge-order-status-${order.id}`}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {order.status}
                                </Badge>
                              </div>
                              
                              {order.items && (
                                <div className="space-y-2 mb-3">
                                  {order.items.map((item: any) => (
                                    <div key={item.id} className="flex justify-between items-center text-sm" data-testid={`item-order-${item.id}`}>
                                      <span data-testid={`text-item-name-${item.id}`}>{item.product.name} x{item.quantity}</span>
                                      <span data-testid={`text-item-price-${item.id}`}>${item.price}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              <div className="flex justify-between items-center pt-3 border-t border-border">
                                <span className="font-semibold">Total: <span className="text-primary" data-testid={`text-order-total-${order.id}`}>${order.totalAmount}</span></span>
                                {order.shippingAddress && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <MapPin className="w-3 h-3" />
                                    <span data-testid={`text-shipping-${order.id}`}>To: {order.shippingAddress.slice(0, 30)}...</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="text-accent" />
                    My Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {bookings.length === 0 ? (
                    <div className="text-center py-8" data-testid="text-no-bookings">
                      <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No appointments booked yet. Book a service to see your appointments here!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking: any) => (
                        <Card key={booking.id} className="border border-border" data-testid={`card-booking-${booking.id}`}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="font-semibold" data-testid={`text-booking-service-${booking.id}`}>{booking.service.name}</p>
                                <p className="text-sm text-muted-foreground" data-testid={`text-booking-pet-${booking.id}`}>
                                  {booking.petName} ({booking.petType})
                                </p>
                              </div>
                              <Badge className={getStatusColor(booking.status)} data-testid={`badge-booking-status-${booking.id}`}>
                                {booking.status}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                              <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span data-testid={`text-booking-date-${booking.id}`}>
                                  {new Date(booking.appointmentDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <Clock className="w-4 h-4 text-accent" />
                                <span data-testid={`text-booking-time-${booking.id}`}>{booking.appointmentTime}</span>
                              </div>
                            </div>

                            {booking.notes && (
                              <div className="mb-3">
                                <p className="text-sm text-muted-foreground">
                                  <strong>Notes:</strong> <span data-testid={`text-booking-notes-${booking.id}`}>{booking.notes}</span>
                                </p>
                              </div>
                            )}

                            <div className="flex justify-between items-center pt-3 border-t border-border">
                              <span className="font-semibold">
                                Price: <span className="text-primary" data-testid={`text-booking-price-${booking.id}`}>${booking.price}</span>
                              </span>
                              <span className="text-sm text-muted-foreground" data-testid={`text-booking-created-${booking.id}`}>
                                Booked on {new Date(booking.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Points and Rewards Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="text-primary" fill="currentColor" />
                Paw Points & Rewards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2" data-testid="text-total-points">{user?.points || 0}</div>
                  <p className="text-muted-foreground">Total Points Earned</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold mb-2 ${userLevelInfo.color}`} data-testid="text-current-level">
                    {userLevelInfo.level}
                  </div>
                  <p className="text-muted-foreground">Current Level</p>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-accent mb-2" data-testid="text-points-to-next">
                    {pointsToNext > 0 ? pointsToNext : '🎉'}
                  </div>
                  <p className="text-muted-foreground">
                    {pointsToNext > 0 ? `Points to ${userLevelInfo.nextLevel}` : 'Max Level Reached!'}
                  </p>
                </div>
              </div>

              {pointsToNext > 0 && (
                <div className="mt-6">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Progress to {userLevelInfo.nextLevel}</span>
                    <span>{userLevelInfo.progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={userLevelInfo.progress} className="h-3" />
                </div>
              )}

              <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                <h4 className="font-semibold mb-2">How to Earn Points:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• 1 point for every $1 spent on products</li>
                  <li>• 1 point for every $10 spent on services</li>
                  <li>• Bonus points for reviews and referrals</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
