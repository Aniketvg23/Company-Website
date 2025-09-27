import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Target, Eye, Heart, CheckCircle } from "lucide-react";
import { Card, CardContent } from "./ui/card";

export function AboutSection() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            About Cartify Automotive Industries
          </h2>
          <p className="text-lg text-muted-foreground">
            Leading manufacturer of high-quality industrial plastic bags, specializing in innovative, eco-friendly, and cost-effective packaging solutions.
          </p>
        </div>

        {/* Mission, Vision, Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Mission */}
          <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                Deliver reliable, eco-friendly, and cost-effective packaging solutions that meet the evolving needs of industries worldwide.
              </p>
            </CardContent>
          </Card>

          {/* Vision */}
          <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To become a trusted global partner for packaging needs, setting industry standards for quality and sustainability.
              </p>
            </CardContent>
          </Card>

          {/* Values */}
          <Card className="border-2 border-transparent hover:border-primary/20 transition-colors">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Our Values</h3>
              <div className="space-y-2 text-muted-foreground">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Quality</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Sustainability</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Reliability</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Innovation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content with Image */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content - appears first on mobile */}
          <div className="space-y-6 lg:order-2">
            <h3 className="text-2xl font-bold text-foreground">
              Excellence in Industrial Packaging
            </h3>
            <p className="text-muted-foreground">
              With years of experience in the packaging industry, Cartify Automotive Industries has established itself as a leader in manufacturing high-quality industrial plastic bags. We serve industries across India and beyond, providing solutions that meet the highest standards of quality and environmental responsibility.
            </p>
            <p className="text-muted-foreground">
              Our commitment to innovation drives us to continuously improve our products and processes, ensuring that our clients receive packaging solutions that are not only effective but also sustainable and cost-efficient.
            </p>

            {/* Key Points */}
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">State-of-the-art Manufacturing</h4>
                  <p className="text-sm text-muted-foreground">Modern facilities equipped with latest technology</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Quality Assurance</h4>
                  <p className="text-sm text-muted-foreground">Rigorous testing and quality control processes</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Eco-Friendly Solutions</h4>
                  <p className="text-sm text-muted-foreground">Sustainable materials and processes</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image - appears second on mobile */}
          <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl lg:order-1">
            <ImageWithFallback
              src="https://plus.unsplash.com/premium_photo-1663011383177-8915a87ce5f2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Modern manufacturing facility"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
