import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Building2, Star, MapPin, Briefcase } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useRealtimeData } from "../contexts/RealtimeDataContext";

export function CustomersSection() {
  const { customers, loading } = useRealtimeData();

  const getPartnershipColor = (partnership: string) => {
    switch (partnership) {
      case 'Premium Partner':
        return 'bg-gradient-to-r from-primary to-secondary text-white';
      case 'Strategic Partner':
        return 'bg-blue-500 text-white';
      case 'Long-term Client':
        return 'bg-green-500 text-white';
      case 'Key Account':
        return 'bg-purple-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPartnershipIcon = (partnership: string) => {
    if (partnership === 'Premium Partner' || partnership === 'Strategic Partner') {
      return <Star className="w-3 h-3" />;
    }
    return <Building2 className="w-3 h-3" />;
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 text-primary border-primary">
            Our Valued Customers
          </Badge>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            We're proud to partner with leading companies across various industries, delivering exceptional packaging solutions that drive their success.
          </p>
        </div>

        {loading ? (
          // Loading skeleton
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="p-6">
                <CardContent className="p-0">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl animate-pulse"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                    </div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : customers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {customers.map((customer) => (
              <Card key={customer.id} className="p-6 hover:shadow-lg transition-shadow duration-300 group">
                <CardContent className="p-0">
                  {/* Company Header */}
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
                      {customer.logoUrl ? (
                        <ImageWithFallback
                          src={customer.logoUrl}
                          alt={customer.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                        {customer.name}
                      </h3>
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Briefcase className="w-3 h-3" />
                        <span className="truncate">{customer.industry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {customer.description.length > 120 
                      ? `${customer.description.substring(0, 120)}...` 
                      : customer.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{customer.location}</span>
                    </div>
                    <Badge 
                      className={`text-xs ${getPartnershipColor(customer.partnership)} flex items-center space-x-1`}
                    >
                      {getPartnershipIcon(customer.partnership)}
                      <span>{customer.partnership}</span>
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // No customers found
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Customer Data</h3>
            <p className="text-muted-foreground">
              Customer information will be displayed here once loaded.
            </p>
          </div>
        )}

        {/* Trust Indicators */}
        {!loading && customers.length > 0 && (
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{customers.length}+</div>
                <div className="text-sm text-muted-foreground">Trusted Partners</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {[...new Set(customers.map(c => c.industry))].length}+
                </div>
                <div className="text-sm text-muted-foreground">Industries Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">15+</div>
                <div className="text-sm text-muted-foreground">Years of Trust</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
