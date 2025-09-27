import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Settings, Zap, Award, Calendar, Gauge, Factory } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { useRealtimeData } from "../contexts/RealtimeDataContext";

export function MachinerySection() {
  const { machinery, loading } = useRealtimeData();
  const [showAll, setShowAll] = useState(false);

  const getIconForCategory = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('extrusion')) return Factory;
    if (categoryLower.includes('printing')) return Settings;
    if (categoryLower.includes('cutting') || categoryLower.includes('sealing')) return Zap;
    if (categoryLower.includes('quality') || categoryLower.includes('testing')) return Award;
    if (categoryLower.includes('automation') || categoryLower.includes('packaging')) return Gauge;
    return Settings; // default icon
  };

  const getColorForCategory = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('extrusion')) return "bg-primary/10 text-primary";
    if (categoryLower.includes('printing')) return "bg-secondary/10 text-secondary";
    if (categoryLower.includes('cutting') || categoryLower.includes('sealing')) return "bg-blue-50 text-blue-600";
    if (categoryLower.includes('quality') || categoryLower.includes('testing')) return "bg-green-50 text-green-600";
    if (categoryLower.includes('automation') || categoryLower.includes('packaging')) return "bg-purple-50 text-purple-600";
    return "bg-gray-50 text-gray-600"; // default color
  };

  return (
    <section id="machinery" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Factory className="w-8 h-8 text-primary" />
            <span className="text-sm text-primary font-semibold uppercase tracking-wide">
              Manufacturing Excellence
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Our Advanced Machinery
          </h2>
          <p className="text-lg text-muted-foreground">
            State-of-the-art manufacturing equipment that enables us to deliver exceptional quality and efficiency in plastic bag production.
          </p>
        </div>

        {/* Machinery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="border-0 shadow-md h-full overflow-hidden">
                <div className="aspect-video bg-gray-200 animate-pulse"></div>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse mb-3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                  <div className="flex space-x-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                    <div className="h-6 bg-gray-200 rounded animate-pulse w-20"></div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : machinery.length > 0 ? (
            // Display machinery
            (showAll ? machinery : machinery.slice(0, 6)).map((machine, index) => {
              const Icon = getIconForCategory(machine.category || 'general');
              return (
                <Card key={machine.id} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 h-full overflow-hidden group">
                  {/* Machine Image */}
                  <div className="aspect-video overflow-hidden">
                    <ImageWithFallback
                      src={machine.imageUrl}
                      alt={machine.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  <CardContent className="p-6">
                    {/* Category Badge */}
                    <div className="flex items-center space-x-2 mb-3">
                      <div className={`w-8 h-8 rounded-lg ${getColorForCategory(machine.category)} flex items-center justify-center`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {machine.category}
                      </Badge>
                    </div>

                    {/* Machine Name */}
                    <h3 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                      {machine.name}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                      {machine.description.length > 150 
                        ? `${machine.description.substring(0, 150)}...` 
                        : machine.description}
                    </p>

                    {/* Key Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Manufacturer:</span>
                        <span className="font-medium">{machine.manufacturer}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Capacity:</span>
                        <span className="font-medium">{machine.capacity}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Year Installed:</span>
                        <span className="font-medium">{machine.yearInstalled}</span>
                      </div>
                    </div>

                    {/* Key Specifications */}
                    {machine.specifications.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-foreground">Key Features:</h4>
                        {machine.specifications.slice(0, 3).map((spec, specIndex) => (
                          <div key={specIndex} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0 mt-2"></div>
                            <span className="text-xs text-muted-foreground">{spec}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          ) : (
            // No machinery found
            <div className="col-span-full text-center py-12">
              <Factory className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Machinery Data</h3>
              <p className="text-muted-foreground">
                Machinery information will be displayed here once loaded.
              </p>
            </div>
          )}
        </div>

        {/* Show More/Less Button */}
        {!loading && machinery.length > 6 && (
          <div className="text-center mb-16">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium"
            >
              {showAll ? `Show Less Machinery` : `Show All ${machinery.length} Machines`}
            </button>
          </div>
        )}

        {/* Featured Machine Section */}
        {!loading && machinery.length > 0 && (
          <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Content */}
              <div className="p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-center">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Factory className="w-6 h-6 text-primary" />
                    <span className="text-sm text-primary font-semibold uppercase tracking-wide">
                      Featured Equipment
                    </span>
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">
                    {machinery[0].name}
                  </h3>
                  <p className="text-lg text-muted-foreground">
                    {machinery[0].description}
                  </p>
                  
                  {/* Machine Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Manufacturer</p>
                      <p className="font-semibold">{machinery[0].manufacturer}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Capacity</p>
                      <p className="font-semibold">{machinery[0].capacity}</p>
                    </div>
                  </div>

                  {/* Top Specifications */}
                  {machinery[0].specifications.length > 0 && (
                    <div className="space-y-3">
                      {machinery[0].specifications.slice(0, 4).map((spec, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">{spec}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Image */}
              <div className="aspect-square lg:aspect-auto">
                <ImageWithFallback
                  src={machinery[0].imageUrl}
                  alt={machinery[0].name}
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
