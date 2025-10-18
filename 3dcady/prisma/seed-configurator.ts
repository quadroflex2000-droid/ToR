import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedConfigurator() {
  console.log('🌱 Seeding Furniture Configurator data...');

  try {
    // Create Product Types
    const kitchen = await prisma.productType.upsert({
      where: { name: 'kitchen' },
      update: {},
      create: {
        name: 'kitchen',
        displayName: 'Kitchen',
        isActive: true,
      },
    });

    const wardrobe = await prisma.productType.upsert({
      where: { name: 'wardrobe' },
      update: {},
      create: {
        name: 'wardrobe',
        displayName: 'Wardrobe',
        isActive: true,
      },
    });

    console.log('✅ Product types created');

    // Kitchen Categories and Options
    await seedKitchenConfigurator(kitchen.id);
    
    // Wardrobe Categories and Options
    await seedWardrobeConfigurator(wardrobe.id);

    console.log('🎉 Configurator seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding configurator:', error);
    throw error;
  }
}

async function seedKitchenConfigurator(kitchenId: string) {
  console.log('📦 Seeding Kitchen configurator...');

  // Step 1: Layout Type
  const layoutCategory = await prisma.optionCategory.create({
    data: {
      productTypeId: kitchenId,
      name: 'layout_type',
      title: 'Kitchen Layout',
      stepOrder: 1,
      isRequired: true,
      allowsMultiple: false,
      options: {
        create: [
          {
            name: 'Linear',
            description: 'Single wall layout - ideal for compact spaces',
            imageUrl: '/images/configurator/kitchen/layout-linear.jpg',
            displayOrder: 1,
            specifications: { value: 'linear', minLength: 2400 },
          },
          {
            name: 'L-Shaped',
            description: 'Corner layout - maximizes corner space',
            imageUrl: '/images/configurator/kitchen/layout-l-shaped.jpg',
            displayOrder: 2,
            specifications: { value: 'l-shaped', minLength: 2400 },
          },
          {
            name: 'U-Shaped',
            description: 'Three-wall layout - maximum storage and workspace',
            imageUrl: '/images/configurator/kitchen/layout-u-shaped.jpg',
            displayOrder: 3,
            specifications: { value: 'u-shaped', minLength: 3000 },
          },
          {
            name: 'Island',
            description: 'Freestanding central unit - requires large space',
            imageUrl: '/images/configurator/kitchen/layout-island.jpg',
            displayOrder: 4,
            priceFactor: 1.3,
            specifications: { value: 'island', minLength: 4000 },
          },
          {
            name: 'Parallel',
            description: 'Two parallel walls - galley style',
            imageUrl: '/images/configurator/kitchen/layout-parallel.jpg',
            displayOrder: 5,
            specifications: { value: 'parallel', minLength: 2400 },
          },
        ],
      },
    },
  });

  // Step 2: Style
  const styleCategory = await prisma.optionCategory.create({
    data: {
      productTypeId: kitchenId,
      name: 'style',
      title: 'Kitchen Style',
      stepOrder: 2,
      isRequired: true,
      allowsMultiple: false,
      options: {
        create: [
          {
            name: 'Modern',
            description: 'Clean lines, minimalist design, contemporary aesthetics',
            imageUrl: '/images/configurator/style/modern.jpg',
            displayOrder: 1,
            specifications: { value: 'modern' },
          },
          {
            name: 'Classic',
            description: 'Timeless elegance with traditional details',
            imageUrl: '/images/configurator/style/classic.jpg',
            displayOrder: 2,
            specifications: { value: 'classic' },
          },
          {
            name: 'Loft',
            description: 'Industrial style with exposed elements',
            imageUrl: '/images/configurator/style/loft.jpg',
            displayOrder: 3,
            specifications: { value: 'loft' },
          },
          {
            name: 'Minimalist',
            description: 'Ultra-simple, handle-free design',
            imageUrl: '/images/configurator/style/minimalist.jpg',
            displayOrder: 4,
            specifications: { value: 'minimalist' },
          },
        ],
      },
    },
  });

  // Step 3: Corpus Material
  const corpusCategory = await prisma.optionCategory.create({
    data: {
      productTypeId: kitchenId,
      name: 'corpus_material',
      title: 'Corpus Material',
      stepOrder: 3,
      isRequired: true,
      allowsMultiple: false,
      options: {
        create: [
          {
            name: 'Marine Plywood',
            description: 'Premium moisture-resistant plywood - Best for UAE climate',
            imageUrl: '/images/configurator/materials/marine-plywood.jpg',
            displayOrder: 1,
            priceFactor: 1.4,
            specifications: {
              value: 'marine_plywood',
              thickness: 18,
              moistureResistant: true,
              durability: 'excellent',
            },
          },
          {
            name: 'MDF',
            description: 'Medium Density Fiberboard - Smooth finish',
            imageUrl: '/images/configurator/materials/mdf.jpg',
            displayOrder: 2,
            priceFactor: 1.0,
            specifications: {
              value: 'mdf',
              thickness: 18,
              moistureResistant: false,
              durability: 'good',
            },
          },
          {
            name: 'MR Particle Board',
            description: 'Moisture Resistant Particle Board - Cost-effective',
            imageUrl: '/images/configurator/materials/mr-particle-board.jpg',
            displayOrder: 3,
            priceFactor: 0.8,
            specifications: {
              value: 'mr_particle_board',
              thickness: 18,
              moistureResistant: true,
              durability: 'good',
            },
          },
        ],
      },
    },
  });

  // Step 4: Facade Material
  const facadeCategory = await prisma.optionCategory.create({
    data: {
      productTypeId: kitchenId,
      name: 'facade_material',
      title: 'Facade Material & Finish',
      stepOrder: 4,
      isRequired: true,
      allowsMultiple: false,
      options: {
        create: [
          {
            name: 'Acrylic MDF',
            description: 'High-gloss acrylic finish - Premium UAE favorite, easy to clean',
            imageUrl: '/images/configurator/facade/acrylic-mdf.jpg',
            displayOrder: 1,
            priceFactor: 1.5,
            specifications: {
              value: 'acrylic_mdf',
              finish: 'high_gloss',
              durability: 'excellent',
              maintenance: 'easy',
              scratchResistant: true,
            },
          },
          {
            name: 'Lacquered MDF',
            description: 'Painted MDF with multiple finish options',
            imageUrl: '/images/configurator/facade/lacquered-mdf.jpg',
            displayOrder: 2,
            priceFactor: 1.3,
            specifications: {
              value: 'lacquered_mdf',
              finishOptions: ['high_gloss', 'matte', 'super_matte'],
              durability: 'good',
              customColors: true,
            },
          },
          {
            name: 'Laminated MDF',
            description: 'Durable laminate surface - Wood grain or solid colors',
            imageUrl: '/images/configurator/facade/laminated-mdf.jpg',
            displayOrder: 3,
            priceFactor: 1.0,
            specifications: {
              value: 'laminated_mdf',
              finish: 'matte',
              durability: 'excellent',
              scratchResistant: true,
              variety: 'wide',
            },
          },
          {
            name: 'Natural Veneer',
            description: 'Real wood veneer on MDF - Natural wood appearance',
            imageUrl: '/images/configurator/facade/veneer.jpg',
            displayOrder: 4,
            priceFactor: 1.6,
            specifications: {
              value: 'veneer',
              finish: 'matte',
              material: 'natural_wood',
              durability: 'good',
              unique: true,
            },
          },
          {
            name: 'PVC Film',
            description: 'Thermoformed PVC - Cost-effective, various designs',
            imageUrl: '/images/configurator/facade/pvc-film.jpg',
            displayOrder: 5,
            priceFactor: 0.8,
            specifications: {
              value: 'pvc_film',
              finish: 'matte',
              durability: 'moderate',
              economical: true,
            },
          },
        ],
      },
    },
  });

  // Step 5: Countertop Material
  const countertopCategory = await prisma.optionCategory.create({
    data: {
      productTypeId: kitchenId,
      name: 'countertop_material',
      title: 'Countertop Material',
      stepOrder: 5,
      isRequired: true,
      allowsMultiple: false,
      options: {
        create: [
          {
            name: 'Engineered Quartz',
            description: 'Premium engineered stone - Silestone, Caesarstone (Most popular in UAE)',
            imageUrl: '/images/configurator/countertop/engineered-quartz.jpg',
            displayOrder: 1,
            priceFactor: 1.5,
            specifications: {
              value: 'engineered_quartz',
              heatResistant: true,
              scratchResistant: true,
              stainResistant: true,
              maintenance: 'low',
              brands: ['Silestone', 'Caesarstone', 'Compac'],
            },
          },
          {
            name: 'Natural Stone',
            description: 'Granite or marble - Elegant natural material',
            imageUrl: '/images/configurator/countertop/natural-stone.jpg',
            displayOrder: 2,
            priceFactor: 1.3,
            specifications: {
              value: 'natural_stone',
              types: ['granite', 'marble'],
              unique: true,
              maintenance: 'moderate',
              sealing: 'required',
            },
          },
          {
            name: 'Sintered Stone',
            description: 'Ultra-thin large format - Dekton, Laminam (Premium)',
            imageUrl: '/images/configurator/countertop/sintered-stone.jpg',
            displayOrder: 3,
            priceFactor: 1.8,
            specifications: {
              value: 'sintered_stone',
              heatResistant: true,
              scratchResistant: true,
              uvResistant: true,
              ultraThin: true,
              brands: ['Dekton', 'Laminam', 'Neolith'],
            },
          },
          {
            name: 'Solid Surface',
            description: 'Corian-type material - Seamless joints',
            imageUrl: '/images/configurator/countertop/solid-surface.jpg',
            displayOrder: 4,
            priceFactor: 1.2,
            specifications: {
              value: 'solid_surface',
              seamless: true,
              repairable: true,
              nonPorous: true,
              brands: ['Corian', 'Hi-Macs', 'Staron'],
            },
          },
          {
            name: 'HPL (High Pressure Laminate)',
            description: 'Compact laminate - Budget-friendly option',
            imageUrl: '/images/configurator/countertop/hpl.jpg',
            displayOrder: 5,
            priceFactor: 0.6,
            specifications: {
              value: 'hpl',
              economical: true,
              variety: 'wide',
              maintenance: 'low',
            },
          },
        ],
      },
    },
  });

  // Step 6: Hardware
  const hardwareCategory = await prisma.optionCategory.create({
    data: {
      productTypeId: kitchenId,
      name: 'hardware',
      title: 'Hardware & Fittings',
      stepOrder: 6,
      isRequired: true,
      allowsMultiple: false,
      options: {
        create: [
          {
            name: 'Blum Premium',
            description: 'Austrian premium hardware - Soft-close, long-lasting',
            imageUrl: '/images/configurator/hardware/blum.jpg',
            displayOrder: 1,
            priceFactor: 1.5,
            specifications: {
              value: 'blum',
              softClose: true,
              warranty: '10 years',
              quality: 'premium',
            },
          },
          {
            name: 'Hettich',
            description: 'German quality hardware - Reliable and durable',
            imageUrl: '/images/configurator/hardware/hettich.jpg',
            displayOrder: 2,
            priceFactor: 1.3,
            specifications: {
              value: 'hettich',
              softClose: true,
              warranty: '8 years',
              quality: 'high',
            },
          },
          {
            name: 'Standard Quality',
            description: 'Good quality hardware - Cost-effective solution',
            imageUrl: '/images/configurator/hardware/standard.jpg',
            displayOrder: 3,
            priceFactor: 1.0,
            specifications: {
              value: 'standard',
              softClose: 'optional',
              warranty: '2 years',
              quality: 'standard',
            },
          },
        ],
      },
    },
  });

  console.log('✅ Kitchen configurator seeded');
}

