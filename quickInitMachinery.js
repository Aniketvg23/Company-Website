// Quick machinery initialization script
console.log('🚀 Initializing machinery data...');

// Check if already initialized
const existingMachinery = localStorage.getItem('cartify_machinery');
if (existingMachinery) {
  const machinery = JSON.parse(existingMachinery);
  console.log(`✅ Machinery already exists (${machinery.length} machines)`);
} else {
  // Initialize basic machinery data
  const machineryData = [
    {
      id: 'machinery_001',
      name: 'Multi-Layer Blown Film Extrusion Line',
      description: 'State-of-the-art blown film extrusion line capable of producing multi-layer plastic films with superior barrier properties.',
      imageUrl: 'https://images.unsplash.com/photo-1701448149957-b96dbd1926ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwZXh0cnVzaW9uJTIwbWFjaGluZSUyMGluZHVzdHJpYWx8ZW58MXx8fHwxNzU3NDA3NzczfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      category: 'Extrusion',
      specifications: ['7-layer co-extrusion capability', 'Film width up to 2500mm', 'Thickness range: 15-200 microns'],
      manufacturer: 'Windmöller & Hölscher',
      yearInstalled: '2023',
      capacity: '500 kg/hour',
      status: 'active',
      createdAt: new Date().toISOString()
    }
  ];

  localStorage.setItem('cartify_machinery', JSON.stringify(machineryData));
  console.log(`✅ Initialized ${machineryData.length} machines`);
}

console.log('✅ Machinery initialization complete!');
