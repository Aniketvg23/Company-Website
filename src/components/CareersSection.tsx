import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription } from "./ui/alert";
import { useRealtimeData } from "../contexts/RealtimeDataContext";
import { 
  Users, 
  Trophy, 
  Heart, 
  Clock, 
  MapPin, 
  Briefcase, 
  GraduationCap,
  DollarSign,
  Zap,
  Star,
  ChevronRight,
  Send,
  CheckCircle
} from "lucide-react";

interface ApplicationForm {
  jobId: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  resume: string;
  coverLetter: string;
}

const benefits = [
  {
    icon: Heart,
    title: "Health & Wellness",
    description: "Comprehensive medical insurance for you and your family",
    color: "bg-red-50 text-secondary"
  },
  {
    icon: GraduationCap,
    title: "Learning & Development",
    description: "Continuous training programs and skill development opportunities",
    color: "bg-orange-50 text-primary"
  },
  {
    icon: DollarSign,
    title: "Competitive Compensation",
    description: "Market-leading salary packages with performance bonuses",
    color: "bg-green-50 text-green-600"
  },
  {
    icon: Clock,
    title: "Work-Life Balance",
    description: "Flexible working hours and remote work options",
    color: "bg-blue-50 text-blue-600"
  }
];

const cultureValues = [
  {
    icon: Trophy,
    title: "Excellence",
    description: "We strive for the highest standards in everything we do"
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Teamwork and open communication drive our success"
  },
  {
    icon: Zap,
    title: "Innovation",
    description: "We embrace new ideas and cutting-edge solutions"
  },
  {
    icon: Star,
    title: "Growth",
    description: "Continuous learning and professional development"
  }
];

export function CareersSection() {
  // Safely destructure useRealtimeData with error handling
  let jobs = [];
  let loading = false;
  let submitApplication = null;
  
  try {
    const realtimeData = useRealtimeData();
    jobs = realtimeData?.jobs || [];
    loading = realtimeData?.loading || false;
    submitApplication = realtimeData?.submitApplication || null;
  } catch (error) {
    console.error("Error accessing realtime data:", error);
    // Continue with empty defaults
  }

  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    jobId: "",
    name: "",
    email: "",
    phone: "",
    experience: "",
    resume: "",
    coverLetter: ""
  });
  const [applicationLoading, setApplicationLoading] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationError, setApplicationError] = useState("");

  const handleApplicationChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationForm(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = (job: any) => {
    setSelectedJob(job);
    setApplicationForm(prev => ({ ...prev, jobId: job.id }));
    setShowApplication(true);
    setApplicationSuccess(false);
    setApplicationError("");
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplicationLoading(true);
    setApplicationError("");

    try {
      if (submitApplication) {
        await submitApplication(applicationForm);
        setApplicationSuccess(true);
        setApplicationForm({
          jobId: "",
          name: "",
          email: "",
          phone: "",
          experience: "",
          resume: "",
          coverLetter: ""
        });
      } else {
        throw new Error("Application submission service not available");
      }
    } catch (error) {
      console.error('Application submission error:', error);
      setApplicationError('Failed to submit application. Please try again.');
    } finally {
      setApplicationLoading(false);
    }
  };

  // Safe function to render requirements
  const renderRequirements = (requirements: any) => {
    if (!requirements) return null;

    let requirementsList = [];
    
    try {
      if (typeof requirements === 'string') {
        requirementsList = requirements.split('\\n').filter(req => req.trim());
      } else if (Array.isArray(requirements)) {
        requirementsList = requirements;
      } else {
        requirementsList = [String(requirements)];
      }
    } catch (error) {
      console.error("Error processing requirements:", error);
      requirementsList = [String(requirements)];
    }

    return (
      <div>
        <h5 className="font-semibold mb-2">Requirements:</h5>
        <div className="text-sm text-muted-foreground">
          {requirementsList.map((req, reqIndex) => (
            <div key={reqIndex} className="flex items-start mb-1">
              <ChevronRight className="w-3 h-3 mr-2 mt-1 text-primary flex-shrink-0" />
              {req}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="careers" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Briefcase className="w-4 h-4" />
            <span>Join Our Team</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Build Your Career with <span className="text-primary">Cartify</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Join a dynamic team that's shaping the future of sustainable packaging. 
            Grow your career while making a positive impact on the environment.
          </p>
        </div>

        {/* Company Culture */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">Our Culture & Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cultureValues.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold mb-2">{value.title}</h4>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Openings */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Current Openings</h3>
            <p className="text-lg text-muted-foreground">
              Discover exciting opportunities to grow your career with us
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading job openings...</p>
            </div>
          ) : jobs.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {jobs.map((job) => (
                <Card key={job.id} className="relative overflow-hidden hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.department && <Badge variant="secondary">{job.department}</Badge>}
                      {job.type && <Badge variant="outline">{job.type}</Badge>}
                      {job.experience && <Badge variant="outline">{job.experience}</Badge>}
                      {job.salary && <Badge variant="outline">{job.salary}</Badge>}
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 text-base">
                      {job.description}
                    </CardDescription>
                    {job.requirements && renderRequirements(job.requirements)}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      onClick={() => handleApply(job)}
                    >
                      Apply Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h4 className="text-lg font-semibold mb-2">No Current Openings</h4>
              <p className="text-muted-foreground mb-6">
                We don't have any open positions at the moment, but we're always looking for talented individuals.
              </p>
              
            </div>
          )}
        </div>

        {/* Benefits */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-center mb-12">Why Work With Us?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <benefit.icon className="w-8 h-8" />
                </div>
                <h4 className="font-semibold mb-3">{benefit.title}</h4>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-6 sm:p-8 lg:p-12 text-white mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-2">50+</div>
              <div className="text-orange-100 text-sm sm:text-base">Happy Employees</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-2">10+</div>
              <div className="text-orange-100 text-sm sm:text-base">Years in Business</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-2">100%</div>
              <div className="text-orange-100 text-sm sm:text-base">Employee Satisfaction</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-bold mb-2">3</div>
              <div className="text-orange-100 text-sm sm:text-base">Manufacturing Units</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        
      </div>

      {/* Job Application Dialog */}
      <Dialog open={showApplication} onOpenChange={setShowApplication}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Fill out the application form below. All fields marked with * are required.
            </DialogDescription>
          </DialogHeader>
          
          {applicationSuccess ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Application Submitted!</h3>
              <p className="text-muted-foreground mb-6">
                Thank you for your interest in joining our team. We'll review your application and get back to you soon.
              </p>
              <Button onClick={() => setShowApplication(false)}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmitApplication} className="space-y-4">
              {applicationError && (
                <Alert variant="destructive">
                  <AlertDescription>{applicationError}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={applicationForm.name}
                    onChange={handleApplicationChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={applicationForm.email}
                    onChange={handleApplicationChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={applicationForm.phone}
                    onChange={handleApplicationChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    name="experience"
                    value={applicationForm.experience}
                    onChange={handleApplicationChange}
                    placeholder="e.g., 3 years"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="resume">Resume/CV Link</Label>
                <Input
                  id="resume"
                  name="resume"
                  value={applicationForm.resume}
                  onChange={handleApplicationChange}
                  placeholder="Link to your resume (Google Drive, Dropbox, etc.)"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Please provide a publicly accessible link to your resume
                </p>
              </div>

              <div>
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  value={applicationForm.coverLetter}
                  onChange={handleApplicationChange}
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                  rows={6}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowApplication(false)}
                  disabled={applicationLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={applicationLoading}>
                  {applicationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
