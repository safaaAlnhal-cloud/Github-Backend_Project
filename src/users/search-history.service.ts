import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchHistory } from './entities/search-history.entity';

@Injectable()
export class SearchHistoryService {
  constructor(
    @InjectRepository(SearchHistory)
    private historyRepository: Repository<SearchHistory>,
  ) {}

  async logSearch(username: string, github_id: number) {
    const record = this.historyRepository.create({
      username,
      github_id,
    });

    return this.historyRepository.save(record);
  }

  async getHistory(limit: number, offset: number) {
    return this.historyRepository.find({
      take: limit,
      skip: offset,
      order: { id: 'DESC' },
    });
  }
}