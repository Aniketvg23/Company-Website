import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Package, Truck, Shield, Recycle, Factory, Lightbulb } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { useRealtimeData } from "../contexts/RealtimeDataContext";

export function ServicesSection() {
  const { products, loading } = useRealtimeData();
  const [showAll, setShowAll] = useState(false);

  // Fallback services for when no products are available
  const defaultServices = [
    {
      icon: Package,
      title: "Custom Packaging Solutions",
      description: "Tailored plastic bags designed to meet specific industry requirements and specifications.",
      color: "bg-orange-50 text-primary"
    },
    {
      icon: Factory,
      title: "Industrial Grade Manufacturing",
      description: "High-strength plastic bags for heavy-duty industrial applications and storage needs.",
      color: "bg-red-50 text-secondary"
    },
    {
      icon: Recycle,
      title: "Eco-Friendly Options",
      description: "Sustainable packaging solutions using recyclable and biodegradable materials.",
      color: "bg-green-50 text-green-600"
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "Rigorous testing and quality control ensuring consistent product excellence.",
      color: "bg-orange-50 text-primary"
    },
    {
      icon: Truck,
      title: "Reliable Distribution",
      description: "Efficient logistics and delivery network across India and international markets.",
      color: "bg-red-50 text-secondary"
    },
    {
      icon: Lightbulb,
      title: "Innovation & R&D",
      description: "Continuous research and development for next-generation packaging solutions.",
      color: "bg-orange-50 text-primary"
    }
  ];

  const getIconForCategory = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('packaging')) return Package;
    if (categoryLower.includes('industrial')) return Factory;
    if (categoryLower.includes('eco') || categoryLower.includes('green')) return Recycle;
    if (categoryLower.includes('quality')) return Shield;
    if (categoryLower.includes('distribution') || categoryLower.includes('delivery')) return Truck;
    return Package; // default icon
  };

  const getColorForIndex = (index: number) => {
    const colors = [
      "bg-orange-50 text-primary",
      "bg-red-50 text-secondary", 
      "bg-green-50 text-green-600",
      "bg-blue-50 text-blue-600",
      "bg-purple-50 text-purple-600",
      "bg-yellow-50 text-yellow-600"
    ];
    return colors[index % colors.length];
  };

  return (
    <section id="services" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Our Services & Solutions
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive packaging solutions designed to meet diverse industrial needs with quality, reliability, and sustainability at the forefront.
          </p>
        </div>

        {/* Products/Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 12 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-md h-full overflow-hidden">
                <div className="aspect-video bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-20"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : products.length > 0 ? (
            // Display products from database
            (showAll ? products : products.slice(0, 12)).map((product, index) => {
              const Icon = getIconForCategory(product.category || 'general');
              return (
                <Card key={product.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full overflow-hidden group">
                  {/* Product Image */}
                  {product.imageUrl ? (
                    <div className="aspect-video overflow-hidden">
                      <ImageWithFallback
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className={`aspect-video ${getColorForIndex(index)} flex items-center justify-center`}>
                      <Icon className="w-12 h-12" />
                    </div>
                  )}
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                      {product.description.length > 150 
                        ? `${product.description.substring(0, 150)}...` 
                        : product.description}
                    </p>
                    {product.features.length > 0 && (
                      <div className="space-y-2">
                        {product.features.slice(0, 3).map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-xs text-muted-foreground">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            // Fallback to default services
            defaultServices.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow h-full">
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 rounded-lg ${service.color} flex items-center justify-center mb-6`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Show More/Less Button */}
        {!loading && products.length > 12 && (
          <div className="text-center mb-16">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
            >
              {showAll ? `Show Less Products` : `Show All ${products.length} Products`}
            </button>
          </div>
        )}

        {/* Featured Product Section */}
        {products.length > 0 && (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Content */}
              <div className="p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Package className="w-6 h-6 text-primary" />
                    <span className="text-sm text-primary font-semibold uppercase tracking-wide">
                      Featured Product
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">
                    {products[0].name}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {products[0].description}
                  </p>
                  {products[0].features.length > 0 && (
                    <div className="space-y-3">
                      {products[0].features.slice(0, 4).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Image */}
              <div className="aspect-square lg:aspect-auto">
                <ImageWithFallback
                  src={products[0].imageUrl || "https://images.unsplash.com/photo-1637251393438-30eca8828253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwYmFncyUyMGluZHVzdHJpYWx8ZW58MXx8fHwxNzU2ODkyNzUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"}
                  alt={products[0].name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Fallback Featured Section when no products */}
        {!loading && products.length === 0 && (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Content */}
              <div className="p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Package className="w-6 h-6 text-primary" />
                    <span className="text-sm text-primary font-semibold uppercase tracking-wide">
                      Featured Solution
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">
                    Premium Industrial Plastic Bags
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    Our flagship product line offers superior strength, durability, and customization options for various industrial applications. Made with eco-friendly materials and cutting-edge manufacturing processes.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">Heavy-duty construction for demanding applications</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">Customizable sizes and specifications</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">Eco-friendly materials and production</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-muted-foreground">Competitive pricing and bulk discounts</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image */}
              <div className="aspect-square lg:aspect-auto">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1637251393438-30eca8828253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwYmFncyUyMGluZHVzdHJpYWx8ZW58MXx8fHwxNzU2ODkyNzUzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Industrial plastic bags"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
