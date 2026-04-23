import { Injectable, BadRequestException, InternalServerErrorException, Logger,} from '@nestjs/common';
@Injectable()
export class GitHubService {
  private readonly logger = new Logger(GitHubService.name);

  async fetchUser(username: string) {
    try {
      this.logger.log(`Fetching GitHub user: ${username}`);

      const response = await fetch(
        `https://api.github.com/users/${username}`,
      );

      if (response.status === 404) {
        throw new BadRequestException('GitHub user not found');
      }

      if (!response.ok) {
        throw new BadRequestException(
          `GitHub API error: ${response.status}`,
        );
      }

      const data = await response.json();

      this.logger.log(`GitHub user fetched successfully: ${username}`);

      return data;

    } catch (err) {
      this.logger.error('GitHub fetch failed', err);

      if (err instanceof BadRequestException) {
        throw err;
      }

      throw new InternalServerErrorException();
    }
  }
}