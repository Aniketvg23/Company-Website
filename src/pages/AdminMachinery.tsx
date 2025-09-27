import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AdminHeader } from "../components/AdminHeader";
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
import { projectId, publicAnonKey } from "../utils/supabase/info";

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

export function AdminMachinery() {
  const [machinery, setMachinery] = useState<Machinery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingMachine, setEditingMachine] = useState<Machinery | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    const token = localStorage.getItem('cartify_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchMachinery();
  }, [navigate]);

  const fetchMachinery = async () => {
    try {
      const token = localStorage.getItem('cartify_admin_token');
      if (!token) {
        setError('Authentication required. Please login again.');
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/admin/machinery`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch machinery: ${response.status}`);
      }

      const data = await response.json();
      setMachinery(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      console.error('Fetch machinery error:', err);
      setError(`Failed to load machinery: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

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
      const token = localStorage.getItem('cartify_admin_token');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/admin/machinery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          specifications: specificationsArray
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create machinery');
      }

      await fetchMachinery();
      setIsCreateDialogOpen(false);
      resetForm();
      toast.success('Machinery created successfully');
    } catch (err: any) {
      console.error('Create machinery error:', err);
      setError(err.message);
      toast.error(err.message);
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
      const token = localStorage.getItem('cartify_admin_token');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/admin/machinery/${editingMachine.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          specifications: specificationsArray
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update machinery');
      }

      await fetchMachinery();
      setIsEditDialogOpen(false);
      setEditingMachine(null);
      resetForm();
      toast.success('Machinery updated successfully');
    } catch (err: any) {
      console.error('Update machinery error:', err);
      setError(err.message);
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMachinery = async (machineryId: string) => {
    if (!confirm('Are you sure you want to delete this machinery?')) return;

    try {
      const token = localStorage.getItem('cartify_admin_token');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/admin/machinery/${machineryId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete machinery');
      }

      await fetchMachinery();
      toast.success('Machinery deleted successfully');
    } catch (err: any) {
      console.error('Delete machinery error:', err);
      setError('Failed to delete machinery');
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
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
      <AdminHeader 
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
            <CardDescription>
              Manage your manufacturing equipment that appears on the features page
            </CardDescription>
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
