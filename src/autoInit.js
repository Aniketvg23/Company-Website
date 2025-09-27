// Auto-initialization script for products
console.log('🚀 Starting auto-initialization of products...');

// Sample products data
const sampleProducts = [
  {
    id: 'product_1704963600000_abc123',
    name: 'Heavy-Duty Industrial Bags',
    description: 'Engineered for the most demanding industrial applications, these heavy-duty plastic bags provide unmatched strength and durability. Perfect for construction, manufacturing, and waste management industries.',
    imageUrl: 'https://images.unsplash.com/photo-1637251393438-30eca8828253?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmR1c3RyaWFsJTIwcGxhc3RpYyUyMGJhZ3MlMjBoZWF2eSUyMGR1dHl8ZW58MXx8fHwxNzU3MzE3Mzk0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Industrial Packaging',
    features: [
      'Superior tensile strength up to 50kg capacity',
      'Chemical and oil resistant materials',
      'Puncture and tear resistant design',
      'Custom thickness options available',
      'UV stabilized for outdoor use',
      'Available in various sizes and colors'
    ],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'product_1704963610000_def456',
    name: 'Eco-Friendly Biodegradable Bags',
    description: 'Leading the way in sustainable packaging solutions, our biodegradable bags provide the same functionality as traditional plastic while being completely environmentally friendly.',
    imageUrl: 'https://images.unsplash.com/photo-1755606045126-1aeb4f0e7c2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaW9kZWdyYWRhYmxlJTIwZWNvJTIwZnJpZW5kbHklMjBwYWNrYWdpbmd8ZW58MXx8fHwxNzU3MzE3Mzk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Eco-Friendly',
    features: [
      '100% biodegradable within 180 days',
      'Compostable certification (ASTM D6400)',
      'Made from renewable plant-based materials',
      'Reduced carbon footprint manufacturing',
      'Marine-safe decomposition',
      'Available in natural and custom colors'
    ],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'product_1704963620000_ghi789',
    name: 'Food-Grade Storage Bags',
    description: 'FDA-approved food-grade plastic bags designed specifically for food storage, packaging, and preservation. Ensuring safety and freshness for all food-related applications.',
    imageUrl: 'https://images.unsplash.com/photo-1752051665228-28ade71b97b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZ3JhZGUlMjBzdG9yYWdlJTIwYmFnc3xlbnwxfHx8fDE3NTczMTc0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Food Packaging',
    features: [
      'FDA approved food-safe materials',
      'BPA-free and non-toxic composition',
      'Excellent barrier protection against moisture',
      'Transparent for easy product identification',
      'Freezer and microwave safe options',
      'Multiple closure mechanisms available'
    ],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'product_1704963630000_jkl012',
    name: 'Automotive Parts Packaging',
    description: 'Specialized packaging solutions designed for the automotive industry. Protect sensitive automotive components during storage, shipping, and handling with our precision-engineered bags.',
    imageUrl: 'https://images.unsplash.com/photo-1683818051102-dd1199d163b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXRvbW90aXZlJTIwcGFydHMlMjBwYWNrYWdpbmd8ZW58MXx8fHwxNzU3MzE3NDA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Automotive Packaging',
    features: [
      'Anti-static properties for electronic components',
      'Corrosion-resistant material coating',
      'Custom sizes for specific automotive parts',
      'Heat-sealable for secure closure',
      'Laser-printable surface for part identification',
      'High clarity for visual inspection'
    ],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'product_1704963640000_mno345',
    name: 'Custom Printed Branding Bags',
    description: 'Enhance your brand visibility with our custom printed plastic bags. High-quality printing capabilities allow for vibrant logos, branding, and marketing messages on durable packaging.',
    imageUrl: 'https://images.unsplash.com/photo-1587599305803-01f1f176fbb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBwcmludGVkJTIwYmFncyUyMGJyYW5kaW5nfGVufDF8fHx8MTc1NzMxNzQxM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Custom Printing',
    features: [
      'Full-color digital printing capability',
      'High-resolution logo and graphics printing',
      'Pantone color matching available',
      'Scratch and fade-resistant inks',
      'Multiple printing positions available',
      'Small minimum order quantities'
    ],
    status: 'active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'product_1704963650000_pqr678',
    name: 'Vacuum Seal Barrier Bags',
    description: 'Advanced barrier technology bags designed for vacuum sealing applications. Ideal for food preservation, pharmaceutical packaging, and sensitive equipment protection.',
    imageUrl: 'https://images.unsplash.com/photo-1694610882150-4de206edf95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YWN1dW0lMjBzZWFsJTIwYmFycmllciUyMHBhY2thZ2luZ3xlbnwxfHx8fDE3NTczMTc0MTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Barrier Packaging',
    features: [
      'Multi-layer barrier construction',
      'Oxygen and moisture transmission protection',
      'Heat-sealable on both sides',
      'Extended shelf life for packaged products',
      'Crystal clear transparency',
      'Compatible with all vacuum sealing machines'
    ],
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

try {
  // Check if products already exist
  const existingProducts = localStorage.getItem('cartify_products');
  
  if (existingProducts) {
    const products = JSON.parse(existingProducts);
    if (products.length > 0) {
      console.log(`✅ Products already exist (${products.length} products)`);
    } else {
      // Save products to localStorage
      localStorage.setItem('cartify_products', JSON.stringify(sampleProducts));
      console.log(`✅ Initialized ${sampleProducts.length} products in local storage`);
    }
  } else {
    // Save products to localStorage
    localStorage.setItem('cartify_products', JSON.stringify(sampleProducts));
    console.log(`✅ Initialized ${sampleProducts.length} products in local storage`);
  }
  
  // Mark as initialized
  localStorage.setItem('cartify_products_initialized', 'true');
  console.log('🎉 Product initialization complete!');
  
} catch (error) {
  console.error('❌ Error during auto-initialization:', error);
}
