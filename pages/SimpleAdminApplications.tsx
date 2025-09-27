import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Alert, AlertDescription } from "../components/ui/alert";
import { SimpleAdminHeader } from "../components/SimpleAdminHeader";
import { BackendStatus } from "../components/BackendStatus";
import { PermissionErrorHandler } from "../components/PermissionErrorHandler";
import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { ArrowLeft, User, Briefcase, FileText, CheckCircle, Clock, X, Loader2 } from "lucide-react";

const statusOptions = [
  { value: "submitted", label: "Submitted", color: "bg-blue-100 text-blue-800" },
  { value: "reviewing", label: "Reviewing", color: "bg-yellow-100 text-yellow-800" },
  { value: "interview", label: "Interview", color: "bg-purple-100 text-purple-800" },
  { value: "hired", label: "Hired", color: "bg-green-100 text-green-800" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-800" }
];

export function SimpleAdminApplications() {
  const { 
    applications, 
    loading, 
    error: contextError,
    updateApplicationStatus,
    isBackendAvailable 
  } = useRealtimeData();

  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    setUpdatingStatus(applicationId);
    setError("");

    try {
      await updateApplicationStatus(applicationId, newStatus);
    } catch (err: any) {
      console.error('Update application status error:', err);
      setError(err.message || 'Failed to update application status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status) || statusOptions[0];
    return (
      <Badge variant="secondary" className={statusOption.color}>
        {statusOption.label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SimpleAdminHeader 
        title="Job Applications"
        description="Manage job applications and candidate reviews"
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
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-muted-foreground">Total Applications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {applications.filter(a => a.status === 'submitted').length}
                  </p>
                  <p className="text-muted-foreground">New</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {applications.filter(a => a.status === 'interview').length}
                  </p>
                  <p className="text-muted-foreground">Interview</p>
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
                    {applications.filter(a => a.status === 'hired').length}
                  </p>
                  <p className="text-muted-foreground">Hired</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <X className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {applications.filter(a => a.status === 'rejected').length}
                  </p>
                  <p className="text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Job Applications</CardTitle>
            <CardDescription>
              Manage job applications submitted through your careers page
            </CardDescription>
          </CardHeader>
          <CardContent>
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
                <p className="text-muted-foreground">
                  Job applications will appear here when candidates apply for your job postings.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate</TableHead>
                      <TableHead className="hidden md:table-cell">Position</TableHead>
                      <TableHead className="hidden lg:table-cell">Experience</TableHead>
                      <TableHead className="hidden sm:table-cell">Applied</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{application.name || 'Anonymous'}</p>
                            <p className="text-sm text-muted-foreground">{application.email}</p>
                            {application.phone && (
                              <p className="text-sm text-muted-foreground">{application.phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-2" />
                            <span className="text-sm">{application.jobTitle || 'Unknown Position'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <p className="text-sm">{application.experience || 'Not specified'}</p>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <p className="text-sm text-muted-foreground">
                            {application.createdAt ? formatDate(application.createdAt) : '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(application.status || 'submitted')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={application.status || 'submitted'}
                            onValueChange={(value) => handleStatusUpdate(application.id, value)}
                            disabled={updatingStatus === application.id || !isBackendAvailable}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
    </div>
  );
}
