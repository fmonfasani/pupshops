import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Alimentos',
        description: 'Alimentos balanceados para perros y gatos',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Accesorios',
        description: 'Correas, juguetes y más',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Higiene',
        description: 'Productos de limpieza y cuidado',
      },
    }),
  ]);

  // Create products
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Alimento Premium para Perros Adultos',
        description: 'Alimento balanceado de alta calidad para perros adultos de todas las razas.',
        price: 2500,
        sku: 'DOG-FOOD-001',
        stock: 50,
        slug: 'alimento-premium-perros-adultos',
        categoryId: categories[0].id,
        imageUrl: 'https://example.com/dog-food.jpg',
      },
    }),
    prisma.product.create({
      data: {
        name: 'Alimento Premium para Gatos Adultos',
        description: 'Alimento balanceado de alta calidad para gatos adultos.',
        price: 2200,
        sku: 'CAT-FOOD-001',
        stock: 40,
        slug: 'alimento-premium-gatos-adultos',
        categoryId: categories[0].id,
        imageUrl: 'https://example.com/cat-food.jpg',
      },
    }),
    // ... más productos
  ]);

  // Create services
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Veterinaria',
        description: 'Consultas médicas, vacunación y cirugías.',
        durationMin: 30,
        priceFrom: 1500,
        slug: 'veterinaria',
        imageUrl: 'https://example.com/vet-service.jpg',
      },
    }),
    prisma.service.create({
      data: {
        name: 'Peluquería',
        description: 'Corte de pelo, baño y estética para tu mascota.',
        durationMin: 60,
        priceFrom: 1200,
        slug: 'peluqueria',
        imageUrl: 'https://example.com/grooming-service.jpg',
      },
    }),
    prisma.service.create({
      data: {
        name: 'Entrenamiento',
        description: 'Clases de obediencia y adiestramiento.',
        durationMin: 45,
        priceFrom: 1000,
        slug: 'entrenamiento',
        imageUrl: 'https://example.com/training-service.jpg',
      },
    }),
  ]);

  // Create staff
  const staff = await Promise.all([
    prisma.staff.create({
      data: {
        name: 'Dr. Carlos Rodríguez',
        email: 'carlos@petshop.com',
        phone: '5491112345678',
        serviceId: services[0].id,
      },
    }),
    prisma.staff.create({
      data: {
        name: 'Dra. Laura Martínez',
        email: 'laura@petshop.com',
        phone: '5491187654321',
        serviceId: services[0].id,
      },
    }),
    prisma.staff.create({
      data: {
        name: 'María González',
        email: 'maria@petshop.com',
        phone: '5491123456789',
        serviceId: services[1].id,
      },
    }),
  ]);

  // Create service slots for the next 14 days
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    
    // Create slots for each staff member
    for (const staffMember of staff) {
      // Skip weekends for veterinaria
      if (staffMember.serviceId === services[0].id && (date.getDay() === 0 || date.getDay() === 6)) {
        continue;
      }
      
      // Create slots from 10:00 to 18:00
      for (let hour = 10; hour < 18; hour++) {
        const startTime = new Date(date);
        startTime.setHours(hour, 0, 0, 0);
        
        const endTime = new Date(date);
        endTime.setHours(hour + 1, 0, 0, 0);
        
        await prisma.serviceSlot.create({
          data: {
            date,
            startTime,
            endTime,
            capacity: staffMember.serviceId === services[0].id ? 1 : 2,
            staffId: staffMember.id,
          },
        });
      }
    }
  }

  // Create coupons
  await Promise.all([
    prisma.coupon.create({
      data: {
        code: 'BIENVENIDO10',
        type: 'PERCENTAGE',
        value: 10,
        minAmount: 1000,
        maxUses: 100,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'ENVIOGRATIS',
        type: 'FIXED',
        value: 300,
        minAmount: 2000,
        maxUses: 50,
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      },
    }),
    prisma.coupon.create({
      data: {
        code: 'VERANO20',
        type: 'PERCENTAGE',
        value: 20,
        minAmount: 1500,
        maxUses: 75,
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      },
    }),
  ]);

  // Create reviews
  await Promise.all([
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'Excelente servicio, muy profesionales.',
        productId: products[0].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 4,
        comment: 'Muy buen producto, mi perro lo ama.',
        productId: products[1].id,
      },
    }),
    prisma.review.create({
      data: {
        rating: 5,
        comment: 'La veterinaria es increíble, muy cuidadosos.',
        serviceId: services[0].id,
      },
    }),
  ]);

  // Create a test user
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      phone: '5491100000000',
    },
  });

  // Create loyalty record for the user
  await prisma.loyalty.create({
    data: {
      userId: user.id,
      points: 100,
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });