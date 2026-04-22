import { AppDataSource } from '../data-source';
import { SeedService } from './seed.service';
import { User } from '../users/entities/user.entity';

async function runSeed() {
  await AppDataSource.initialize();

  const seedService = new SeedService(
    AppDataSource.getRepository(User),
  );

  await seedService.seedDatabase();

  console.log('🚀 Seeding finished');

  await AppDataSource.destroy();
}

runSeed();