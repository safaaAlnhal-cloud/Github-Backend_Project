import { Injectable,NotFoundException,  BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
     
  ) {}

  async saveUser(data: any) {
    const existingUser = await this.userRepository.findOne({
      where: { github_id: data.id },
    });

    if (existingUser) {
      return existingUser;
    }

    const newUser = this.userRepository.create({
      github_id: data.id,
      username: data.login,
      name: data.name,
      avatar_url: data.avatar_url,
      bio: data.bio,
      public_repos: data.public_repos,
      followers: data.followers,
      following: data.following,
    });
   
    await this.userRepository.save(newUser);
    return newUser;
  }


  async getUsers(limit: number, offset: number) {
  return this.userRepository.find({
    take: limit,
    skip: offset,
    order: {
      id: 'DESC',
    },
  });
}

async getUserById(id: number) {
  if (!id) {
    throw new BadRequestException('Invalid user id');
  }
  const user = await this.userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user;
}

async deleteUser(id: number) {
  if (!id) {
    throw new BadRequestException('Invalid user id');
  }

  const user = await this.userRepository.findOne({
    where: { id },
  });

  if (!user) {
    throw new NotFoundException('User not found');
  }

  await this.userRepository.remove(user);

  return {
    message: 'User deleted successfully',
  };
}


}