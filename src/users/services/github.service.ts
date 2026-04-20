import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class GitHubService {
  async fetchUser(username: string) {
    if (!username || !username.trim()) {
      throw new BadRequestException('Username is required');
    }

    const response = await fetch(
      `https://api.github.com/users/${username}`
    );

    if (!response.ok) {
      throw new BadRequestException('GitHub user not found');
    }

    return await response.json();
  }
}