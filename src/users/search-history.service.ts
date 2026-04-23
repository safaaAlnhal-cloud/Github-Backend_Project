import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchHistory } from './entities/search-history.entity';

@Injectable()
export class SearchHistoryService {
  private readonly logger = new Logger(SearchHistoryService.name);

  constructor(
    @InjectRepository(SearchHistory)
    private historyRepository: Repository<SearchHistory>,
  ) {}

  async logSearch(username: string, github_id: number) {
    try {
      const record = this.historyRepository.create({
        username,
        github_id,
      });

      return await this.historyRepository.save(record);
    } catch (error) {
      this.logger.error('logSearch failed', error);
      throw new InternalServerErrorException('Failed to save search history');
    }
  }

  async getHistory(limit: number, offset: number) {
    try {
      return await this.historyRepository.find({
        take: limit,
        skip: offset,
        order: { id: 'DESC' },
      });
    } catch (error) {
      this.logger.error('getHistory failed', error);
      throw new InternalServerErrorException('Failed to fetch history');
    }
  }
}