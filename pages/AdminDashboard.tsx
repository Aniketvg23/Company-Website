import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { AdminHeader } from "../components/AdminHeader";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { 
  Users, 
  Briefcase, 
  Mail, 
  TrendingUp, 
  Calendar,
  Activity,
  LogOut,
  Settings,
  BarChart3,
  Package,
  Home,
  ArrowLeft,
  Factory
} from "lucide-react";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    contacts: 0,
    applications: 0,
    jobs: 0,
    products: 0,
    machinery: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('cartify_admin_token');
      if (token) {
        fetchDashboardData(token);
      }
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async (token: string) => {
    try {
      const baseUrl = `https://${projectId}.supabase.co/functions/v1/make-server-55ec1098`;
      
      // Fetch contacts
      const contactsResponse = await fetch(`${baseUrl}/admin/contacts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch applications
      const applicationsResponse = await fetch(`${baseUrl}/admin/applications`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch jobs
      const jobsResponse = await fetch(`${baseUrl}/admin/jobs`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fetch products
      const productsResponse = await fetch(`${baseUrl}/admin/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      // Get machinery from local storage
      const machineryData = localStorage.getItem('cartify_machinery');
      const machinery = machineryData ? JSON.parse(machineryData) : [];

      if (contactsResponse.ok && applicationsResponse.ok && jobsResponse.ok && productsResponse.ok) {
        const contacts = await contactsResponse.json();
        const applications = await applicationsResponse.json();
        const jobs = await jobsResponse.json();
        const products = await productsResponse.json();

        // Create recent activity
        const recentContacts = contacts.slice(0, 3).map((contact: any) => ({
          type: 'contact',
          message: `New contact from ${contact.name}`,
          time: contact.createdAt,
          status: contact.status
        }));

        const recentApplications = applications.slice(0, 3).map((app: any) => ({
          type: 'application',
          message: `Job application from ${app.name}`,
          time: app.createdAt,
          status: app.status
        }));

        const recentActivity = [...recentContacts, ...recentApplications]
          .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
          .slice(0, 5);

        setStats({
          contacts: contacts.length,
          applications: applications.length,
          jobs: jobs.length,
          products: products.length,
          machinery: machinery.length,
          recentActivity
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };



  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        title="Admin Dashboard"
        description="Cartify Automotive Industries"
        showBackToDashboard={false}
        showUserInfo={true}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => navigate('/admin/contacts')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.contacts}</div>
              <p className="text-xs text-muted-foreground">Contact form submissions</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/admin/applications')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.applications}</div>
              <p className="text-xs text-muted-foreground">Job applications received</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/admin/jobs')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.jobs}</div>
              <p className="text-xs text-muted-foreground">Open positions</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/admin/products')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate('/admin/machinery')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Machinery</CardTitle>
              <Factory className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.machinery}</div>
              <p className="text-xs text-muted-foreground">Manufacturing equipment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12%</div>
              <p className="text-xs text-muted-foreground">Growth in inquiries</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Latest contacts and applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentActivity.length > 0 ? (
                  stats.recentActivity.map((activity: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {activity.type === 'contact' ? (
                          <Mail className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Users className="w-4 h-4 text-green-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{activity.message}</p>
                          <p className="text-xs text-muted-foreground">{formatTimeAgo(activity.time)}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={activity.status === 'new' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {activity.status}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/jobs')}
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Manage Jobs
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/products')}
              >
                <Package className="w-4 h-4 mr-2" />
                Manage Products
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/machinery')}
              >
                <Factory className="w-4 h-4 mr-2" />
                Manage Machinery
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/init-products')}
              >
                <Package className="w-4 h-4 mr-2" />
                Initialize Products
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/contacts')}
              >
                <Mail className="w-4 h-4 mr-2" />
                View Contacts
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/admin/applications')}
              >
                <Users className="w-4 h-4 mr-2" />
                Review Applications
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/')}>
                <BarChart3 className="w-4 h-4 mr-2" />
                View Public Site
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
