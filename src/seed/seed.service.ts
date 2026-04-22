import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async seedDatabase() {
    await this.userRepo.clear();

    const users = [
      {
        github_id: 1,
        username: 'Ali',
        name: 'Ali User',
        avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
        bio: 'Frontend dev',
        public_repos: 10,
        followers: 5,
        following: 2,
      },
      {
        github_id: 2,
        username: 'Sara',
        name: 'Sara Ahmed',
        avatar_url: 'https://avatars.githubusercontent.com/u/2?v=4',
        bio: 'Backend dev',
        public_repos: 8,
        followers: 12,
        following: 4,
      },
      {
        github_id: 3,
        username: 'Omar',
        name: 'Omar Ali',
        avatar_url: 'https://avatars.githubusercontent.com/u/3?v=4',
        bio: undefined,
        public_repos: 15,
        followers: 20,
        following: 10,
      },
    ];

    for (const user of users) {
      await this.userRepo.save(user);
    }

    console.log('🌱 Seed completed successfully');
  }
}