import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRealtimeData } from "../contexts/RealtimeDataContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { company } = useRealtimeData();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname === path) return true;
    return false;
  };

  const navLinkClass = (path: string) =>
    `transition-colors ${
      isActive(path)
        ? "text-primary font-medium"
        : "text-foreground hover:text-primary"
    }`;

  const mobileNavLinkClass = (path: string) =>
    `block px-4 py-3 rounded-md transition-colors ${
      isActive(path)
        ? "text-primary bg-accent font-medium"
        : "text-foreground hover:text-primary hover:bg-gray-50"
    }`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center space-x-3 hover:opacity-80 transition-opacity">
            {company?.logo ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden">
                <ImageWithFallback
                  src={company.logo}
                  alt={company.name || 'Company Logo'}
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-primary">
                {company?.name ? company.name.split(' ')[0] : 'Cartify'}
              </h1>
              <p className="text-xs text-muted-foreground -mt-1">
                {company?.name ? company.name.split(' ').slice(1).join(' ') : 'Automotive Industries'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link to="/about" className={navLinkClass("/about")}>
              About
            </Link>
            <Link to="/services" className={navLinkClass("/services")}>
              Services
            </Link>
            <Link to="/features" className={navLinkClass("/features")}>
              Features
            </Link>
            <Link to="/careers" className={navLinkClass("/careers")}>
              Careers
            </Link>
            <Link to="/contact" className={navLinkClass("/contact")}>
              Contact
            </Link>
          </nav>

          {/* CTA Button and Admin Link */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/contact">
              <Button>
                Get Quote
              </Button>
            </Link>
            
          </div>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-3 rounded-md text-foreground hover:text-primary hover:bg-gray-100 transition-colors"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg border-t border-gray-100">
              <Link
                to="/"
                className={mobileNavLinkClass("/")}
                onClick={toggleMenu}
              >
                Home
              </Link>
              <Link
                to="/about"
                className={mobileNavLinkClass("/about")}
                onClick={toggleMenu}
              >
                About
              </Link>
              <Link
                to="/services"
                className={mobileNavLinkClass("/services")}
                onClick={toggleMenu}
              >
                Services
              </Link>
              <Link
                to="/features"
                className={mobileNavLinkClass("/features")}
                onClick={toggleMenu}
              >
                Features
              </Link>
              <Link
                to="/careers"
                className={mobileNavLinkClass("/careers")}
                onClick={toggleMenu}
              >
                Careers
              </Link>
              <Link
                to="/contact"
                className={mobileNavLinkClass("/contact")}
                onClick={toggleMenu}
              >
                Contact
              </Link>
              <div className="px-4 py-3 space-y-2">
                <Link to="/contact" className="block">
                  <Button className="w-full" onClick={toggleMenu}>Get Quote</Button>
                </Link>
                <Link 
                  to="/admin/login" 
                  className="block text-center text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                  onClick={toggleMenu}
                >
                  Admin Login
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
