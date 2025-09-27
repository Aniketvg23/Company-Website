import { useState } from "react";
import { Link } from "react-router-dom";
import { SimpleAdminHeader } from "../components/SimpleAdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Alert, AlertDescription } from "../components/ui/alert";
import { BackendStatus } from "../components/BackendStatus";
import { PermissionErrorHandler } from "../components/PermissionErrorHandler";
import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { companyAPI } from "../utils/firebase/api";
import { toast } from "sonner@2.0.3";
import { Building2, ArrowLeft, Loader2, Save, Upload } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function SimpleAdminCompany() {
  const { 
    company, 
    loading, 
    error: contextError,
    isBackendAvailable 
  } = useRealtimeData();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const [companyData, setCompanyData] = useState({
    logo: company?.logo || "",
    name: company?.name || "Cartify Automotive Industries",
    tagline: company?.tagline || "Leading manufacturer of high-quality industrial plastic bags",
    colors: {
      primary: company?.colors?.primary || "#FF8A00",
      secondary: company?.colors?.secondary || "#E53E3E"
    }
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await companyAPI.createOrUpdate(companyData);
      
      setSuccess("Company data saved successfully!");
      toast.success("Company data saved successfully!");
    } catch (err: any) {
      console.error('Save company data error:', err);
      setError(err.message || 'Failed to save company data');
      toast.error(err.message || 'Failed to save company data');
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = () => {
    // For now, show a simple input dialog for URL
    const logoUrl = prompt("Enter logo URL:", companyData.logo);
    if (logoUrl !== null) {
      setCompanyData(prev => ({ ...prev, logo: logoUrl }));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading company data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SimpleAdminHeader 
        title="Company Settings"
        description="Manage your company logo, branding, and information"
        showBackButton={true}
      />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Backend Status */}
        <BackendStatus className="mb-6" />
        
        {/* Permission Error Handler */}
        <PermissionErrorHandler error={contextError} />

        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Link to="/admin/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">{success}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* Company Logo */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Company Logo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {companyData.logo ? (
                    <ImageWithFallback
                      src={companyData.logo}
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Building2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No logo</p>
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <Label htmlFor="logo">Logo URL</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="logo"
                        value={companyData.logo}
                        onChange={(e) => setCompanyData(prev => ({ ...prev, logo: e.target.value }))}
                        placeholder="https://example.com/logo.png"
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={handleLogoUpload}>
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter a URL for your company logo. For best results, use a square image (200x200px or larger).
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Company Information */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  value={companyData.name}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Your Company Name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Textarea
                  id="tagline"
                  value={companyData.tagline}
                  onChange={(e) => setCompanyData(prev => ({ ...prev, tagline: e.target.value }))}
                  placeholder="Brief description of your company"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Brand Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primary-color"
                      type="color"
                      value={companyData.colors.primary}
                      onChange={(e) => setCompanyData(prev => ({
                        ...prev,
                        colors: { ...prev.colors, primary: e.target.value }
                      }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={companyData.colors.primary}
                      onChange={(e) => setCompanyData(prev => ({
                        ...prev,
                        colors: { ...prev.colors, primary: e.target.value }
                      }))}
                      placeholder="#FF8A00"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="secondary-color">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="secondary-color"
                      type="color"
                      value={companyData.colors.secondary}
                      onChange={(e) => setCompanyData(prev => ({
                        ...prev,
                        colors: { ...prev.colors, secondary: e.target.value }
                      }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={companyData.colors.secondary}
                      onChange={(e) => setCompanyData(prev => ({
                        ...prev,
                        colors: { ...prev.colors, secondary: e.target.value }
                      }))}
                      placeholder="#E53E3E"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-4 p-4 bg-gray-50 rounded-lg">
                <div 
                  className="w-12 h-12 rounded-lg shadow-sm border"
                  style={{ backgroundColor: companyData.colors.primary }}
                ></div>
                <div 
                  className="w-12 h-12 rounded-lg shadow-sm border"
                  style={{ backgroundColor: companyData.colors.secondary }}
                ></div>
                <p className="text-sm text-muted-foreground">Color preview</p>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={saving || !isBackendAvailable} 
              size="lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
