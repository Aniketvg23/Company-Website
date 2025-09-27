import { projectId, publicAnonKey } from './supabase/info';

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  category: string;
  features: string[];
  status: string;
  createdAt: string;
}

const comprehensiveProducts = [
  {
    name: "Heavy-Duty Industrial Bags",
    description: "Engineered for the most demanding industrial applications, these heavy-duty plastic bags provide unmatched strength and durability. Perfect for construction, manufacturing, and waste management industries.",
    imageUrl: "https://images.unsplash.com/photo-1637251393438-30eca8828253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGxhc3RpYyUyMGJhZ3MlMjBoZWF2eSUyMGR1dHl8ZW58MXx8fHwxNzU3MzE3Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Industrial Packaging",
    features: [
      "Superior tensile strength up to 50kg capacity",
      "Chemical and oil resistant materials",
      "Puncture and tear resistant design",
      "Custom thickness options available",
      "UV stabilized for outdoor use",
      "Available in various sizes and colors"
    ]
  },
  {
    name: "Eco-Friendly Biodegradable Bags",
    description: "Leading the way in sustainable packaging solutions, our biodegradable bags provide the same functionality as traditional plastic while being completely environmentally friendly.",
    imageUrl: "https://images.unsplash.com/photo-1755606045126-1aeb4f0e7c2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9kZWdyYWRhYmxlJTIwZWNvJTIwZnJpZW5kbHklMjBwYWNrYWdpbmd8ZW58MXx8fHwxNzU3MzE3Mzk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Eco-Friendly",
    features: [
      "100% biodegradable within 180 days",
      "Compostable certification (ASTM D6400)",
      "Made from renewable plant-based materials",
      "Reduced carbon footprint manufacturing",
      "Marine-safe decomposition",
      "Available in natural and custom colors"
    ]
  },
  {
    name: "Food-Grade Storage Bags",
    description: "FDA-approved food-grade plastic bags designed specifically for food storage, packaging, and preservation. Ensuring safety and freshness for all food-related applications.",
    imageUrl: "https://images.unsplash.com/photo-1752051665228-28ade71b97b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZ3JhZGUlMjBzdG9yYWdlJTIwYmFnc3xlbnwxfHx8fDE3NTczMTc0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Food Packaging",
    features: [
      "FDA approved food-safe materials",
      "BPA-free and non-toxic composition",
      "Excellent barrier protection against moisture",
      "Transparent for easy product identification",
      "Freezer and microwave safe options",
      "Multiple closure mechanisms available"
    ]
  },
  {
    name: "Automotive Parts Packaging",
    description: "Specialized packaging solutions designed for the automotive industry. Protect sensitive automotive components during storage, shipping, and handling with our precision-engineered bags.",
    imageUrl: "https://images.unsplash.com/photo-1683818051102-dd1199d163b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwcGFydHMlMjBwYWNrYWdpbmd8ZW58MXx8fHwxNzU3MzE3NDA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Automotive Packaging",
    features: [
      "Anti-static properties for electronic components",
      "Corrosion-resistant material coating",
      "Custom sizes for specific automotive parts",
      "Heat-sealable for secure closure",
      "Laser-printable surface for part identification",
      "High clarity for visual inspection"
    ]
  },
  {
    name: "Custom Printed Branding Bags",
    description: "Enhance your brand visibility with our custom printed plastic bags. High-quality printing capabilities allow for vibrant logos, branding, and marketing messages on durable packaging.",
    imageUrl: "https://images.unsplash.com/photo-1587599305803-01f1f176fbb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBwcmludGVkJTIwYmFncyUyMGJyYW5kaW5nfGVufDF8fHx8MTc1NzMxNzQxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Custom Printing",
    features: [
      "Full-color digital printing capability",
      "High-resolution logo and graphics printing",
      "Pantone color matching available",
      "Scratch and fade-resistant inks",
      "Multiple printing positions available",
      "Small minimum order quantities"
    ]
  },
  {
    name: "Vacuum Seal Barrier Bags",
    description: "Advanced barrier technology bags designed for vacuum sealing applications. Ideal for food preservation, pharmaceutical packaging, and sensitive equipment protection.",
    imageUrl: "https://images.unsplash.com/photo-1694610882150-4de206edf95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWN1dW0lMjBzZWFsJTIwYmFycmllciUyMHBhY2thZ2luZ3xlbnwxfHx8fDE3NTczMTc0MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Barrier Packaging",
    features: [
      "Multi-layer barrier construction",
      "Oxygen and moisture transmission protection",
      "Heat-sealable on both sides",
      "Extended shelf life for packaged products",
      "Crystal clear transparency",
      "Compatible with all vacuum sealing machines"
    ]
  },
  {
    name: "Medical Grade Sterile Bags",
    description: "High-quality sterile packaging solutions for medical devices, surgical instruments, and pharmaceutical products. Manufactured in certified clean room environments with strict quality controls.",
    imageUrl: "https://images.unsplash.com/photo-1601637742135-c9b747da987c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZ3JhZGUlMjBwYWNrYWdpbmclMjBiYWdzfGVufDF8fHx8MTc1NzQwNzMwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Medical Packaging",
    features: [
      "ISO 13485 certified manufacturing",
      "Gamma and E-beam sterilization compatible",
      "Medical grade polymer materials",
      "Biocompatibility testing certified",
      "Sterile barrier properties",
      "Tamper-evident closure options"
    ]
  },
  {
    name: "Agricultural Storage Bags",
    description: "Durable agricultural bags designed for grain storage, seed packaging, and fertilizer containment. Weather-resistant construction ensures product protection in outdoor environments.",
    imageUrl: "https://images.unsplash.com/photo-1656048198183-15696196d852?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ3JpY3VsdHVyYWwlMjBzdG9yYWdlJTIwYmFnc3xlbnwxfHx8fDE3NTc0MDczMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Agricultural Packaging",
    features: [
      "Weather and UV resistant materials",
      "Breathable options for grain storage",
      "Moisture barrier for seed protection",
      "Heavy-duty woven construction",
      "Large capacity options up to 100kg",
      "Pest and rodent resistant"
    ]
  },
  {
    name: "Anti-Static Electronic Bags",
    description: "Specialized anti-static bags for protecting sensitive electronic components from electrostatic discharge damage. Essential for semiconductor, PCB, and electronic device packaging.",
    imageUrl: "https://images.unsplash.com/photo-1624607702690-bd8dc7e4dbc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpJTIwc3RhdGljJTIwcGFja2FnaW5nfGVufDF8fHx8MTc1NzQwNzMxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Electronic Packaging",
    features: [
      "Static dissipative properties (10^6 - 10^11 ohms)",
      "Metallized construction for ESD protection",
      "High puncture resistance",
      "Transparent for easy component identification",
      "Heat-sealable for secure closure",
      "Compliant with MIL-PRF-81705 standards"
    ]
  },
  {
    name: "Construction Waste Bags",
    description: "Heavy-duty waste containment bags specifically designed for construction and demolition debris. Exceptional strength for handling sharp objects and heavy materials.",
    imageUrl: "https://images.unsplash.com/photo-1689703063140-e3a824c0f560?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjB3YXN0ZSUyMGJhZ3N8ZW58MXx8fHwxNzU3NDA3MzE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Construction Packaging",
    features: [
      "Extra-thick 6-mil construction",
      "Reinforced bottom seam for heavy loads",
      "Puncture-resistant material composition",
      "Large capacity for bulky debris",
      "Tie closure for secure containment",
      "UV resistant for outdoor storage"
    ]
  },
  {
    name: "Retail Shopping Bags",
    description: "Premium retail bags that combine functionality with brand appeal. Perfect for boutiques, grocery stores, and shopping centers looking to enhance customer experience.",
    imageUrl: "https://images.unsplash.com/photo-1600007772964-e06f2fc61b64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZXRhaWwlMjBzaG9wcGluZyUyMGJhZ3N8ZW58MXx8fHwxNzU3MzUwMjM1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Retail Packaging",
    features: [
      "Reinforced handles for comfortable carrying",
      "High-quality print surface for branding",
      "Various sizes for different products",
      "Tear-resistant construction",
      "Gusseted bottom for stability",
      "Eco-friendly options available"
    ]
  },
  {
    name: "Transparent Ziplock Bags",
    description: "Versatile transparent bags with reliable ziplock closures. Ideal for sample storage, parts organization, and small item packaging across multiple industries.",
    imageUrl: "https://images.unsplash.com/photo-1603098340318-555a8672916e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc3BhcmVudCUyMHppcGxvY2slMjBiYWdzfGVufDF8fHx8MTc1NzQwNzMyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "General Packaging",
    features: [
      "Crystal clear transparency for visibility",
      "Reliable zip closure mechanism",
      "Reusable and resealable design",
      "Food-safe material options",
      "Multiple size configurations",
      "Write-on label area included"
    ]
  },
  {
    name: "Pharmaceutical Packaging Bags",
    description: "Specialized packaging for pharmaceutical and nutraceutical products. Designed to maintain product integrity and comply with strict regulatory requirements.",
    imageUrl: "https://images.unsplash.com/photo-1601637742135-c9b747da987c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaGFybWFjZXV0aWNhbCUyMHN0ZXJpbGUlMjBwYWNrYWdpbmd8ZW58MXx8fHwxNzU3NDA3MzI0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Pharmaceutical Packaging",
    features: [
      "Child-resistant closure options",
      "Moisture barrier protection",
      "Light-blocking materials available",
      "Tamper-evident sealing",
      "FDA compliant materials",
      "Serialization and track-trace ready"
    ]
  },
  {
    name: "Heat-Resistant Packaging Bags",
    description: "Advanced heat-resistant bags capable of withstanding extreme temperatures. Perfect for hot-fill applications, sterilization processes, and high-temperature storage.",
    imageUrl: "https://images.unsplash.com/photo-1603098340318-555a8672916e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWF0JTIwcmVzaXN0YW50JTIwYmFnc3xlbnwxfHx8fDE3NTc0MDczMjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Specialty Packaging",
    features: [
      "Temperature resistance up to 200°C",
      "Thermal shock resistant construction",
      "Chemical stability at high temperatures",
      "Autoclave compatible materials",
      "Retort processing capability",
      "Superior seal integrity under heat"
    ]
  },
  {
    name: "Industrial Liner Bags",
    description: "Large-scale liner bags designed for drums, containers, and bulk storage applications. Providing contamination protection and easy product removal.",
    imageUrl: "https://images.unsplash.com/photo-1542957057-debadce4ce81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbGluZXIlMjBiYWdzfGVufDF8fHx8MTc1NzQwNzMzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Industrial Packaging",
    features: [
      "Custom fit for standard drum sizes",
      "Chemical resistant materials",
      "Easy removal and disposal",
      "Tie-off closure for secure sealing",
      "Contamination barrier protection",
      "Food-grade options available"
    ]
  },
  {
    name: "Textile Industry Bags",
    description: "Specialized bags for textile and garment industries. Protect fabrics, finished goods, and accessories during storage, transport, and retail display.",
    imageUrl: "https://images.unsplash.com/photo-1713900105420-67ae6dbf3595?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGxhc3RpYyUyMG1hbnVmYWN0dXJpbmd8ZW58MXx8fHwxNzU3NDA3MzAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Textile Packaging",
    features: [
      "Breathable material for natural fibers",
      "Anti-static treatment for synthetic fabrics",
      "Transparent viewing panels",
      "Garment-specific sizing options",
      "Wrinkle-resistant packaging design",
      "Moth and pest protection"
    ]
  },
  {
    name: "Freezer-Grade Storage Bags",
    description: "Ultra-durable bags specifically engineered for frozen storage applications. Maintains flexibility and seal integrity at sub-zero temperatures.",
    imageUrl: "https://images.unsplash.com/photo-1752051665228-28ade71b97b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZ3JhZGUlMjBzdG9yYWdlJTIwYmFnc3xlbnwxfHx8fDE3NTczMTc0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Cold Storage",
    features: [
      "Low-temperature flexibility down to -40°C",
      "Freeze-crack resistant materials",
      "Superior seal strength in cold conditions",
      "Vapor barrier protection",
      "Easy-open tabs at low temperatures",
      "Date coding and labeling areas"
    ]
  },
  {
    name: "Chemical Resistant Bags",
    description: "Engineered for handling and storing chemical products safely. Resistant to a wide range of acids, bases, and organic solvents used in industrial processes.",
    imageUrl: "https://images.unsplash.com/photo-1637251393438-30eca8828253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGxhc3RpYyUyMGJhZ3MlMjBoZWF2eSUyMGR1dHl8ZW58MXx8fHwxNzU3MzE3Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Chemical Packaging",
    features: [
      "Resistant to acids, bases, and solvents",
      "UN specification compliance",
      "Stress-crack resistant construction",
      "Double-wall options for extra protection",
      "Chemical compatibility charts provided",
      "Safety data sheet compliance"
    ]
  },
  {
    name: "Laboratory Sample Bags",
    description: "Precision-manufactured bags for laboratory and research applications. Ensuring sample integrity and contamination-free storage for scientific analysis.",
    imageUrl: "https://images.unsplash.com/photo-1601637742135-c9b747da987c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZ3JhZGUlMjBwYWNrYWdpbmclMjBiYWdzfGVufDF8fHx8MTc1NzQwNzMwNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Laboratory Packaging",
    features: [
      "Sterile and non-pyrogenic options",
      "Certified low-extractable materials",
      "Sample identification label areas",
      "Leak-proof sealing mechanisms",
      "Temperature stability range certified",
      "Chain of custody documentation support"
    ]
  },
  {
    name: "Multi-Layer Barrier Films",
    description: "Advanced multi-layer packaging films offering superior barrier properties against oxygen, moisture, and light. Ideal for sensitive product protection.",
    imageUrl: "https://images.unsplash.com/photo-1694610882150-4de206edf95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWN1dW0lMjBzZWFsJTIwYmFycmllciUyMHBhY2thZ2luZ3xlbnwxfHx8fDE3NTczMTc0MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Barrier Films",
    features: [
      "Ultra-low oxygen transmission rates",
      "Excellent moisture vapor barrier",
      "UV light protection capabilities",
      "Puncture and tear resistant",
      "High-speed packaging machine compatible",
      "Custom barrier layer configurations"
    ]
  },
  {
    name: "High-Clarity Display Bags",
    description: "Premium clarity bags designed for product display and presentation. Perfect for retail environments where product visibility is crucial for sales.",
    imageUrl: "https://images.unsplash.com/photo-1603098340318-555a8672916e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmFuc3BhcmVudCUyMHppcGxvY2slMjBiYWdzfGVufDF8fHx8MTc1NzQwNzMyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Display Packaging",
    features: [
      "Crystal clear optical properties",
      "Anti-fog treatment available",
      "Excellent printability for graphics",
      "Hang holes for display options",
      "Static-resistant surface treatment",
      "Superior puncture resistance"
    ]
  },
  {
    name: "Compostable Packaging Solutions",
    description: "Certified compostable bags that break down completely in industrial composting facilities. Meeting the growing demand for sustainable packaging alternatives.",
    imageUrl: "https://images.unsplash.com/photo-1755606045126-1aeb4f0e7c2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9kZWdyYWRhYmxlJTIwZWNvJTIwZnJpZW5kbHklMjBwYWNrYWdpbmd8ZW58MXx8fHwxNzU3MzE3Mzk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Sustainable Packaging",
    features: [
      "ASTM D6400 and EN 13432 certified",
      "BPI certified compostable",
      "Made from renewable resources",
      "Industrial composting facility compatible",
      "Home composting options available",
      "Carbon-neutral manufacturing process"
    ]
  },
  {
    name: "Stretch Wrap Alternatives",
    description: "Innovative bag-based solutions replacing traditional stretch wrap for pallet and product bundling. Offering superior protection with easier application.",
    imageUrl: "https://images.unsplash.com/photo-1542957057-debadce4ce81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwbGluZXIlMjBiYWdzfGVufDF8fHx8MTc1NzQwNzMzMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Logistics Packaging",
    features: [
      "Pre-formed for quick application",
      "Superior load containment",
      "Weather-resistant protection",
      "Reduced labor costs",
      "Tamper-evident features",
      "Recyclable material construction"
    ]
  },
  {
    name: "Electronics Component Bags",
    description: "Precision-engineered bags for sensitive electronics packaging. Providing static protection, moisture control, and contamination prevention for high-tech components.",
    imageUrl: "https://images.unsplash.com/photo-1624607702690-bd8dc7e4dbc4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbnRpJTIwc3RhdGljJTIwcGFja2FnaW5nfGVufDF8fHx8MTc1NzQwNzMxMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Technology Packaging",
    features: [
      "ESD protection to sensitive components",
      "Moisture barrier properties",
      "Clean room compatible materials",
      "Anti-corrosion additives",
      "Trace and track compatibility",
      "Various anti-static levels available"
    ]
  },
  {
    name: "Hazmat Transportation Bags",
    description: "DOT-compliant bags for safe transportation of hazardous materials. Meeting strict regulatory requirements for dangerous goods shipping and handling.",
    imageUrl: "https://images.unsplash.com/photo-1637251393438-30eca8828253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGxhc3RpYyUyMGJhZ3MlMjBoZWF2eSUyMGR1dHl8ZW58MXx8fHwxNzU3MzE3Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Hazmat Packaging",
    features: [
      "DOT/UN specification compliance",
      "Multiple hazard class compatibility",
      "Leak-proof construction certified",
      "Impact and vibration resistant",
      "Temperature range certified",
      "Documentation and labeling support"
    ]
  },
  {
    name: "Seafood Packaging Bags",
    description: "Specialized bags designed for fresh and frozen seafood packaging. Maintaining product freshness while preventing contamination and odor transfer.",
    imageUrl: "https://images.unsplash.com/photo-1752051665228-28ade71b97b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZ3JhZGUlMjBzdG9yYWdlJTIwYmFnc3xlbnwxfHx8fDE3NTczMTc0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Seafood Packaging",
    features: [
      "Odor barrier technology",
      "Ice contact approved materials",
      "Superior puncture resistance",
      "Easy-open perforated options",
      "Leak-proof bottom seals",
      "Microwave-safe for consumer convenience"
    ]
  }
];

