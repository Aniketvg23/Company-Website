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
import { Plus, Edit, Trash2, Factory, Settings, Zap, Award, Gauge, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { PermissionErrorHandler } from "../components/PermissionErrorHandler";
import { SystemModeIndicator } from "../components/SystemModeIndicator";

interface Machinery {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  specifications: string[];
  status: string;
  manufacturer: string;
  yearInstalled: string;
  capacity: string;
  createdAt: string;
  updatedAt?: string;
}

const categories = [
  "Extrusion Equipment",
  "Printing Equipment", 
  "Bag Making Equipment",
  "Quality Control",
  "Sealing Equipment",
  "Cutting Equipment",
  "Molding Equipment",
  "Automation",
  "Material Handling",
  "Recycling Equipment"
];

const defaultMachinery: Machinery[] = [
  {
    id: "1",
    name: "Industrial Bag Making Machine",
    description: "High-speed automated bag making equipment for continuous production",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
    category: "Bag Making Equipment",
    specifications: ["Speed: 200-300 bags/min", "Max width: 800mm", "Sealing type: Heat seal"],
    status: "active",
    manufacturer: "Windmoeller & Hoelscher",
    yearInstalled: "2022",
    capacity: "300 kg/hour",
    createdAt: new Date().toISOString()
  },
  {
    id: "2", 
    name: "Flexographic Printing Press",
    description: "Multi-color printing system for high-quality bag decoration",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800",
    category: "Printing Equipment",
    specifications: ["Colors: 8-color", "Speed: 150 m/min", "Registration: ±0.25mm"],
    status: "active",
    manufacturer: "BOBST",
    yearInstalled: "2021",
    capacity: "1500 m²/hour",
    createdAt: new Date().toISOString()
  },
  {
    id: "3",
    name: "Plastic Film Extruder",
    description: "Advanced extrusion line for producing high-quality plastic films",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800",
    category: "Extrusion Equipment", 
    specifications: ["Width: 2000mm", "Thickness: 10-200 microns", "Output: 500 kg/h"],
    status: "active",
    manufacturer: "Davis-Standard",
    yearInstalled: "2020",
    capacity: "500 kg/hour",
    createdAt: new Date().toISOString()
  }
];

export function SimpleAdminMachinery() {
  const { 
    machinery, 
    loading: globalLoading, 
    error: globalError, 
    isBackendAvailable,
    createMachine, 
    updateMachine, 
    deleteMachine
  } = useRealtimeData();
  
  const [error, setError] = useState("");
  const [editingMachine, setEditingMachine] = useState<Machinery | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    category: "",
    specifications: "",
    manufacturer: "",
    yearInstalled: "",
    capacity: ""
  });

  // Clear local error when global data updates
  useEffect(() => {
    if (globalError) {
      setError(globalError);
    } else {
      setError("");
    }
  }, [globalError]);

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      category: "",
      specifications: "",
      manufacturer: "",
      yearInstalled: "",
      capacity: ""
    });
  };

  const handleCreateMachinery = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const specificationsArray = formData.specifications.split('\n').filter(s => s.trim()).map(s => s.trim());
      
      const newMachine = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        category: formData.category,
        specifications: specificationsArray,
        manufacturer: formData.manufacturer,
        yearInstalled: formData.yearInstalled,
        capacity: formData.capacity
      };

      await createMachine(newMachine);
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success('Machinery created successfully');
    } catch (err: any) {
      console.error('Create machinery error:', err);
      // Use the actual error message which will include permission guidance
      setError(err.message || 'Failed to create machinery');
      toast.error('Failed to create machinery');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditMachinery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMachine) return;
    
    setSubmitting(true);
    setError("");

    try {
      const specificationsArray = formData.specifications.split('\n').filter(s => s.trim()).map(s => s.trim());
      
      const updateData = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        category: formData.category,
        specifications: specificationsArray,
        manufacturer: formData.manufacturer,
        yearInstalled: formData.yearInstalled,
        capacity: formData.capacity
      };

      await updateMachine(editingMachine.id, updateData);
      setIsEditDialogOpen(false);
      setEditingMachine(null);
      resetForm();
      toast.success('Machinery updated successfully');
    } catch (err: any) {
      console.error('Update machinery error:', err);
      // Use the actual error message which will include permission guidance
      setError(err.message || 'Failed to update machinery');
      toast.error('Failed to update machinery');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMachinery = async (machineryId: string) => {
    if (!confirm('Are you sure you want to delete this machinery?')) return;

    try {
      await deleteMachine(machineryId);
      toast.success('Machinery deleted successfully');
    } catch (err: any) {
      console.error('Delete machinery error:', err);
      // Use the actual error message which will include permission guidance
      setError(err.message || 'Failed to delete machinery');
      toast.error('Failed to delete machinery');
    }
  };

  const openEditDialog = (machine: Machinery) => {
    setEditingMachine(machine);
    setFormData({
      name: machine.name || '',
      description: machine.description || '',
      imageUrl: machine.imageUrl || '',
      category: machine.category || '',
      specifications: Array.isArray(machine.specifications) ? machine.specifications.join('\n') : '',
      manufacturer: machine.manufacturer || '',
      yearInstalled: machine.yearInstalled || '',
      capacity: machine.capacity || ''
    });
    setIsEditDialogOpen(true);
  };

  if (globalLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading machinery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleAdminHeader 
        title="Machinery Management"
        description="Manage your manufacturing equipment and machinery"
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
                Add Machinery
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* System Status */}
        <div className="mb-6 p-3 bg-gray-50 rounded-lg border">
          <SystemModeIndicator />
          {globalLoading && (
            <div className="text-sm text-gray-600 mt-2">Syncing machinery data...</div>
          )}
          {!isBackendAvailable && (
            <div className="text-xs text-gray-500 mt-2">
              💡 Changes are saved locally. Configure Firebase to enable real-time features and permanent storage.
            </div>
          )}
        </div>

        {/* Permission Error Handler */}
        <PermissionErrorHandler 
          error={error || globalError} 
          operation="creating, updating, or deleting machinery"
          onDismiss={() => setError("")}
        />
        
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Factory className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{machinery.length}</p>
                  <p className="text-muted-foreground">Total Machines</p>
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
                    {machinery.filter(m => m && m.status === 'active').length}
                  </p>
                  <p className="text-muted-foreground">Active Machines</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {[...new Set(machinery.map(m => m.category))].length}
                  </p>
                  <p className="text-muted-foreground">Categories</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Award className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {[...new Set(machinery.map(m => m.manufacturer))].filter(m => m).length}
                  </p>
                  <p className="text-muted-foreground">Manufacturers</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Machinery Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Machinery</CardTitle>
            <div className="text-sm text-muted-foreground">
              Manage your manufacturing equipment that appears on the machinery page
            </div>
          </CardHeader>
          <CardContent>
            {machinery.length === 0 ? (
              <div className="text-center py-12">
                <Factory className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No machinery yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by adding your first piece of machinery to showcase your capabilities.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Machine
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-20">Image</TableHead>
                      <TableHead>Machine</TableHead>
                      <TableHead className="hidden sm:table-cell">Category</TableHead>
                      <TableHead className="hidden md:table-cell">Manufacturer</TableHead>
                      <TableHead className="hidden lg:table-cell">Capacity</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {machinery.map((machine) => (
                      <TableRow key={machine.id}>
                        <TableCell>
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            {machine.imageUrl ? (
                              <ImageWithFallback
                                src={machine.imageUrl}
                                alt={machine.name || 'Machine'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Factory className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{machine.name || 'Untitled'}</p>
                            <p className="text-sm text-muted-foreground line-clamp-1 max-w-xs">
                              {machine.description && machine.description.length > 50 
                                ? machine.description.substring(0, 50) + "..."
                                : machine.description || 'No description'
                              }
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {machine.category || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-sm">{machine.manufacturer || '-'}</span>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm">{machine.capacity || '-'}</span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={machine.status === 'active' ? 'default' : 'secondary'}>
                            {machine.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(machine)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteMachinery(machine.id)}
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

      {/* Create Machinery Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Machinery</DialogTitle>
            <DialogDescription>
              Add new manufacturing equipment to showcase your capabilities
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateMachinery}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Machine Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input
                    id="manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="e.g., Windmoeller & Hoelscher"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearInstalled">Year Installed</Label>
                  <Input
                    id="yearInstalled"
                    value={formData.yearInstalled}
                    onChange={(e) => setFormData({ ...formData, yearInstalled: e.target.value })}
                    placeholder="e.g., 2022"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="e.g., 300 kg/hour"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specifications">Specifications</Label>
                <Textarea
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  rows={4}
                  placeholder="Enter each specification on a new line"
                />
                <p className="text-sm text-muted-foreground">
                  Enter each specification on a new line
                </p>
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
                  "Create Machinery"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Machinery Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Machinery</DialogTitle>
            <DialogDescription>
              Update machinery information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditMachinery}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Machine Name *</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-manufacturer">Manufacturer</Label>
                  <Input
                    id="edit-manufacturer"
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="e.g., Windmoeller & Hoelscher"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-yearInstalled">Year Installed</Label>
                  <Input
                    id="edit-yearInstalled"
                    value={formData.yearInstalled}
                    onChange={(e) => setFormData({ ...formData, yearInstalled: e.target.value })}
                    placeholder="e.g., 2022"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-capacity">Capacity</Label>
                  <Input
                    id="edit-capacity"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    placeholder="e.g., 300 kg/hour"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-imageUrl">Image URL</Label>
                  <Input
                    id="edit-imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-specifications">Specifications</Label>
                <Textarea
                  id="edit-specifications"
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  rows={4}
                  placeholder="Enter each specification on a new line"
                />
                <p className="text-sm text-muted-foreground">
                  Enter each specification on a new line
                </p>
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
                  "Update Machinery"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
