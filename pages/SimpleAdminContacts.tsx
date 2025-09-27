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
import { ArrowLeft, Mail, User, MessageSquare, CheckCircle, Clock, Loader2 } from "lucide-react";

const statusOptions = [
  { value: "new", label: "New", color: "bg-blue-100 text-blue-800" },
  { value: "in-progress", label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
  { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-800" },
  { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-800" }
];

export function SimpleAdminContacts() {
  const { 
    contacts, 
    loading, 
    error: contextError,
    updateContactStatus,
    isBackendAvailable 
  } = useRealtimeData();

  const [error, setError] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  const handleStatusUpdate = async (contactId: string, newStatus: string) => {
    setUpdatingStatus(contactId);
    setError("");

    try {
      await updateContactStatus(contactId, newStatus);
    } catch (err: any) {
      console.error('Update contact status error:', err);
      setError(err.message || 'Failed to update contact status');
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
          <p className="text-muted-foreground">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SimpleAdminHeader 
        title="Contact Management"
        description="Manage contact form submissions and inquiries"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Mail className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">{contacts.length}</p>
                  <p className="text-muted-foreground">Total Contacts</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {contacts.filter(c => c.status === 'new').length}
                  </p>
                  <p className="text-muted-foreground">New Inquiries</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-2xl font-bold">
                    {contacts.filter(c => c.status === 'in-progress').length}
                  </p>
                  <p className="text-muted-foreground">In Progress</p>
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
                    {contacts.filter(c => c.status === 'resolved').length}
                  </p>
                  <p className="text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contacts Table */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Submissions</CardTitle>
            <CardDescription>
              Manage contact form submissions from your website
            </CardDescription>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No contact submissions yet</h3>
                <p className="text-muted-foreground">
                  Contact form submissions will appear here when customers reach out to you.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact Details</TableHead>
                      <TableHead className="hidden md:table-cell">Subject</TableHead>
                      <TableHead className="hidden lg:table-cell">Message</TableHead>
                      <TableHead className="hidden sm:table-cell">Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contacts.map((contact) => (
                      <TableRow key={contact.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{contact.name || 'Anonymous'}</p>
                            <p className="text-sm text-muted-foreground">{contact.email}</p>
                            {contact.phone && (
                              <p className="text-sm text-muted-foreground">{contact.phone}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <p className="text-sm">{contact.subject || 'No subject'}</p>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <p className="text-sm text-muted-foreground max-w-xs truncate">
                            {contact.message || 'No message'}
                          </p>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <p className="text-sm text-muted-foreground">
                            {contact.createdAt ? formatDate(contact.createdAt) : '-'}
                          </p>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(contact.status || 'new')}
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={contact.status || 'new'}
                            onValueChange={(value) => handleStatusUpdate(contact.id, value)}
                            disabled={updatingStatus === contact.id || !isBackendAvailable}
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
