import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Alert, AlertDescription } from "../components/ui/alert";
import { AdminHeader } from "../components/AdminHeader";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { ArrowLeft, Plus, Edit, Trash2, Briefcase, MapPin, Clock, DollarSign, Loader2, CheckCircle, Building } from "lucide-react";

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: string;
  createdAt: string;
  updatedAt?: string;
}

const departments = [
  "Manufacturing",
  "Quality Assurance",
  "Sales & Marketing",
  "Operations",
  "Human Resources",
  "Finance & Accounting",
  "Research & Development",
  "Maintenance",
  "Logistics",
  "Administration"
];

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Temporary"
];

const locations = [
  "Mumbai, India",
  "Delhi, India",
  "Bangalore, India",
  "Chennai, India",
  "Pune, India",
  "Hyderabad, India",
  "Ahmedabad, India",
  "Kolkata, India",
  "Remote",
  "Multiple Locations"
];

export function AdminJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    type: "",
    experience: "",
    salary: "",
    description: "",
    requirements: "",
    responsibilities: ""
  });

  useEffect(() => {
    const token = localStorage.getItem('cartify_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchJobs();
  }, [navigate]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('cartify_admin_token');
      if (!token) {
        setError('Authentication required. Please login again.');
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/admin/jobs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch jobs: ${response.status}`);
      }

      const data = await response.json();
      setJobs(Array.isArray(data) ? data : []);
      setError('');
    } catch (err: any) {
      console.error('Fetch jobs error:', err);
      setError(`Failed to load jobs: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      department: "",
      location: "",
      type: "",
      experience: "",
      salary: "",
      description: "",
      requirements: "",
      responsibilities: ""
    });
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const requirementsArray = formData.requirements.split('\n').filter(r => r.trim()).map(r => r.trim());
      const responsibilitiesArray = formData.responsibilities.split('\n').filter(r => r.trim()).map(r => r.trim());
      const token = localStorage.getItem('cartify_admin_token');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/admin/jobs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          requirements: requirementsArray,
          responsibilities: responsibilitiesArray
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create job');
      }

      await fetchJobs();
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Create job error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    
    setSubmitting(true);
    setError("");

    try {
      const requirementsArray = formData.requirements.split('\n').filter(r => r.trim()).map(r => r.trim());
      const responsibilitiesArray = formData.responsibilities.split('\n').filter(r => r.trim()).map(r => r.trim());
      const token = localStorage.getItem('cartify_admin_token');
      
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/admin/jobs/${editingJob.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          requirements: requirementsArray,
          responsibilities: responsibilitiesArray
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update job');
      }

      await fetchJobs();
      setIsEditDialogOpen(false);
      setEditingJob(null);
      resetForm();
    } catch (err: any) {
      console.error('Update job error:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      const token = localStorage.getItem('cartify_admin_token');
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/admin/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      await fetchJobs();
    } catch (err: any) {
      console.error('Delete job error:', err);
      setError('Failed to delete job');
    }
  };

  const openEditDialog = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      department: job.department || '',
      location: job.location || '',
      type: job.type || '',
      experience: job.experience || '',
      salary: job.salary || '',
      description: job.description || '',
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : ''
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
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Job Management"
        description="Manage job postings and career opportunities"
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
                Add Job
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
                <Briefcase className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{jobs.length}</p>
                  <p className="text-muted-foreground">Total Jobs</p>
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
                    {jobs.filter(j => j && j.status === 'active').length}
                  </p>
                  <p className="text-muted-foreground">Active Jobs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {[...new Set(jobs.map(j => j.department))].filter(d => d).length}
                  </p>
                  <p className="text-muted-foreground">Departments</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MapPin className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {[...new Set(jobs.map(j => j.location))].filter(l => l).length}
                  </p>
                  <p className="text-muted-foreground">Locations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Job Postings</CardTitle>
            <CardDescription>
              Manage job postings that appear on the careers page
            </CardDescription>
          </CardHeader>
          <CardContent>
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No job postings yet</h3>
                <p className="text-muted-foreground mb-6">
                  Get started by adding your first job posting to attract talent.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Job
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job Title</TableHead>
                      <TableHead className="hidden sm:table-cell">Department</TableHead>
                      <TableHead className="hidden md:table-cell">Location</TableHead>
                      <TableHead className="hidden lg:table-cell">Type</TableHead>
                      <TableHead className="hidden sm:table-cell">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {jobs.map((job) => (
                      <TableRow key={job.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{job.title || 'Untitled'}</p>
                            <p className="text-sm text-muted-foreground">
                              {job.experience && `${job.experience} experience`}
                              {job.salary && ` • ${job.salary}`}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant="outline" className="text-xs">
                            {job.department || "General"}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center text-sm">
                            <MapPin className="w-3 h-3 mr-1" />
                            {job.location || '-'}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="text-sm">{job.type || '-'}</span>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                            {job.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(job)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteJob(job.id)}
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

      {/* Create Job Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Job</DialogTitle>
            <DialogDescription>
              Create a new job posting for the careers page
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateJob}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Job Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <Input
                    id="experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 3-5 years"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g., ₹5-8 LPA"
                />
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
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                  placeholder="Enter each requirement on a new line"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="responsibilities">Responsibilities</Label>
                <Textarea
                  id="responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  rows={4}
                  placeholder="Enter each responsibility on a new line"
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
                  "Create Job"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
            <DialogDescription>
              Update job posting information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditJob}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title">Job Title *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Select value={formData.location} onValueChange={(value) => setFormData({ ...formData, location: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Job Type</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-experience">Experience</Label>
                  <Input
                    id="edit-experience"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 3-5 years"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-salary">Salary</Label>
                <Input
                  id="edit-salary"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="e.g., ₹5-8 LPA"
                />
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
                <Label htmlFor="edit-requirements">Requirements</Label>
                <Textarea
                  id="edit-requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={4}
                  placeholder="Enter each requirement on a new line"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-responsibilities">Responsibilities</Label>
                <Textarea
                  id="edit-responsibilities"
                  value={formData.responsibilities}
                  onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                  rows={4}
                  placeholder="Enter each responsibility on a new line"
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
                  "Update Job"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
