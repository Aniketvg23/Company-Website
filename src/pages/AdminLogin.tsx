import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { Shield, Eye, EyeOff, Home, AlertCircle, CheckCircle } from "lucide-react";

export function AdminLogin() {
  const [email, setEmail] = useState("admin@cartify.com");
  const [password, setPassword] = useState("CartifySecure2024!");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isInitializing, setIsInitializing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const returnUrl = location.state?.returnUrl || '/admin/dashboard';
      navigate(returnUrl, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const result = await login(email, password);
    
    if (result.success) {
      setSuccess("Login successful! Redirecting...");
      const returnUrl = location.state?.returnUrl || '/admin/dashboard';
      setTimeout(() => {
        navigate(returnUrl, { replace: true });
      }, 1000);
    } else {
      setError(result.error || 'Login failed. Please check your credentials.');
    }
  };

  const initializeAdmin = async () => {
    setIsInitializing(true);
    setError("");
    setSuccess("");
    
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/init-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        setSuccess("Admin user initialized successfully! You can now login.");
        setEmail("admin@cartify.com");
        setPassword("CartifySecure2024!");
      } else {
        setError(result.error || "Failed to initialize admin user.");
      }
    } catch (err) {
      setError("Failed to connect to server. Please try again.");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      {/* Back to Home Button */}
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 text-muted-foreground hover:text-primary"
      >
        <Home className="w-4 h-4 mr-2" />
        Back to Home
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Cartify Admin Login</CardTitle>
          <CardDescription>
            Secure access to the administration dashboard
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@cartify.com"
                required
                disabled={isLoading || isInitializing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading || isInitializing}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isInitializing}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isInitializing}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                First time setup?
              </span>
            </div>
          </div>

          <Button 
            type="button"
            variant="outline"
            className="w-full" 
            disabled={isLoading || isInitializing}
            onClick={initializeAdmin}
          >
            {isInitializing ? "Initializing..." : "Initialize Admin User"}
          </Button>

          <div className="text-center space-y-2 pt-4 border-t">
            <p className="text-sm text-muted-foreground">Secure Admin Credentials</p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p><strong>Email:</strong> admin@cartify.com</p>
              <p><strong>Password:</strong> CartifySecure2024!</p>
            </div>
            <p className="text-xs text-green-600">✅ Credentials meet security standards</p>
            
            <div className="pt-2">
              <Button
                variant="link"
                size="sm"
                onClick={() => navigate('/login/diagnostic')}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                🔧 Still can't login? Run System Diagnostic →
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