async function seedWardrobeConfigurator(wardrobeId: string) {
  console.log('📦 Seeding Wardrobe configurator...');

  // Step 1: Wardrobe Type
  const typeCategory = await prisma.optionCategory.create({
    data: {
      productTypeId: wardrobeId,
      name: 'wardrobe_type',
      title: 'Wardrobe Type',
      stepOrder: 1,
      isRequired: true,
      allowsMultiple: false,
      options: {
        create: [
          {
            name: 'Built-in Wardrobe',
            description: 'Wall-to-wall fitted wardrobe - Maximum space utilization',
            imageUrl: '/images/configurator/wardrobe/built-in.jpg',
            displayOrder: 1,
            specifications: { value: 'built-in', customSize: true },
          },
          {
            name: 'Freestanding Wardrobe',
            description: 'Independent unit - Flexible placement',
            imageUrl: '/images/configurator/wardrobe/freestanding.jpg',
            displayOrder: 2,
            specifications: { value: 'freestanding', standardSizes: true },
          },
        ],
      },
    },
  });

  // Step 2: Style (shared with kitchen)
  const styleCategory = await prisma.optionCategory.create({
    data: {
      productTypeId: wardrobeId,
      name: 'style',
      title: 'Wardrobe Style',
      stepOrder: 2,
      isRequired: true,
      allowsMultiple: false,
      options: {
        create: [
          {
            name: 'Modern',
            description: 'Contemporary design with clean lines',
            imageUrl: '/images/configurator/style/modern.jpg',
            displayOrder: 1,
            specifications: { value: 'modern' },
          },
          {
            name: 'Classic',
            description: 'Traditional elegance',
            imageUrl: '/images/configurator/style/classic.jpg',
            displayOrder: 2,
            specifications: { value: 'classic' },
          },
          {
            name: 'Minimalist',
            description: 'Simple and functional',
            imageUrl: '/images/configurator/style/minimalist.jpg',
            displayOrder: 3,
            specifications: { value: 'minimalist' },
          },
        ],
      },
    },
  });

  // Step 3: Door Type
  const doorTypeCategory = await prisma.optionCategory.create({
    data: {
      productTypeId: wardrobeId,
      name: 'door_type',
      title: 'Door System',
      stepOrder: 3,
      isRequired: true,
      allowsMultiple: false,
      options: {
        create: [
          {
            name: 'Sliding Doors',
            description: 'Space-saving sliding system - Ideal for tight spaces',
            imageUrl: '/images/configurator/wardrobe/sliding-doors.jpg',
            displayOrder: 1,
            priceFactor: 1.3,
            specifications: { value: 'sliding', minWidth: 1200 },
          },
          {
            name: 'Hinged Doors',
            description: 'Traditional opening doors - Full access to interior',
            imageUrl: '/images/configurator/wardrobe/hinged-doors.jpg',
            displayOrder: 2,
            priceFactor: 1.0,
            specifications: { value: 'hinged', requiresClearance: true },
          },
        ],
      },
    },
  });

  // Step 4: Door Materials
  const doorMaterialCategory = await prisma.optionCategory.create({
    data: {
      productTypeId: wardrobeId,
      name: 'door_materials',
      title: 'Door Materials',
      stepOrder: 4,
      isRequired: true,
      allowsMultiple: true,
      options: {
        create: [
          {
            name: 'Lacquered MDF',
            description: 'Painted MDF panels - Wide color range',
            imageUrl: '/images/configurator/wardrobe/door-lacquered.jpg',
            displayOrder: 1,
            priceFactor: 1.2,
            specifications: { value: 'lacquered_mdf', finishOptions: ['high_gloss', 'matte'] },
          },
          {
            name: 'Mirror',
            description: 'Safety-backed mirror panels - Space-expanding effect',
            imageUrl: '/images/configurator/wardrobe/door-mirror.jpg',
            displayOrder: 2,
            priceFactor: 1.4,
            specifications: { value: 'mirror', safetyBacked: true },
          },
          {
            name: 'Tinted Glass',
            description: 'Colored glass panels - Modern aesthetic',
            imageUrl: '/images/configurator/wardrobe/door-glass.jpg',
            displayOrder: 3,
            priceFactor: 1.5,
            specifications: { value: 'tinted_glass', colorOptions: true },
          },
          {
            name: 'Lacobel',
            description: 'Back-painted glass - Premium high-gloss finish',
            imageUrl: '/images/configurator/wardrobe/door-lacobel.jpg',
            displayOrder: 4,
            priceFactor: 1.6,
            specifications: { value: 'lacobel', premium: true },
          },
        ],
      },
    },
  });

  console.log('✅ Wardrobe configurator seeded');
}

// Run the seed function
seedConfigurator()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
