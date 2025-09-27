import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Link } from "react-router-dom";
import { Package, Settings, Home } from "lucide-react";

export function TestHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Cartify Automotive Industries
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Leading manufacturer of high-quality industrial plastic bags
          </p>
          <p className="text-lg text-gray-700">
            Specializing in eco-friendly packaging solutions across India and beyond
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-3">
                <Home className="w-6 h-6 text-primary" />
                Public Website
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Browse our complete website with all sections
              </p>
              <div className="space-y-2">
                <Link to="/about">
                  <Button variant="outline" className="w-full">
                    About Us
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" className="w-full">
                    Our Services
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-3">
                <Settings className="w-6 h-6 text-primary" />
                Admin Panel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Access the admin dashboard to manage products
              </p>
              <div className="space-y-2">
                <Link to="/admin/login">
                  <Button className="w-full">
                    Admin Login
                  </Button>
                </Link>
                <div className="text-xs text-gray-500 mt-2">
                  <p>Email: admin@cartify.com</p>
                  <p>Password: CartifyAdmin2024!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">26</div>
              <div className="text-gray-600">Products</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">12</div>
              <div className="text-gray-600">Machines</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">100%</div>
              <div className="text-gray-600">Eco-Friendly</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="text-2xl font-bold text-primary">15+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
