import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <main className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary/20">404</div>
          <h1 className="text-3xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button size="lg">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <Button variant="outline" size="lg" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </main>
  );
}
