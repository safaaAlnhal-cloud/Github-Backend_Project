import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

  async fetchGitHubUser(username: string) {
    if (!username || !username.trim()) {
      throw new Error('Username is required');
    }

    const response = await fetch(
      `https://api.github.com/users/${username}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('User not found');
      }
      throw new Error('GitHub API error');
    }

    return await response.json();
  }
}
