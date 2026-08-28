const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting AGRIMIND database seeding...');

  // 1. Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.farmActivity.deleteMany();
  await prisma.farmCost.deleteMany();
  await prisma.waterRecommendation.deleteMany();
  await prisma.cropRecommendation.deleteMany();
  await prisma.weatherRecord.deleteMany();
  await prisma.crop.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.customerProfile.deleteMany();
  await prisma.merchantProfile.deleteMany();
  await prisma.farm.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing tables.');

  // 2. Hash default password
  const defaultPassword = 'password123';
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(defaultPassword, salt);

  // 3. Create Seed Users
  // 3a. Farmer User
  const farmer = await prisma.user.create({
    data: {
      fullName: 'Naresh Chinta',
      mobileNumber: '9876543210',
      email: 'farmer@agrimind.in',
      passwordHash,
      role: 'FARMER',
      preferredLanguage: 'ta',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      farmerProfile: {
        create: {
          village: 'Papanasam',
          farmSize: 5.5,
          farmSizeUnit: 'Acres',
          soilType: 'alluvial',
          currentCrops: 'Paddy (Ponni & BPT-5204)',
          pmKisanId: 'TN-THJ-2026-9812'
        }
      },
      farms: {
        create: {
          farmName: 'Cauvery Delta Organic Green Farm',
          location: 'Papanasam, Thanjavur',
          totalArea: 5.5,
          soilType: 'alluvial',
          latitude: 10.9254,
          longitude: 79.2789
        }
      }
    }
  });

  // 3b. Customer User
  const customer = await prisma.user.create({
    data: {
      fullName: 'Ananya Sharma',
      mobileNumber: '9840123456',
      email: 'customer@agrimind.in',
      passwordHash,
      role: 'CUSTOMER',
      preferredLanguage: 'en',
      state: 'Tamil Nadu',
      district: 'Chennai',
      customerProfile: {
        create: {
          deliveryAddress: 'Plot 42, Anna Nagar West, Chennai, Tamil Nadu',
          city: 'Chennai',
          pincode: '600040',
          preferences: JSON.stringify(['Organic Rice', 'Country Tomatoes', 'Cold-pressed Sesame Oil'])
        }
      }
    }
  });

  // 3c. Merchant User
  const merchant = await prisma.user.create({
    data: {
      fullName: 'Rajesh Kumar',
      mobileNumber: '9842109876',
      email: 'merchant@agrimind.in',
      passwordHash,
      role: 'MERCHANT',
      preferredLanguage: 'ta',
      state: 'Tamil Nadu',
      district: 'Thanjavur',
      merchantProfile: {
        create: {
          businessName: 'Sri Lakshmi Modern Rice Mill & Agro Traders',
          businessType: 'Grain Miller & Wholesale Trader',
          businessAddress: 'Plot 12, APMC Mandi Yard, Thanjavur, Tamil Nadu',
          gstNumber: '33AAAAA0000A1Z5',
          apmcLicense: 'TN-APMC-THJ-2024-88'
        }
      }
    }
  });

  console.log(`✅ Created Users: Farmer (${farmer.fullName}), Customer (${customer.fullName}), Merchant (${merchant.fullName})`);

  // 4. Seed Crops Catalog
  const crops = await prisma.crop.createMany({
    data: [
      {
        name: 'Ponni Samba Paddy',
        scientificName: 'Oryza sativa (Ponni)',
        category: 'Cereals & Grains',
        suitableSoil: 'Alluvial Loam',
        waterRequirement: 'High',
        sowingSeason: 'Kharif / Samba (July - August)',
        durationDays: 135,
        expectedYield: '24 - 28 Quintals/Acre',
        fertilizerRecipe: 'Urea: 60kg + DAP: 45kg + MOP: 25kg + Zinc: 5kg/Acre',
        description: 'Traditional aromatic medium-grain paddy renowned for boiled rice preparation in Tamil Nadu and South India.'
      },
      {
        name: 'High Yield Wheat (HD 3086)',
        scientificName: 'Triticum aestivum',
        category: 'Cereals & Grains',
        suitableSoil: 'Alluvial & Black Soil',
        waterRequirement: 'Moderate',
        sowingSeason: 'Rabi (Nov - Dec)',
        durationDays: 120,
        expectedYield: '20 - 24 Quintals/Acre',
        fertilizerRecipe: 'Urea: 55kg + DAP: 40kg + MOP: 20kg/Acre',
        description: 'Rust resistant high-protein wheat variety suited for irrigated conditions.'
      },
      {
        name: 'Bt Cotton (RCH 659)',
        scientificName: 'Gossypium hirsutum',
        category: 'Cash Crops & Fiber',
        suitableSoil: 'Black Regur Soil',
        waterRequirement: 'Moderate',
        sowingSeason: 'Kharif (June - July)',
        durationDays: 160,
        expectedYield: '14 - 18 Quintals/Acre',
        fertilizerRecipe: 'Urea: 70kg + DAP: 50kg + Potash: 30kg/Acre',
        description: 'High-yield hybrid cotton with 29mm staple length and bollworm resistance.'
      }
    ]
  });

  console.log('✅ Seeded Verified Crop Varieties.');

  // 5. Seed Marketplace Products
  const prod1 = await prisma.product.create({
    data: {
      sellerId: farmer.id,
      sellerRole: 'FARMER',
      name: 'Organic Traditional Ponni Paddy (Harvest Fresh)',
      category: 'Cereals & Grains',
      quantity: 120,
      unit: 'Bags (75kg)',
      price: 2450,
      location: 'Thanjavur APMC Yard',
      description: 'Naturally cultivated Ponni paddy grown using organic vermicompost. Moisture level is 13% (Ideal for long storage & milling). Ready for immediate loading.',
      imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
      available: true,
      rating: 4.9,
      reviewsCount: 38
    }
  });

  const prod2 = await prisma.product.create({
    data: {
      sellerId: farmer.id,
      sellerRole: 'FARMER',
      name: 'Farm Fresh Country Tomatoes (Grade-A)',
      category: 'Vegetables',
      quantity: 80,
      unit: 'Crates (15kg)',
      price: 380,
      location: 'Salem Farmers Market',
      description: 'Juicy, naturally ripened country tomatoes plucked directly this morning. Excellent for household cooking and bulk supply.',
      imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      available: true,
      rating: 4.8,
      reviewsCount: 52
    }
  });

  const prod3 = await prisma.product.create({
    data: {
      sellerId: merchant.id,
      sellerRole: 'MERCHANT',
      name: 'Premium Aged Basmati Rice (1121 Steam Extra Long)',
      category: 'Cereals & Grains',
      quantity: 450,
      unit: 'Bags (25kg)',
      price: 1850,
      location: 'Thanjavur Rice Mill Complex',
      description: '2-year aged aromatic 1121 steam Basmati grain. Cook length doubles with authentic aroma. Double sorted & de-stoned.',
      imageUrl: 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&auto=format&fit=crop&q=80',
      available: true,
      rating: 5.0,
      reviewsCount: 89
    }
  });

  console.log('✅ Seeded Marketplace Products.');

  // 6. Seed Sample Customer Orders
  await prisma.order.create({
    data: {
      customerId: customer.id,
      sellerId: farmer.id,
      totalPrice: 4900,
      status: 'SHIPPED',
      paymentMethod: 'UPI Online',
      paymentStatus: 'PAID',
      deliveryAddress: 'Plot 42, Anna Nagar West, Chennai, Tamil Nadu',
      timelineJson: JSON.stringify([
        { step: 'Order Placed', time: 'Yesterday 10:30 AM', done: true },
        { step: 'Packed at Farm', time: 'Yesterday 04:00 PM', done: true },
        { step: 'Out for Delivery', time: 'Today 08:30 AM', done: true },
        { step: 'Delivered to Door', time: 'Expected Today 03:00 PM', done: false }
      ]),
      orderItems: {
        create: {
          productId: prod1.id,
          productName: prod1.name,
          quantity: 2,
          unit: prod1.unit,
          unitPrice: prod1.price,
          totalPrice: 4900
        }
      }
    }
  });

  console.log('✅ Seeded Sample Customer Orders.');

  // 7. Seed Weather Records
  await prisma.weatherRecord.create({
    data: {
      location: 'Thanjavur, Tamil Nadu',
      temperature: 31.5,
      humidity: 62.0,
      rainfallProbability: 5.0,
      windSpeed: 12.0,
      condition: 'Sunny & Clear',
      sprayAdvisory: 'Optimal weather for morning foliar spray until 11:00 AM.'
    }
  });

  console.log('🎉 AGRIMIND database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
