import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/SimpleAuthContext";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { LogOut, User, Settings, Package, Home } from "lucide-react";

export function SimpleAdminHeader() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Cartify Admin</h1>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Online
            </Badge>
          </div>

          <nav className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-600 hover:text-gray-900"
            >
              <Home className="w-4 h-4 mr-2" />
              View Website
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/products')}
              className="text-gray-600 hover:text-gray-900"
            >
              <Package className="w-4 h-4 mr-2" />
              Products
            </Button>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{user?.name || 'Admin'}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
