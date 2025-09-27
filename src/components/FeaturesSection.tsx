import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Award, Users, Globe, Clock, Leaf, Zap, Factory, Settings, Gauge, Cpu } from "lucide-react";
import { MachinerySection } from "./MachinerySection";

export function FeaturesSection() {
  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      description: "Industry-leading quality standards with comprehensive testing and certification."
    },
    {
      icon: Users,
      title: "Expert Team",
      description: "Experienced professionals dedicated to delivering exceptional packaging solutions."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Serving clients across India and expanding to international markets."
    },
    {
      icon: Clock,
      title: "Timely Delivery",
      description: "Reliable delivery schedules to keep your operations running smoothly."
    },
    {
      icon: Leaf,
      title: "Sustainable Practices",
      description: "Environmentally responsible manufacturing with eco-friendly materials."
    },
    {
      icon: Zap,
      title: "Innovation Focus",
      description: "Cutting-edge technology and continuous improvement in all processes."
    }
  ];

  return (
    <section id="features" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
                Why Choose Cartify Automotive Industries?
              </h2>
              <p className="text-lg text-muted-foreground">
                We combine years of expertise with innovative technology to deliver packaging solutions that exceed expectations. Our commitment to quality and sustainability sets us apart in the industry.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-foreground">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 sm:p-8 text-white">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold">10+</div>
                  <div className="text-xs sm:text-sm text-orange-100">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold">50+</div>
                  <div className="text-xs sm:text-sm text-orange-100">Satisfied Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold">1M+</div>
                  <div className="text-xs sm:text-sm text-orange-100">Products Delivered</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold">24/7</div>
                  <div className="text-xs sm:text-sm text-orange-100">Customer Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1686632800715-b705ba1b0eb6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlY28lMjBmcmllbmRseSUyMHBhY2thZ2luZ3xlbnwxfHx8fDE3NTY4OTAyNTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Eco-friendly packaging solutions"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
              Eco-Certified
            </div>

            {/* Bottom Card */}
            <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4 bg-white/95 backdrop-blur-sm p-3 sm:p-4 rounded-lg shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-xs sm:text-sm">Sustainability Commitment</div>
                  <div className="text-xs text-muted-foreground">100% recyclable materials</div>
                </div>
                <Leaf className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* Manufacturing Excellence Section */}
        <div className="mt-24 pt-16 border-t border-gray-100">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Factory className="w-8 h-8 text-primary" />
              <span className="text-sm text-primary font-semibold uppercase tracking-wide">
                Manufacturing Excellence
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              State-of-the-Art Machinery
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our advanced manufacturing equipment ensures precision, efficiency, and consistent quality in every product we deliver.
            </p>
          </div>

          {/* Machinery Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Factory className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Advanced Extrusion</h3>
              <p className="text-muted-foreground text-sm">
                Multi-layer blown film extrusion lines with precise thickness control and superior barrier properties.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Settings className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Precision Printing</h3>
              <p className="text-muted-foreground text-sm">
                High-speed flexographic printing with 8-color capability and exceptional print registration.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Gauge className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Automated Production</h3>
              <p className="text-muted-foreground text-sm">
                Fully automated bag making machines with servo-driven systems and quality inspection sensors.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Cpu className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Control</h3>
              <p className="text-muted-foreground text-sm">
                Advanced testing laboratory with comprehensive quality analysis equipment and real-time monitoring.
              </p>
            </div>
          </div>

          {/* Machinery Showcase */}
          <div id="machinery-showcase" className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Factory className="w-6 h-6 text-primary" />
                    <span className="text-sm text-primary font-semibold uppercase tracking-wide">
                      Cutting-Edge Technology
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-foreground">
                    Industry-Leading Equipment
                  </h3>
                  <p className="text-muted-foreground">
                    Our facility houses state-of-the-art machinery from world-renowned manufacturers, ensuring we deliver products that meet the highest industry standards.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium">12+ Advanced Machines</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-sm font-medium">500+ kg/hour Capacity</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium">Real-time Monitoring</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                      <span className="text-sm font-medium">Automated Quality Control</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href="#detailed-machinery"
                    className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    View Detailed Equipment List
                    <Zap className="w-4 h-4 ml-2" />
                  </a>
                </div>
              </div>

              <div className="relative">
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1701448149957-b96dbd1926ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwZXh0cnVzaW9uJTIwbWFjaGluZSUyMGluZHVzdHJpYWx8ZW58MXx8fHwxNzU3NDA3NzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Advanced plastic extrusion machinery"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Stats */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-primary">99.9%</div>
                    <div className="text-xs text-muted-foreground">Efficiency Rate</div>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-5 h-5 text-secondary" />
                    <div>
                      <div className="text-sm font-semibold">Multi-Layer Extrusion</div>
                      <div className="text-xs text-muted-foreground">7-layer capability</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Machinery Section */}
      
    </section>
  );
}
