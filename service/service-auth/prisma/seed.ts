import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const BCRYPT_ROUNDS = 12;

async function main() {
  console.log('🌱 Seeding auth database...');

  // VP-228: Seed admin + teacher + student sample users
  const users = [
    {
      email: 'admin@verveai.edu.vn',
      password: await bcrypt.hash('admin@123', BCRYPT_ROUNDS),
      name: 'Admin User',
      role: 'ADMIN',
      is_active: true,
    },
    {
      email: 'teacher@verveai.edu.vn',
      password: await bcrypt.hash('teacher@123', BCRYPT_ROUNDS),
      name: 'Nguyễn Văn Giáo',
      role: 'TEACHER',
      is_active: true,
    },
    {
      email: 'teacher2@verveai.edu.vn',
      password: await bcrypt.hash('teacher@123', BCRYPT_ROUNDS),
      name: 'Trần Thị Dạy',
      role: 'TEACHER',
      is_active: true,
    },
    {
      email: 'supervisor@verveai.edu.vn',
      password: await bcrypt.hash('supervisor@123', BCRYPT_ROUNDS),
      name: 'Supervisor User',
      role: 'SUPERVISOR',
      is_active: true,
    },
  ];

  for (const userData of users) {
    const existing = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    if (!existing) {
      const user = await prisma.user.create({
        data: userData,
      });
      console.log(`✅ Created user: ${user.email} (${user.role})`);
    } else {
      console.log(`⏭️  User already exists: ${userData.email}`);
    }
  }

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
