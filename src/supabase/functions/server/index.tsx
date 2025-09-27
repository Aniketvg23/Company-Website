import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Auth middleware for protected routes
async function requireAuth(c: any, next: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Authorization header required' }, 401);
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return c.json({ error: 'Invalid or expired token' }, 401);
  }
  
  // Store user in context for use in routes
  c.set('user', user);
  await next();
}

// Health check endpoint
app.get("/make-server-55ec1098/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Initialize demo admin user with secure password
app.post("/make-server-55ec1098/init-admin", async (c) => {
  try {
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'admin@cartify.com',
      password: 'CartifySecure2024!',
      user_metadata: { name: 'Admin User', role: 'admin' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error && error.message.includes('User already registered')) {
      return c.json({ 
        message: 'Admin user already exists',
        credentials: {
          email: 'admin@cartify.com',
          password: 'CartifySecure2024!'
        }
      });
    }
    
    if (error) {
      console.log('Init admin error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ 
      message: 'Admin user created successfully', 
      user: data.user,
      credentials: {
        email: 'admin@cartify.com',
        password: 'CartifySecure2024!'
      }
    });
  } catch (error) {
    console.log('Init admin error:', error);
    return c.json({ error: 'Internal server error during admin initialization' }, 500);
  }
});

// Auth endpoints
app.post("/make-server-55ec1098/auth/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }
    
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    return c.json({ user: data.user });
  } catch (error) {
    console.log('Signup error:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Contact form submissions
app.post("/make-server-55ec1098/contact", async (c) => {
  try {
    const { name, email, company, phone, subject, message } = await c.req.json();
    
    if (!name || !email || !subject || !message) {
      return c.json({ error: 'Name, email, subject, and message are required' }, 400);
    }
    
    const contactId = `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const contactData = {
      id: contactId,
      name,
      email,
      company: company || '',
      phone: phone || '',
      subject,
      message,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(contactId, contactData);
    
    return c.json({ message: 'Contact form submitted successfully', id: contactId });
  } catch (error) {
    console.log('Contact form error:', error);
    return c.json({ error: 'Failed to submit contact form' }, 500);
  }
});

// Get contact submissions (admin only)
app.get("/make-server-55ec1098/admin/contacts", requireAuth, async (c) => {
  try {
    const contacts = await kv.getByPrefix('contact_');
    const sortedContacts = contacts.sort((a: any, b: any) => 
      new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime()
    );
    return c.json(sortedContacts.map((item: any) => item.value));
  } catch (error) {
    console.log('Error fetching contacts:', error);
    return c.json({ error: 'Failed to fetch contacts' }, 500);
  }
});

// Update contact status (admin only)
app.put("/make-server-55ec1098/admin/contacts/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    const contact = await kv.get(id);
    if (!contact) {
      return c.json({ error: 'Contact not found' }, 404);
    }
    
    const updatedContact = { ...contact, status, updatedAt: new Date().toISOString() };
    await kv.set(id, updatedContact);
    
    return c.json(updatedContact);
  } catch (error) {
    console.log('Error updating contact:', error);
    return c.json({ error: 'Failed to update contact' }, 500);
  }
});

// Career applications
app.post("/make-server-55ec1098/careers/apply", async (c) => {
  try {
    const { jobId, name, email, phone, experience, resume, coverLetter } = await c.req.json();
    
    if (!jobId || !name || !email || !phone) {
      return c.json({ error: 'Job ID, name, email, and phone are required' }, 400);
    }
    
    const applicationId = `application_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const applicationData = {
      id: applicationId,
      jobId,
      name,
      email,
      phone,
      experience: experience || '',
      resume: resume || '',
      coverLetter: coverLetter || '',
      status: 'submitted',
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(applicationId, applicationData);
    
    return c.json({ message: 'Application submitted successfully', id: applicationId });
  } catch (error) {
    console.log('Career application error:', error);
    return c.json({ error: 'Failed to submit application' }, 500);
  }
});

// Job management (admin only)
app.get("/make-server-55ec1098/admin/jobs", requireAuth, async (c) => {
  try {
    const jobs = await kv.getByPrefix('job_');
    const sortedJobs = jobs.sort((a: any, b: any) => 
      new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime()
    );
    return c.json(sortedJobs.map((item: any) => item.value));
  } catch (error) {
    console.log('Error fetching jobs:', error);
    return c.json({ error: 'Failed to fetch jobs' }, 500);
  }
});

app.post("/make-server-55ec1098/admin/jobs", requireAuth, async (c) => {
  try {
    const jobData = await c.req.json();
    const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const job = {
      id: jobId,
      ...jobData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    await kv.set(jobId, job);
    return c.json(job);
  } catch (error) {
    console.log('Error creating job:', error);
    return c.json({ error: 'Failed to create job' }, 500);
  }
});

app.put("/make-server-55ec1098/admin/jobs/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updateData = await c.req.json();
    
    const existingJob = await kv.get(id);
    if (!existingJob) {
      return c.json({ error: 'Job not found' }, 404);
    }
    
    const updatedJob = { ...existingJob, ...updateData, updatedAt: new Date().toISOString() };
    await kv.set(id, updatedJob);
    
    return c.json(updatedJob);
  } catch (error) {
    console.log('Error updating job:', error);
    return c.json({ error: 'Failed to update job' }, 500);
  }
});

app.delete("/make-server-55ec1098/admin/jobs/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.log('Error deleting job:', error);
    return c.json({ error: 'Failed to delete job' }, 500);
  }
});

// Get job applications (admin only)
app.get("/make-server-55ec1098/admin/applications", requireAuth, async (c) => {
  try {
    const applications = await kv.getByPrefix('application_');
    const sortedApplications = applications.sort((a: any, b: any) => 
      new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime()
    );
    return c.json(sortedApplications.map((item: any) => item.value));
  } catch (error) {
    console.log('Error fetching applications:', error);
    return c.json({ error: 'Failed to fetch applications' }, 500);
  }
});

// Update application status (admin only)
app.put("/make-server-55ec1098/admin/applications/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    const application = await kv.get(id);
    if (!application) {
      return c.json({ error: 'Application not found' }, 404);
    }
    
    const updatedApplication = { ...application, status, updatedAt: new Date().toISOString() };
    await kv.set(id, updatedApplication);
    
    return c.json(updatedApplication);
  } catch (error) {
    console.log('Error updating application:', error);
    return c.json({ error: 'Failed to update application' }, 500);
  }
});