export async function initializeProductsInDatabase() {
  console.log('Starting database product initialization...');
  
  try {
    // Test server connection first with timeout
    const healthResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    
    if (!healthResponse.ok) {
      console.log('Server unavailable, using local storage instead...');
      return initializeProductsInLocalStorage();
    }

    console.log('✅ Server available, checking for existing products...');
    
    // Check if products already exist
    const existingProductsResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/products`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      signal: AbortSignal.timeout(5000)
    });
    
    if (existingProductsResponse.ok) {
      const existingProducts = await existingProductsResponse.json();
      if (existingProducts.length > 0) {
        console.log(`Products already exist in database (${existingProducts.length} products)`);
        return { success: true, message: `Found ${existingProducts.length} existing products in database`, count: existingProducts.length };
      }
    }

    console.log('No products found, initializing in local storage for immediate availability...');
    return initializeProductsInLocalStorage();

  } catch (error) {
    console.log('Database connection failed, using local storage for immediate availability...');
    return initializeProductsInLocalStorage();
  }
}

export async function initializeProductsInLocalStorage() {
  console.log('Initializing products in local storage...');
  
  try {
    // Check if products already exist in local storage
    const existingProducts = localStorage.getItem('cartify_products');
    if (existingProducts) {
      const products = JSON.parse(existingProducts);
      if (products.length >= comprehensiveProducts.length) {
        console.log('Full product catalog already exists in local storage, skipping initialization');
        return { success: true, message: 'Products already exist in local storage', count: products.length };
      } else {
        console.log(`Found ${products.length} products, but expanding to ${comprehensiveProducts.length} products...`);
      }
    }

    // Add products to local storage
    const products: Product[] = [];
    
    for (const productData of comprehensiveProducts) {
      const productId = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const product: Product = {
        id: productId,
        name: productData.name,
        description: productData.description,
        imageUrl: productData.imageUrl,
        category: productData.category,
        features: productData.features,
        status: 'active',
        createdAt: new Date().toISOString(),
      };
      
      products.push(product);
      console.log(`✓ Prepared product: ${productData.name}`);
      
      // Small delay to ensure unique timestamps
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Save all products to local storage
    localStorage.setItem('cartify_products', JSON.stringify(products));
    
    return { 
      success: true, 
      message: `Successfully initialized ${products.length} products in local storage`,
      count: products.length 
    };

  } catch (error) {
    console.error('Error during local storage initialization:', error);
    return { 
      success: false, 
      message: 'Failed to initialize products',
      error: error.message 
    };
  }
}

// Helper function to clear all products (for testing)
export async function clearAllProducts() {
  try {
    // Clear from local storage
    localStorage.removeItem('cartify_products');
    localStorage.removeItem('cartify_products_initialized');
    sessionStorage.removeItem('products_init_attempted');
    console.log('Cleared products from local storage');
    
    // Note: For server-side clearing, you would need admin authentication
    // This is left as a manual process through the admin dashboard
    
    return { success: true, message: 'Products cleared from local storage' };
  } catch (error) {
    console.error('Error clearing products:', error);
    return { success: false, message: 'Failed to clear products', error: error.message };
  }
}

// Quick initialization function for immediate use
export async function quickInitProducts() {
  console.log('🚀 Quick product initialization started...');
  
  try {
    // First try local storage (faster for immediate results)
    const localResult = await initializeProductsInLocalStorage();
    
    if (localResult.success) {
      console.log('✅ Local storage initialization successful:', localResult.message);
      
      // Also try database initialization in the background
      try {
        const dbResult = await initializeProductsInDatabase();
        if (dbResult.success) {
          console.log('✅ Database initialization also successful:', dbResult.message);
        }
      } catch (dbError) {
        console.log('⚠️ Database initialization failed, but local storage is working:', dbError);
      }
      
      return localResult;
    } else {
      return localResult;
    }
  } catch (error) {
    console.error('❌ Quick initialization failed:', error);
    return { success: false, message: 'Failed to initialize products', error: error.message };
  }
}

// Function to check if products exist
export async function checkProductsExist() {
  try {
    // Check local storage first
    const localProducts = localStorage.getItem('cartify_products');
    if (localProducts) {
      const products = JSON.parse(localProducts);
      if (products.length > 0) {
        return { exists: true, source: 'localStorage', count: products.length };
      }
    }
    
    // Check server
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-aa812cee/products`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });
      
      if (response.ok) {
        const serverProducts = await response.json();
        if (serverProducts.length > 0) {
          return { exists: true, source: 'server', count: serverProducts.length };
        }
      }
    } catch (serverError) {
      console.log('Server check failed:', serverError);
    }
    
    return { exists: false, source: 'none', count: 0 };
  } catch (error) {
    console.error('Error checking products:', error);
    return { exists: false, source: 'error', count: 0 };
  }
}
