import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { SimpleAdminHeader } from "../components/SimpleAdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Alert, AlertDescription } from "../components/ui/alert";
import { toast } from "sonner@2.0.3";
import { Plus, Edit, Trash2, Building2, Users, Star, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { SystemModeIndicator } from "../components/SystemModeIndicator";
import { PermissionErrorHandler } from "../components/PermissionErrorHandler";

interface Customer {
  id: string;
  name: string;
  logoUrl: string;
  industry: string;
  location: string;
  partnership: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

const industries = [
  "Manufacturing",
  "Logistics & Supply Chain",
  "Food & Beverage", 
  "Pharmaceutical",
  "Automotive",
  "Retail & E-commerce",
  "Construction",
  "Agriculture",
  "Chemical",
  "Textile",
  "Electronics",
  "Healthcare"
];

const partnerships = [
  "Premium Partner",
  "Long-term Client",
  "Strategic Partner",
  "Key Account",
  "Regular Client",
  "New Client"
];



export function SimpleAdminCustomers() {
  const { 
    customers, 
    loading: globalLoading, 
    error: globalError, 
    isBackendAvailable,
    createCustomer, 
    updateCustomer, 
    deleteCustomer,
    refreshData
  } = useRealtimeData();
  
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    logoUrl: "",
    industry: "",
    location: "",
    partnership: "",
    description: ""
  });

  // Clear local error when global data updates
  useEffect(() => {
    if (globalError) {
      setLocalError(globalError);
    } else {
      setLocalError("");
    }
  }, [globalError]);

  // Remove this function since we'll use API calls directly

  const resetForm = () => {
    setFormData({
      name: "",
      logoUrl: "",
      industry: "",
      location: "",
      partnership: "",
      description: ""
    });
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setLocalError("");

    try {
      await createCustomer({
        name: formData.name,
        logoUrl: formData.logoUrl,
        industry: formData.industry,
        location: formData.location,
        partnership: formData.partnership,
        description: formData.description,
        status: "active"
      });

      setIsCreateDialogOpen(false);
      resetForm();
      
      toast.success("Customer created successfully!");
    } catch (err: any) {
      console.error('Create customer error:', err);
      setLocalError(err.message);
      toast.error('Failed to create customer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer) return;
    
    setSubmitting(true);
    setLocalError("");

    try {
      await updateCustomer(editingCustomer.id, {
        name: formData.name,
        logoUrl: formData.logoUrl,
        industry: formData.industry,
        location: formData.location,
        partnership: formData.partnership,
        description: formData.description
      });

      setIsEditDialogOpen(false);
      setEditingCustomer(null);
      resetForm();
      
      toast.success("Customer updated successfully!");
    } catch (err: any) {
      console.error('Update customer error:', err);
      setLocalError(err.message);
      toast.error('Failed to update customer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await deleteCustomer(customerId);
      toast.success("Customer deleted successfully!");
    } catch (err: any) {
      console.error('Delete customer error:', err);
      toast.error('Failed to delete customer');
    }
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      logoUrl: customer.logoUrl || '',
      industry: customer.industry || '',
      location: customer.location || '',
      partnership: customer.partnership || '',
      description: customer.description || ''
    });
    setIsEditDialogOpen(true);
  };

  if (globalLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading customers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleAdminHeader 
        title="Customer Management"
        description="Manage your customer portfolio and partnerships"
      />
      
      {/* Action Buttons */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <Link to="/admin/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Customer
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Mode Status */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg border">
          <SystemModeIndicator />
          {globalLoading && (
            <div className="text-sm text-gray-600 mt-2">Syncing data...</div>
          )}
          {!isBackendAvailable && (
            <div className="text-xs text-gray-500 mt-2">
              💡 Changes are saved locally. Start the Supabase server to enable real-time features and permanent storage.
            </div>
          )}
        </div>

        {/* Permission Error Handler */}
        <PermissionErrorHandler 
          error={localError || globalError} 
          operation="creating, updating, or deleting customers"
          onDismiss={() => setLocalError("")}
        />

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{customers.length}</p>
                  <p className="text-muted-foreground">Total Customers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {customers.filter(c => c && c.status === 'active').length}
                  </p>
                  <p className="text-muted-foreground">Active Partners</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {[...new Set(customers.map(c => c.industry))].length}
                  </p>
                  <p className="text-muted-foreground">Industries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {customers.filter(c => c.partnership === 'Premium Partner').length}
                  </p>
                  <p className="text-muted-foreground">Premium Partners</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customers Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Customers</CardTitle>
            <div className="text-sm text-muted-foreground">
              Manage your customer portfolio that appears on the homepage
            </div>
          </CardHeader>
          <CardContent>
            {customers.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No customers yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by adding your first customer to showcase your partnerships.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Customer
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Logo</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead className="hidden sm:table-cell">Industry</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead className="hidden lg:table-cell">Partnership</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {customer.logoUrl ? (
                              <ImageWithFallback
                                src={customer.logoUrl}
                                alt={customer.name || 'Company Logo'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.name || 'Untitled'}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                              {customer.description && customer.description.length > 50 
                                ? customer.description.substring(0, 50) + "..."
                                : customer.description || 'No description'
                              }
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {customer.industry || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm">{customer.location || '-'}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <Badge variant={customer.partnership === 'Premium Partner' ? 'default' : 'secondary'} className="text-xs">
                            {customer.partnership || 'Regular Client'}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={customer.status === 'active' ? 'default' : 'secondary'}>
                            {customer.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(customer)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCustomer(customer.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Customer Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Customer</DialogTitle>
            <DialogDescription>
              Add a new customer to showcase your business partnerships
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateCustomer}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Company Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Mumbai, India"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="partnership">Partnership Type</Label>
                <Select value={formData.partnership} onValueChange={(value) => setFormData({ ...formData, partnership: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select partnership type" />
                  </SelectTrigger>
                  <SelectContent>
                    {partnerships.map((partnership) => (
                      <SelectItem key={partnership} value={partnership}>
                        {partnership}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                  placeholder="Brief description of the company and your partnership"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Customer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
            <DialogDescription>
              Update customer information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditCustomer}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Company Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-logoUrl">Logo URL</Label>
                  <Input
                    id="edit-logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-industry">Industry</Label>
                  <Select value={formData.industry} onValueChange={(value) => setFormData({ ...formData, industry: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Input
                    id="edit-location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Mumbai, India"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-partnership">Partnership Type</Label>
                <Select value={formData.partnership} onValueChange={(value) => setFormData({ ...formData, partnership: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select partnership type" />
                  </SelectTrigger>
                  <SelectContent>
                    {partnerships.map((partnership) => (
                      <SelectItem key={partnership} value={partnership}>
                        {partnership}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                  placeholder="Brief description of the company and your partnership"
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Customer"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
