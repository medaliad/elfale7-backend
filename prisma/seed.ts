import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      firstName: 'Regular',
      lastName: 'User',
      role: 'USER',
    },
  });

  // Create a farm for the regular user
  const farm = await prisma.farm.upsert({
    where: {
      id: 'demo-farm',
    },
    update: {},
    create: {
      id: 'demo-farm',
      name: 'Demo Farm',
      location: 'Demo Location',
      description: 'This is a demo farm created by the seed script',
      userId: user.id,
    },
  });

  // Create some animals for the farm
  await prisma.animal.upsert({
    where: { id: 'demo-sheep' },
    update: {},
    create: {
      id: 'demo-sheep',
      name: 'Woolly',
      type: 'SHEEP',
      birthDate: new Date('2023-01-15'),
      weight: 45.5,
      healthStatus: 'HEALTHY',
      farmId: farm.id,
    },
  });

  await prisma.animal.upsert({
    where: { id: 'demo-goat' },
    update: {},
    create: {
      id: 'demo-goat',
      name: 'Billy',
      type: 'GOAT',
      birthDate: new Date('2023-03-20'),
      weight: 30.2,
      healthStatus: 'HEALTHY',
      farmId: farm.id,
    },
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
