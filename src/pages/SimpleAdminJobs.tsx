import { useState } from "react";
import { Link } from "react-router-dom";
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
import { SimpleAdminHeader } from "../components/SimpleAdminHeader";
import { BackendStatus } from "../components/BackendStatus";
import { PermissionErrorHandler } from "../components/PermissionErrorHandler";
import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { ArrowLeft, Plus, Edit, Trash2, Briefcase, MapPin, CheckCircle, Building, Loader2 } from "lucide-react";

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

export function SimpleAdminJobs() {
  const { 
    jobs, 
    loading, 
    error: contextError,
    createJob, 
    updateJob, 
    deleteJob,
    isBackendAvailable 
  } = useRealtimeData();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      
      await createJob({
        ...formData,
        requirements: requirementsArray,
        responsibilities: responsibilitiesArray,
        status: "active"
      });

      setIsCreateDialogOpen(false);
      resetForm();
    } catch (err: any) {
      console.error('Create job error:', err);
      setError(err.message || 'Failed to create job');
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
      
      await updateJob(editingJob.id, {
        ...formData,
        requirements: requirementsArray,
        responsibilities: responsibilitiesArray
      });

      setIsEditDialogOpen(false);
      setEditingJob(null);
      resetForm();
    } catch (err: any) {
      console.error('Update job error:', err);
      setError(err.message || 'Failed to update job');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;

    try {
      await deleteJob(jobId);
    } catch (err: any) {
      console.error('Delete job error:', err);
      setError(err.message || 'Failed to delete job');
    }
  };

  const openEditDialog = (job: any) => {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SimpleAdminHeader 
        title="Job Management"
        description="Manage job postings and career opportunities"
        showBackButton={true}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={!isBackendAvailable}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Job
          </Button>
        </div>

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
                <Button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  disabled={!isBackendAvailable}
                >
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
                              disabled={!isBackendAvailable}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteJob(job.id)}
                              className="text-destructive hover:text-destructive"
                              disabled={!isBackendAvailable}
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
              <Button type="submit" disabled={submitting || !isBackendAvailable}>
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
              <Button type="submit" disabled={submitting || !isBackendAvailable}>
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
