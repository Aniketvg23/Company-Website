import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { PureOfflineCompanyAPI } from "../utils/pureOfflineAPI";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CompanyData {
  logo: string;
  name: string;
  tagline: string;
}

export function Footer() {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = async () => {
    try {
      const response = await PureOfflineCompanyAPI.get();
      if (response.data) {
        setCompanyData(response.data);
      }
    } catch (error) {
      console.error('Failed to load company data:', error);
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Cartify</h3>
                <p className="text-sm text-gray-400">Automotive Industries</p>
              </div>
            </div>
            <p className="text-gray-400">
              Leading manufacturer of high-quality industrial plastic bags, delivering innovative and eco-friendly packaging solutions.
            </p>

          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/" className="block text-gray-400 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/about" className="block text-gray-400 hover:text-white transition-colors">
                About Us
              </Link>
              <Link to="/services" className="block text-gray-400 hover:text-white transition-colors">
                Services
              </Link>
              <Link to="/features" className="block text-gray-400 hover:text-white transition-colors">
                Features
              </Link>
              <Link to="/contact" className="block text-gray-400 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Our Services</h4>
            <div className="space-y-2">
              <p className="text-gray-400">Custom Packaging Solutions</p>
              <p className="text-gray-400">Industrial Grade Manufacturing</p>
              <p className="text-gray-400">Eco-Friendly Options</p>
              <p className="text-gray-400">Quality Assurance</p>
              <p className="text-gray-400">Reliable Distribution</p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-400">
                    Gat no –1529, Sonwane Wasti Chikhali,<br />
                    Near Mahalaxmi Vajan Kata, Pune - 411062 
                  </p>
                  <a
                    href="https://maps.app.goo.gl/UpP9qag77ooXVWUJ6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-orange-400 hover:text-orange-300 text-sm mt-1"
                  >
                    <MapPin className="w-4 h-4 mr-1" />
                    View on Google Maps
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <p className="text-gray-400">+91 9637045783</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <p className="text-gray-400">info@cartifyauto.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 Cartify Automotive Industries. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
