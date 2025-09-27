import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SimpleAdminHeader } from "../components/SimpleAdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { DataMigrationPanel } from "../components/DataMigrationPanel";
import { SystemModeIndicator } from "../components/SystemModeIndicator";
import { FirebaseStatusBanner } from "../components/FirebaseStatusBanner";
import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { Package, Settings, Users, FileText, BarChart3, Plus, Factory, Building2, Database, Briefcase, Mail, UserCheck } from "lucide-react";

export function SimpleAdminDashboard() {
  const navigate = useNavigate();
  const { products, machinery, jobs, customers, contacts, applications } = useRealtimeData();
  const [showMigrationPanel, setShowMigrationPanel] = useState(true);

  const adminActions = [
    {
      title: "Manage Products",
      description: "Add, edit, and organize your product catalog",
      icon: Package,
      action: () => navigate('/admin/products'),
      color: "bg-blue-500"
    },
    {
      title: "Manage Machinery",
      description: "Manage your manufacturing equipment",
      icon: Factory,
      action: () => navigate('/admin/machinery'),
      color: "bg-primary"
    },
    {
      title: "Manage Customers",
      description: "Manage customer portfolio and partnerships",
      icon: Building2,
      action: () => navigate('/admin/customers'),
      color: "bg-secondary"
    },
    {
      title: "Job Management",
      description: "Manage job postings and career opportunities",
      icon: Briefcase,
      action: () => navigate('/admin/jobs'),
      color: "bg-purple-500"
    },
    {
      title: "Contact Messages",
      description: "Review customer inquiries and contact forms",
      icon: Mail,
      action: () => navigate('/admin/contacts'),
      color: "bg-orange-500"
    },
    {
      title: "Job Applications",
      description: "Manage candidate applications and hiring",
      icon: UserCheck,
      action: () => navigate('/admin/applications'),
      color: "bg-blue-600"
    },
    {
      title: "Company Settings",
      description: "Manage company logo and branding",
      icon: Settings,
      action: () => navigate('/admin/company'),
      color: "bg-green-500"
    },
    {
      title: "View Analytics",
      description: "Monitor your business performance",
      icon: BarChart3,
      action: () => alert('Analytics coming soon!'),
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SimpleAdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FirebaseStatusBanner />
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome to your Cartify administration panel</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowMigrationPanel(!showMigrationPanel)}
            >
              <Database className="w-4 h-4 mr-2" />
              {showMigrationPanel ? 'Hide' : 'Show'} Data Management
            </Button>
          </div>
          
          {/* System Status */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
            <SystemModeIndicator />
          </div>
        </div>

        {/* Data Migration Panel */}
        {showMigrationPanel && (
          <div className="mb-8">
            <DataMigrationPanel />
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Products</p>
                  <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Customers</p>
                  <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Mail className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Contact Messages</p>
                  <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Job Openings</p>
                  <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminActions.map((action, index) => (
            <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={action.action}
                  className="w-full"
                  variant="outline"
                >
                  Open
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => navigate('/admin/products')}
                  className="flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add New Product
                </Button>
                <Button 
                  onClick={() => navigate('/admin/machinery')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Factory className="w-4 h-4" />
                  Add Machinery
                </Button>
                <Button 
                  onClick={() => navigate('/admin/customers')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Building2 className="w-4 h-4" />
                  Add Customer
                </Button>
                <Button 
                  onClick={() => navigate('/admin/jobs')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Briefcase className="w-4 h-4" />
                  Post Job
                </Button>
                <Button 
                  onClick={() => navigate('/admin/contacts')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <Mail className="w-4 h-4" />
                  View Messages
                </Button>
                <Button 
                  onClick={() => navigate('/admin/applications')}
                  className="flex items-center gap-2"
                  variant="outline"
                >
                  <UserCheck className="w-4 h-4" />
                  Review Applications
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
