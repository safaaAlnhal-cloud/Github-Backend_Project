import {Injectable,NotFoundException,BadRequestException,InternalServerErrorException,Logger,} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

export interface GithubUser {
  id: number;
  login: string;
  name?: string;
  avatar_url: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async saveUser(data: Partial<GithubUser>) {
    try {
      this.logger.log(`Saving user: ${data.login}`);

      const existingUser = await this.userRepository.findOne({
        where: { github_id: data.id },
      });

      if (existingUser) {
        this.logger.log(`User already exists: ${data.login}`);
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

      const saved = await this.userRepository.save(newUser);

      this.logger.log(`User saved successfully: ${saved.username}`);

      return saved;
    } catch (error) {
      this.logger.error('saveUser failed', error);
      throw new InternalServerErrorException('Failed to save user');
    }
  }

  async getUsers(limit: number, offset: number) {
    try {
      this.logger.log(`Fetching users`);

      return await this.userRepository.find({
        take: limit,
        skip: offset,
        order: { id: 'DESC' },
      });
    } catch (error) {
      this.logger.error('getUsers failed', error);
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getUserById(id: number) {
    if (!id) {
      throw new BadRequestException('Invalid user id');
    }

    try {
      this.logger.log(`Fetching user id: ${id}`);

      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(`getUserById failed id=${id}`, error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to fetch user');
    }
  }

  async deleteUser(id: number) {
    if (!id) {
      throw new BadRequestException('Invalid user id');
    }

    try {
      this.logger.log(`Deleting user id: ${id}`);

      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.remove(user);

      this.logger.log(`User deleted: ${id}`);

      return { message: 'User deleted successfully' };
    } catch (error) {
      this.logger.error(`deleteUser failed id=${id}`, error);

      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Failed to delete user');
    }

    
  }

  
}