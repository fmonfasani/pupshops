import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import BookingModal from "@/components/BookingModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Heart, Search, Stethoscope, Scissors, Home, Dog } from "lucide-react";
import { api } from "@/lib/api";

export default function Services() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [petFilter, setPetFilter] = useState("");
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  
  const { data: services = [] } = useQuery({
    queryKey: ["/api/services"],
    queryFn: api.getServices,
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

  // Filter services based on search and pet type
  const filteredServices = services.filter((service: any) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPetType = !petFilter || service.petType === petFilter || service.petType === 'both';
    
    return matchesSearch && matchesPetType;
  });

  const handleBookService = (service: any) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('veterinary') || name.includes('vet')) return Stethoscope;
    if (name.includes('grooming') || name.includes('spa')) return Scissors;
    if (name.includes('boarding') || name.includes('daycare')) return Home;
    if (name.includes('walking') || name.includes('walk')) return Dog;
    return Heart;
  };

  return (
    <Layout>
      <div className="py-8 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4" data-testid="text-services-page-title">Professional Pet Services</h1>
            <p className="text-xl text-muted-foreground">Expert care and services for your beloved companions</p>
          </div>

          {/* Filters */}
          <div className="bg-card p-6 rounded-xl shadow-lg border border-border mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search-services"
                />
              </div>

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
                  setPetFilter("");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service: any) => {
              const IconComponent = getServiceIcon(service.name);
              return (
                <Card key={service.id} className="p-6 text-center hover:shadow-xl transition-shadow border border-border" data-testid={`card-service-${service.id}`}>
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="text-primary text-2xl" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2" data-testid={`text-service-name-${service.id}`}>{service.name}</h3>
                    <p className="text-muted-foreground mb-4" data-testid={`text-service-description-${service.id}`}>{service.description}</p>
                    
                    {service.duration && (
                      <div className="flex items-center justify-center gap-2 mb-4 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span data-testid={`text-service-duration-${service.id}`}>{service.duration} minutes</span>
                      </div>
                    )}

                    <div className="mb-4">
                      <span className="text-2xl font-bold text-primary" data-testid={`text-service-price-${service.id}`}>
                        From ${service.basePrice}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4 justify-center">
                      <span className="text-xs bg-accent/20 text-accent-foreground px-2 py-1 rounded-full capitalize" data-testid={`text-service-pet-type-${service.id}`}>
                        {service.petType === 'both' ? 'Dogs & Cats' : service.petType}
                      </span>
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
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12" data-testid="text-no-services">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No services found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {isBookingOpen && (
        <BookingModal 
          onClose={() => setIsBookingOpen(false)} 
          selectedService={selectedService}
        />
      )}
    </Layout>
  );
}
