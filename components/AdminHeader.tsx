import { Button } from "./ui/button";
import { Home, ArrowLeft, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface AdminHeaderProps {
  title: string;
  description?: string;
  showBackToDashboard?: boolean;
  showUserInfo?: boolean;
}

export function AdminHeader({ 
  title, 
  description, 
  showBackToDashboard = true, 
  showUserInfo = true
}: AdminHeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="text-muted-foreground hover:text-primary"
            >
              <Home className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            
            {showBackToDashboard && (
              <>
                <div className="w-px h-6 bg-gray-300"></div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/admin/dashboard')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </>
            )}
            
            <div className="w-px h-6 bg-gray-300"></div>
            <div>
              <h1 className="text-lg font-semibold">{title}</h1>
              {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
              )}
            </div>
          </div>
          
          {showUserInfo && user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{user?.user_metadata?.name || 'Admin'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
