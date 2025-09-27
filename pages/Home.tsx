import { HeroSection } from "../components/HeroSection";
import { CustomersSection } from "../components/CustomersSection";
import { FirebaseSetupBanner } from "../components/FirebaseSetupBanner";
import { FirebaseStatusBanner } from "../components/FirebaseStatusBanner";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Badge } from "../components/ui/badge";
import { 
  Leaf, 
  Shield, 
  Star, 
  Award,
  Users,
  Factory,
  Globe,
  CheckCircle,
  ArrowRight,
  Zap,
  Heart,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <main>
      <div className="px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto">
          <FirebaseStatusBanner />
        </div>
      </div>
      <HeroSection />
      
      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-primary border-primary">
              About Cartify Automotive Industries
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Leading the Future of Packaging Innovation
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              For over 10 years, Cartify Automotive Industries has been at the forefront of industrial plastic bag manufacturing, 
              delivering innovative solutions that meet the evolving needs of businesses across India and internationally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Quality Excellence</h3>
              <p className="text-sm text-muted-foreground">
                ISO certified manufacturing processes ensuring the highest quality standards
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Sustainability</h3>
              <p className="text-sm text-muted-foreground">
                Committed to eco-friendly materials and sustainable manufacturing practices
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Global Reach</h3>
              <p className="text-sm text-muted-foreground">
                Serving clients across India and expanding internationally with reliable delivery
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Innovation</h3>
              <p className="text-sm text-muted-foreground">
                Cutting-edge technology and continuous R&D for advanced packaging solutions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gradient-to-br from-accent to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4 text-primary border-primary">
                Why Choose Cartify
              </Badge>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
                Your Trusted Partner for All Packaging Needs
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                We combine years of expertise with cutting-edge technology to deliver packaging solutions 
                that exceed expectations and drive business growth.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Advanced Manufacturing</h4>
                    <p className="text-muted-foreground">State-of-the-art facilities with automated production lines</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Custom Solutions</h4>
                    <p className="text-muted-foreground">Tailored packaging solutions to meet specific industry requirements</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">24/7 Support</h4>
                    <p className="text-muted-foreground">Round-the-clock customer service and technical assistance</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1">Competitive Pricing</h4>
                    <p className="text-muted-foreground">Cost-effective solutions without compromising on quality</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link to="/about">
                  <Button size="lg" className="text-base">
                    Learn More About Us
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://cdn-apcld.nitrocdn.com/MnXBIOaQaPQJSbBkdzAQyCzSROUJMaHD/assets/images/optimized/rev-a2ecb81/www.gbfoamdirect.co.uk/wp-content/uploads/2023/01/how-cut-foam.jpg"
                  alt="Modern manufacturing facility"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Categories Preview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4 text-primary border-primary">
              Our Products
            </Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              Comprehensive Packaging Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              From heavy-duty industrial bags to specialized packaging materials, we offer a complete range 
              of products designed to meet diverse industry needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <ImageWithFallback
                    src="https://idealpkg.com/wp-content/uploads/2024/05/different-types-poly-bags.webp"
                    alt="Industrial plastic bags"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold mb-2">Industrial Bags</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Heavy-duty plastic bags for industrial applications with superior strength and durability.
                </p>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">Most Popular</Badge>
                  <Link to="/services">
                    <Button variant="ghost" size="sm">
                      View Details
                      <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <ImageWithFallback
                    src="https://i5.walmartimages.com/seo/Stock-Your-Home-Eco-Grocery-Bags-100-Count-Biodegradable-Plastic-Reusable-Supermarket-Thank-You-Shopping-Bags-Recyclable-T-Shirt-Small-Trash-Can_28f431da-a66c-49f2-93d6-0e03081b0a91.3417995c36cef9a46fcd4f7664474c57.jpeg"
                    alt="Eco-friendly packaging"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold mb-2">Eco-Friendly Solutions</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Sustainable packaging options made from recyclable and biodegradable materials.
                </p>
                <div className="flex justify-between items-center">
                  <Badge className="bg-green-100 text-green-700">Eco-Friendly</Badge>
                  <Link to="/services">
                    <Button variant="ghost" size="sm">
                      View Details
                      <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <ImageWithFallback
                    src="https://swamipolymers.com/wp-content/uploads/2025/06/Recycled-Plastic-Granules-Innovation.png"
                    alt="Custom packaging solutions"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-semibold mb-2">Custom Solutions</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Tailored packaging solutions designed to meet specific industry and client requirements.
                </p>
                <div className="flex justify-between items-center">
                  <Badge variant="outline">Customizable</Badge>
                  <Link to="/services">
                    <Button variant="ghost" size="sm">
                      View Details
                      <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link to="/services">
              <Button size="lg" variant="outline" className="text-base">
                View All Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Customers */}
      <CustomersSection />

      {/* Industry Stats */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg opacity-90 max-w-3xl mx-auto">
              Our commitment to excellence has made us the preferred choice for businesses across various industries.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">50+</div>
              <div className="text-sm opacity-90">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">10+</div>
              <div className="text-sm opacity-90">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">1M+</div>
              <div className="text-sm opacity-90">Bags Produced</div>
            </div>
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-bold mb-2">100%</div>
              <div className="text-sm opacity-90">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Ready to Partner with Us?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join hundreds of satisfied clients who trust Cartify Automotive Industries for their packaging needs. 
              Let's discuss how we can help your business grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/contact">
                <Button size="lg" className="text-base">
                  Get Free Quote
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="text-base">
                  Explore Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
