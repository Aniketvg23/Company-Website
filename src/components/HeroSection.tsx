import { Button } from "./ui/button";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, Shield, Leaf, Star } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-orange-50 to-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                <span>Leading Industrial Packaging Solutions</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                High-Quality
                <span className="block text-primary">Industrial Plastic Bags</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Delivering innovative, eco-friendly, and cost-effective packaging solutions to industries across India and beyond. Your trusted partner for all packaging needs.
              </p>
            </div>

            {/* Key Features */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-700">Eco-Friendly</span>
              </div>
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-full">
                <Star className="w-4 h-4 text-primary" />
                <span className="text-sm text-primary">Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-full">
                <Shield className="w-4 h-4 text-secondary" />
                <span className="text-sm text-secondary">Reliable</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button size="lg" className="text-base">
                  Let's Connect
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="text-base">
                  View Products
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">10+</div>
                <div className="text-sm text-muted-foreground">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-sm text-muted-foreground">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Quality Assured</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="aspect-square lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://plus.unsplash.com/premium_photo-1661943377898-a0e4a0f0e359?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Industrial packaging manufacturing facility"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating Card */}
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-white p-3 sm:p-4 rounded-lg shadow-lg max-w-xs">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-xs sm:text-sm">Sustainable Solutions</div>
                  <div className="text-xs text-muted-foreground">Eco-friendly materials</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
