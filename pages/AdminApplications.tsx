import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "../components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { ArrowLeft, Search, Users, Calendar, Eye, Mail, Phone, FileText, Download } from "lucide-react";

interface Application {
  id: string;
  jobId: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  resume: string;
  coverLetter: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
}

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
}

export function AdminApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('cartify_admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    fetchData(token);
  }, [navigate]);

  useEffect(() => {
    let filtered = applications;
    
    if (searchTerm) {
      filtered = filtered.filter(app => 
        app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getJobTitle(app.jobId).toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(app => app.status === statusFilter);
    }
    
    if (jobFilter !== "all") {
      filtered = filtered.filter(app => app.jobId === jobFilter);
    }
    
    setFilteredApplications(filtered);
  }, [applications, searchTerm, statusFilter, jobFilter]);

  const fetchData = async (token: string) => {
    try {
      // Fetch applications
      const applicationsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/admin/applications`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      // Fetch jobs
      const jobsResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/admin/jobs`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      if (applicationsResponse.ok && jobsResponse.ok) {
        const applicationsData = await applicationsResponse.json();
        const jobsData = await jobsResponse.json();
        setApplications(applicationsData);
        setJobs(jobsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    const token = localStorage.getItem('cartify_admin_token');
    if (!token) return;

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-55ec1098/admin/applications/${applicationId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status })
        }
      );

      if (response.ok) {
        const updatedApplication = await response.json();
        setApplications(prev => 
          prev.map(app => 
            app.id === applicationId ? updatedApplication : app
          )
        );
        if (selectedApplication?.id === applicationId) {
          setSelectedApplication(updatedApplication);
        }
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const getJobTitle = (jobId: string) => {
    const job = jobs.find(j => j.id === jobId);
    return job ? job.title : 'Unknown Job';
  };

  const getJobDetails = (jobId: string) => {
    return jobs.find(j => j.id === jobId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + 
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewing': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-purple-100 text-purple-800';
      case 'interview': return 'bg-orange-100 text-orange-800';
      case 'selected': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const viewApplicationDetails = (application: Application) => {
    setSelectedApplication(application);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 space-x-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Application Management</h1>
              <p className="text-sm text-muted-foreground">Review and manage job applications</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-blue-500" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{applications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-muted-foreground">New</p>
                  <p className="text-xl font-bold">
                    {applications.filter(a => a.status === 'submitted').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Review</p>
                  <p className="text-xl font-bold">
                    {applications.filter(a => a.status === 'reviewing').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Shortlisted</p>
                  <p className="text-xl font-bold">
                    {applications.filter(a => a.status === 'shortlisted').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Selected</p>
                  <p className="text-xl font-bold">
                    {applications.filter(a => a.status === 'selected').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-xl font-bold">
                    {applications.filter(a => a.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="selected">Selected</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={jobFilter} onValueChange={setJobFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by job" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  {jobs.map((job) => (
                    <SelectItem key={job.id} value={job.id}>
                      {job.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            <CardDescription>Click on any row to view full application details</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Job Applied</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow 
                    key={application.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => viewApplicationDetails(application)}
                  >
                    <TableCell>
                      <div>
                        <p className="font-medium">{application.name}</p>
                        <p className="text-sm text-muted-foreground">{application.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{getJobTitle(application.jobId)}</p>
                        {getJobDetails(application.jobId) && (
                          <p className="text-xs text-muted-foreground">
                            {getJobDetails(application.jobId)!.department} • {getJobDetails(application.jobId)!.location}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{application.experience || 'Not specified'}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm">{formatDate(application.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Select
                          value={application.status}
                          onValueChange={(value) => updateApplicationStatus(application.id, value)}
                        >
                          <SelectTrigger className="w-32 h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="submitted">Submitted</SelectItem>
                            <SelectItem value="reviewing">Reviewing</SelectItem>
                            <SelectItem value="shortlisted">Shortlisted</SelectItem>
                            <SelectItem value="interview">Interview</SelectItem>
                            <SelectItem value="selected">Selected</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            viewApplicationDetails(application);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredApplications.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No applications found matching your criteria.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Application Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Complete application information and candidate details
            </DialogDescription>
          </DialogHeader>
          
          {selectedApplication && (
            <div className="space-y-6">
              {/* Job Info */}
              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Position Applied For</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">{getJobTitle(selectedApplication.jobId)}</p>
                    {getJobDetails(selectedApplication.jobId) && (
                      <p className="text-sm text-muted-foreground">
                        {getJobDetails(selectedApplication.jobId)!.department} • {getJobDetails(selectedApplication.jobId)!.location}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Application Date</p>
                    <p className="text-sm font-medium">{formatDate(selectedApplication.createdAt)}</p>
                  </div>
                </div>
              </div>

              {/* Candidate Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="text-sm font-semibold">{selectedApplication.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email</label>
                    <p className="text-sm">{selectedApplication.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone</label>
                    <p className="text-sm">{selectedApplication.phone}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Experience</label>
                    <p className="text-sm">{selectedApplication.experience || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Status</label>
                    <Badge className={getStatusColor(selectedApplication.status)}>
                      {selectedApplication.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {/* Resume */}
              {selectedApplication.resume && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Resume/CV</label>
                  <div className="mt-2 p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span className="text-sm">Resume attached</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-3 h-3 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Cover Letter */}
              {selectedApplication.coverLetter && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cover Letter</label>
                  <div className="mt-2 p-3 bg-muted rounded-lg text-sm whitespace-pre-wrap">
                    {selectedApplication.coverLetter}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center pt-4 border-t">
                <Select
                  value={selectedApplication.status}
                  onValueChange={(value) => {
                    updateApplicationStatus(selectedApplication.id, value);
                    setSelectedApplication({ ...selectedApplication, status: value });
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                    <SelectItem value="interview">Interview</SelectItem>
                    <SelectItem value="selected">Selected</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => window.open(`mailto:${selectedApplication.email}?subject=Regarding your application for ${getJobTitle(selectedApplication.jobId)}`)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(`tel:${selectedApplication.phone}`)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