// Product management (admin only)
app.get("/make-server-55ec1098/admin/products", requireAuth, async (c) => {
  try {
    const products = await kv.getByPrefix('product_');
    const sortedProducts = products.sort((a: any, b: any) => 
      new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime()
    );
    return c.json(sortedProducts.map((item: any) => item.value));
  } catch (error) {
    console.log('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

app.post("/make-server-55ec1098/admin/products", requireAuth, async (c) => {
  try {
    const productData = await c.req.json();
    const { name, description, imageUrl, category, features } = productData;
    
    if (!name || !description) {
      return c.json({ error: 'Name and description are required' }, 400);
    }
    
    const productId = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const product = {
      id: productId,
      name,
      description,
      imageUrl: imageUrl || '',
      category: category || 'General',
      features: features || [],
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(productId, product);
    return c.json(product);
  } catch (error) {
    console.log('Error creating product:', error);
    return c.json({ error: 'Failed to create product' }, 500);
  }
});

app.put("/make-server-55ec1098/admin/products/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updateData = await c.req.json();
    
    const existingProduct = await kv.get(id);
    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    const updatedProduct = { ...existingProduct, ...updateData, updatedAt: new Date().toISOString() };
    await kv.set(id, updatedProduct);
    
    return c.json(updatedProduct);
  } catch (error) {
    console.log('Error updating product:', error);
    return c.json({ error: 'Failed to update product' }, 500);
  }
});

app.delete("/make-server-55ec1098/admin/products/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log('Error deleting product:', error);
    return c.json({ error: 'Failed to delete product' }, 500);
  }
});

// Machinery management endpoints
app.get("/make-server-55ec1098/admin/machinery", requireAuth, async (c) => {
  try {
    const machinery = await kv.getByPrefix('machinery_');
    const sortedMachinery = machinery.sort((a: any, b: any) => 
      new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime()
    );
    return c.json(sortedMachinery.map((item: any) => item.value));
  } catch (error) {
    console.log('Error fetching machinery:', error);
    return c.json({ error: 'Failed to fetch machinery' }, 500);
  }
});

app.post("/make-server-55ec1098/admin/machinery", requireAuth, async (c) => {
  try {
    const machineryData = await c.req.json();
    const { name, description, imageUrl, category, specifications, manufacturer, yearInstalled, capacity } = machineryData;
    
    if (!name || !description) {
      return c.json({ error: 'Name and description are required' }, 400);
    }
    
    const machineryId = `machinery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const machinery = {
      id: machineryId,
      name,
      description,
      imageUrl: imageUrl || '',
      category: category || 'General',
      specifications: specifications || [],
      manufacturer: manufacturer || '',
      yearInstalled: yearInstalled || '',
      capacity: capacity || '',
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(machineryId, machinery);
    return c.json(machinery);
  } catch (error) {
    console.log('Error creating machinery:', error);
    return c.json({ error: 'Failed to create machinery' }, 500);
  }
});

app.put("/make-server-55ec1098/admin/machinery/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updateData = await c.req.json();
    
    const existingMachinery = await kv.get(id);
    if (!existingMachinery) {
      return c.json({ error: 'Machinery not found' }, 404);
    }
    
    const updatedMachinery = { ...existingMachinery, ...updateData, updatedAt: new Date().toISOString() };
    await kv.set(id, updatedMachinery);
    
    return c.json(updatedMachinery);
  } catch (error) {
    console.log('Error updating machinery:', error);
    return c.json({ error: 'Failed to update machinery' }, 500);
  }
});

app.delete("/make-server-55ec1098/admin/machinery/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ message: 'Machinery deleted successfully' });
  } catch (error) {
    console.log('Error deleting machinery:', error);
    return c.json({ error: 'Failed to delete machinery' }, 500);
  }
});

// Public API endpoints (no auth required)
app.get("/make-server-55ec1098/products", async (c) => {
  try {
    const products = await kv.getByPrefix('product_');
    const activeProducts = products
      .map((item: any) => item.value)
      .filter((product: any) => product.status === 'active')
      .sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return c.json(activeProducts);
  } catch (error) {
    console.log('Error fetching public products:', error);
    return c.json({ error: 'Failed to fetch products' }, 500);
  }
});

app.get("/make-server-55ec1098/jobs", async (c) => {
  try {
    const jobs = await kv.getByPrefix('job_');
    const activeJobs = jobs
      .map((item: any) => item.value)
      .filter((job: any) => job.status === 'active')
      .sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return c.json(activeJobs);
  } catch (error) {
    console.log('Error fetching public jobs:', error);
    return c.json({ error: 'Failed to fetch jobs' }, 500);
  }
});

// Public machinery endpoint
app.get("/make-server-55ec1098/machinery", async (c) => {
  try {
    const machinery = await kv.getByPrefix('machinery_');
    const activeMachinery = machinery
      .map((item: any) => item.value)
      .filter((machine: any) => machine.status === 'active')
      .sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return c.json(activeMachinery);
  } catch (error) {
    console.log('Error fetching public machinery:', error);
    return c.json({ error: 'Failed to fetch machinery' }, 500);
  }
});

// Database initialization endpoint
app.post("/make-server-55ec1098/init-database", async (c) => {
  try {
    console.log('Initializing database with sample data...');
    
    // Check if data already exists to avoid duplicates
    const existingProducts = await kv.getByPrefix('product_');
    const existingMachinery = await kv.getByPrefix('machinery_');
    const existingJobs = await kv.getByPrefix('job_');
    const existingCustomers = await kv.getByPrefix('customer_');
    
    if (existingProducts.length > 0 || existingMachinery.length > 0 || existingJobs.length > 0 || existingCustomers.length > 0) {
      return c.json({ 
        message: 'Database already initialized',
        counts: {
          products: existingProducts.length,
          machinery: existingMachinery.length,
          jobs: existingJobs.length,
          customers: existingCustomers.length
        }
      });
    }
    
    // Initialize sample products
    const sampleProducts = [
      {
        name: "HDPE Carry Bags",
        description: "High-density polyethylene carry bags perfect for retail and grocery stores. Available in various sizes with excellent strength and durability.",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=300&fit=crop",
        category: "Retail Bags",
        features: ["Eco-friendly", "Tear resistant", "Multiple sizes", "Custom printing available"]
      },
      {
        name: "LDPE Packaging Films",
        description: "Low-density polyethylene films ideal for food packaging and industrial applications. Provides excellent moisture barrier properties.",
        imageUrl: "https://images.unsplash.com/photo-1586953235919-d4e7fac1bd0b?w=500&h=300&fit=crop",
        category: "Industrial Films",
        features: ["Food grade", "Moisture barrier", "Flexible", "Heat sealable"]
      },
      {
        name: "Biodegradable Shopping Bags",
        description: "Environmentally friendly shopping bags made from biodegradable materials. Perfect for eco-conscious businesses.",
        imageUrl: "https://images.unsplash.com/photo-1615719413546-198b25453f85?w=500&h=300&fit=crop",
        category: "Eco-Friendly",
        features: ["100% biodegradable", "Compostable", "Strong handles", "Custom branding"]
      },
      {
        name: "Ziplock Pouches",
        description: "Resealable ziplock pouches for food storage and packaging. Available in clear and printed options with excellent seal integrity.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
        category: "Food Packaging",
        features: ["Resealable zip", "Airtight seal", "Multiple sizes", "Food safe"]
      },
      {
        name: "Heavy Duty Garbage Bags",
        description: "Extra strong garbage bags designed for commercial and industrial waste management. Puncture and tear resistant.",
        imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=300&fit=crop",
        category: "Waste Management",
        features: ["Extra strength", "Leak proof", "Large capacity", "Tie closure"]
      },
      {
        name: "Vacuum Packaging Bags",
        description: "Specialized vacuum bags for extended food preservation and storage. Designed for commercial vacuum sealing machines.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=300&fit=crop",
        category: "Food Packaging",
        features: ["Vacuum compatible", "Extended preservation", "Puncture resistant", "Various sizes"]
      }
    ];

    for (const product of sampleProducts) {
      const productId = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const productData = {
        id: productId,
        ...product,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      await kv.set(productId, productData);
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Initialize sample machinery
    const sampleMachinery = [
      {
        name: "Blown Film Extrusion Line",
        description: "Advanced blown film extrusion system for producing high-quality polyethylene films with excellent optical and mechanical properties.",
        imageUrl: "https://images.unsplash.com/photo-1701448149957-b96dbd1926ff?w=500&h=300&fit=crop",
        category: "Extrusion Equipment",
        specifications: [
          "Multi-layer co-extrusion capability",
          "Automatic thickness control",
          "Corona treatment system",
          "High-speed winding unit"
        ],
        manufacturer: "Macro Engineering",
        yearInstalled: "2022",
        capacity: "300 kg/hour"
      },
      {
        name: "Flexographic Printing Press",
        description: "8-color flexographic printing machine for high-quality graphics and text printing on plastic films and bags.",
        imageUrl: "https://images.unsplash.com/photo-1687735041206-47c616c3cdd5?w=500&h=300&fit=crop",
        category: "Printing Equipment",
        specifications: [
          "8-color printing capability",
          "Servo-driven registration",
          "Automatic ink density control",
          "Quick job changeover"
        ],
        manufacturer: "Windmoeller & Hoelscher",
        yearInstalled: "2023",
        capacity: "150 m/min"
      },
      {
        name: "Bag Making Machine",
        description: "Fully automated bag making machine for producing various types of plastic bags including t-shirt bags, flat bags, and side gusset bags.",
        imageUrl: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&h=300&fit=crop",
        category: "Bag Making Equipment",
        specifications: [
          "Servo motor control",
          "Automatic bag counting",
          "Heat sealing system",
          "Perforation capability"
        ],
        manufacturer: "Polystar Machinery",
        yearInstalled: "2021",
        capacity: "120 bags/min"
      },
      {
        name: "Quality Control Testing Lab",
        description: "Comprehensive testing laboratory equipped with advanced instruments for quality analysis of plastic materials and finished products.",
        imageUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=500&h=300&fit=crop",
        category: "Quality Control",
        specifications: [
          "Tensile strength testing",
          "Puncture resistance testing",
          "Dart impact testing",
          "Seal strength analysis"
        ],
        manufacturer: "Various Equipment",
        yearInstalled: "2020",
        capacity: "100 tests/day"
      }
    ];

    for (const machinery of sampleMachinery) {
      const machineryId = `machinery_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const machineryData = {
        id: machineryId,
        ...machinery,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      await kv.set(machineryId, machineryData);
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Initialize sample jobs
    const sampleJobs = [
      {
        title: "Production Manager",
        department: "Manufacturing",
        location: "Mumbai, India",
        type: "Full-time",
        experience: "5-8 years",
        description: "Lead our production team and oversee manufacturing operations to ensure quality and efficiency.",
        requirements: [
          "Bachelor's degree in Engineering or related field",
          "5+ years of manufacturing experience",
          "Strong leadership and communication skills",
          "Knowledge of plastic manufacturing processes"
        ],
        responsibilities: [
          "Oversee daily production operations",
          "Manage production team and schedules",
          "Ensure quality control standards",
          "Implement process improvements"
        ],
        salary: "₹8-12 LPA"
      },
      {
        title: "Quality Control Engineer",
        department: "Quality Assurance",
        location: "Mumbai, India",
        type: "Full-time",
        experience: "2-4 years",
        description: "Ensure product quality through comprehensive testing and analysis of plastic bags and films.",
        requirements: [
          "Bachelor's degree in Chemical/Mechanical Engineering",
          "2+ years in quality control",
          "Knowledge of testing procedures",
          "Attention to detail"
        ],
        responsibilities: [
          "Conduct quality tests on products",
          "Analyze test results and prepare reports",
          "Identify quality issues and solutions",
          "Maintain testing equipment"
        ],
        salary: "₹4-6 LPA"
      },
      {
        title: "Sales Executive",
        department: "Sales & Marketing",
        location: "Delhi, India",
        type: "Full-time",
        experience: "1-3 years",
        description: "Drive sales growth by building relationships with clients and expanding our market presence.",
        requirements: [
          "Bachelor's degree in Business or related field",
          "1+ years of sales experience",
          "Excellent communication skills",
          "Knowledge of packaging industry preferred"
        ],
        responsibilities: [
          "Generate new business opportunities",
          "Maintain client relationships",
          "Achieve sales targets",
          "Prepare sales reports"
        ],
        salary: "₹3-5 LPA + Incentives"
      }
    ];

    for (const job of sampleJobs) {
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const jobData = {
        id: jobId,
        ...job,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      await kv.set(jobId, jobData);
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Initialize sample customers
    const sampleCustomers = [
      {
        name: "Industrial Solutions Ltd.",
        logoUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop",
        industry: "Manufacturing",
        location: "Mumbai, India",
        partnership: "Premium Partner",
        description: "Leading industrial manufacturing company specializing in heavy machinery and equipment."
      },
      {
        name: "Green Manufacturing Co.",
        logoUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop",
        industry: "Manufacturing",
        location: "Delhi, India",
        partnership: "Strategic Partner",
        description: "Eco-friendly manufacturing solutions with a focus on sustainable practices."
      },
      {
        name: "Logistics Prime",
        logoUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=200&h=200&fit=crop",
        industry: "Logistics & Supply Chain",
        location: "Bangalore, India",
        partnership: "Long-term Client",
        description: "Comprehensive logistics and supply chain management services across India."
      },
      {
        name: "FoodTech Industries",
        logoUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=200&fit=crop",
        industry: "Food & Beverage",
        location: "Chennai, India",
        partnership: "Key Account",
        description: "Food processing and packaging solutions for the modern food industry."
      },
      {
        name: "AutoParts Express",
        logoUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=200&h=200&fit=crop",
        industry: "Automotive",
        location: "Pune, India",
        partnership: "Regular Client",
        description: "Automotive parts manufacturing and distribution company."
      },
      {
        name: "PharmaCare Solutions",
        logoUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=200&fit=crop",
        industry: "Pharmaceutical",
        location: "Hyderabad, India",
        partnership: "Premium Partner",
        description: "Pharmaceutical packaging and storage solutions provider."
      }
    ];

    for (const customer of sampleCustomers) {
      const customerId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const customerData = {
        id: customerId,
        ...customer,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      await kv.set(customerId, customerData);
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    return c.json({ 
      message: 'Database initialized successfully',
      counts: {
        products: sampleProducts.length,
        machinery: sampleMachinery.length,
        jobs: sampleJobs.length,
        customers: sampleCustomers.length
      }
    });
  } catch (error) {
    console.log('Database initialization error:', error);
    return c.json({ error: 'Failed to initialize database' }, 500);
  }
});

// Customer management endpoints
app.get("/make-server-55ec1098/admin/customers", requireAuth, async (c) => {
  try {
    const customers = await kv.getByPrefix('customer_');
    const sortedCustomers = customers.sort((a: any, b: any) => 
      new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime()
    );
    return c.json(sortedCustomers.map((item: any) => item.value));
  } catch (error) {
    console.log('Error fetching customers:', error);
    return c.json({ error: 'Failed to fetch customers' }, 500);
  }
});

app.post("/make-server-55ec1098/admin/customers", requireAuth, async (c) => {
  try {
    const customerData = await c.req.json();
    const { name, logoUrl, industry, location, partnership, description } = customerData;
    
    if (!name || !description) {
      return c.json({ error: 'Name and description are required' }, 400);
    }
    
    const customerId = `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const customer = {
      id: customerId,
      name,
      logoUrl: logoUrl || '',
      industry: industry || 'General',
      location: location || '',
      partnership: partnership || 'Regular Client',
      description,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    
    await kv.set(customerId, customer);
    return c.json(customer);
  } catch (error) {
    console.log('Error creating customer:', error);
    return c.json({ error: 'Failed to create customer' }, 500);
  }
});

app.put("/make-server-55ec1098/admin/customers/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const updateData = await c.req.json();
    
    const existingCustomer = await kv.get(id);
    if (!existingCustomer) {
      return c.json({ error: 'Customer not found' }, 404);
    }
    
    const updatedCustomer = { ...existingCustomer, ...updateData, updatedAt: new Date().toISOString() };
    await kv.set(id, updatedCustomer);
    
    return c.json(updatedCustomer);
  } catch (error) {
    console.log('Error updating customer:', error);
    return c.json({ error: 'Failed to update customer' }, 500);
  }
});

app.delete("/make-server-55ec1098/admin/customers/:id", requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    await kv.del(id);
    return c.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.log('Error deleting customer:', error);
    return c.json({ error: 'Failed to delete customer' }, 500);
  }
});

// Public customers endpoint
app.get("/make-server-55ec1098/customers", async (c) => {
  try {
    const customers = await kv.getByPrefix('customer_');
    const activeCustomers = customers
      .map((item: any) => item.value)
      .filter((customer: any) => customer.status === 'active')
      .sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    return c.json(activeCustomers);
  } catch (error) {
    console.log('Error fetching public customers:', error);
    return c.json({ error: 'Failed to fetch customers' }, 500);
  }
});

// Company logo management endpoints
app.get("/make-server-55ec1098/admin/company", requireAuth, async (c) => {
  try {
    const companyData = await kv.get('company_settings');
    return c.json(companyData || {
      logo: '',
      name: 'Cartify Automotive Industries',
      tagline: 'Leading manufacturer of high-quality industrial plastic bags',
      colors: {
        primary: '#FF8A00',
        secondary: '#E53E3E'
      }
    });
  } catch (error) {
    console.log('Error fetching company data:', error);
    return c.json({ error: 'Failed to fetch company data' }, 500);
  }
});

app.put("/make-server-55ec1098/admin/company", requireAuth, async (c) => {
  try {
    const updateData = await c.req.json();
    
    const existingData = await kv.get('company_settings') || {};
    const updatedData = { 
      ...existingData, 
      ...updateData, 
      updatedAt: new Date().toISOString() 
    };
    
    await kv.set('company_settings', updatedData);
    return c.json(updatedData);
  } catch (error) {
    console.log('Error updating company data:', error);
    return c.json({ error: 'Failed to update company data' }, 500);
  }
});

// Public company endpoint
app.get("/make-server-55ec1098/company", async (c) => {
  try {
    const companyData = await kv.get('company_settings');
    return c.json(companyData || {
      logo: '',
      name: 'Cartify Automotive Industries',
      tagline: 'Leading manufacturer of high-quality industrial plastic bags',
      colors: {
        primary: '#FF8A00',
        secondary: '#E53E3E'
      }
    });
  } catch (error) {
    console.log('Error fetching public company data:', error);
    return c.json({ error: 'Failed to fetch company data' }, 500);
  }
});

// Get database statistics
app.get("/make-server-55ec1098/admin/stats", requireAuth, async (c) => {
  try {
    const [products, machinery, jobs, contacts, applications, customers] = await Promise.all([
      kv.getByPrefix('product_'),
      kv.getByPrefix('machinery_'),
      kv.getByPrefix('job_'),
      kv.getByPrefix('contact_'),
      kv.getByPrefix('application_'),
      kv.getByPrefix('customer_')
    ]);

    const stats = {
      products: {
        total: products.length,
        active: products.filter((p: any) => p.value.status === 'active').length
      },
      machinery: {
        total: machinery.length,
        active: machinery.filter((m: any) => m.value.status === 'active').length
      },
      jobs: {
        total: jobs.length,
        active: jobs.filter((j: any) => j.value.status === 'active').length
      },
      contacts: {
        total: contacts.length,
        new: contacts.filter((c: any) => c.value.status === 'new').length,
        responded: contacts.filter((c: any) => c.value.status === 'responded').length
      },
      applications: {
        total: applications.length,
        submitted: applications.filter((a: any) => a.value.status === 'submitted').length,
        reviewed: applications.filter((a: any) => a.value.status === 'reviewed').length,
        shortlisted: applications.filter((a: any) => a.value.status === 'shortlisted').length
      },
      customers: {
        total: customers.length,
        active: customers.filter((c: any) => c.value.status === 'active').length
      }
    };

    return c.json(stats);
  } catch (error) {
    console.log('Error fetching stats:', error);
    return c.json({ error: 'Failed to fetch statistics' }, 500);
  }
});

Deno.serve(app.fetch);
