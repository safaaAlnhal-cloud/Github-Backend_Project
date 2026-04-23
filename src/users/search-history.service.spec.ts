import { Test, TestingModule } from '@nestjs/testing';
import { SearchHistoryService } from './search-history.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SearchHistory } from './entities/search-history.entity';
import { InternalServerErrorException } from '@nestjs/common';

describe('SearchHistoryService', () => {
  let service: SearchHistoryService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchHistoryService,
        {
          provide: getRepositoryToken(SearchHistory),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get(SearchHistoryService);
    repo = module.get(getRepositoryToken(SearchHistory));
  });

  it('should log search successfully', async () => {
    repo.create.mockReturnValue({ username: 'Ali', github_id: 1 });
    repo.save.mockResolvedValue({ id: 1 });

    const result = await service.logSearch('Ali', 1);

    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual({ id: 1 });
  });

  it('should handle DB error in logSearch', async () => {
    repo.create.mockReturnValue({});
    repo.save.mockRejectedValue(new Error('DB crash'));

    await expect(service.logSearch('Ali', 1)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should return history list', async () => {
    repo.find.mockResolvedValue([{ id: 1 }]);

    const result = await service.getHistory(10, 0);

    expect(result).toEqual([{ id: 1 }]);
  });

  it('should handle DB error in getHistory', async () => {
    repo.find.mockRejectedValue(new Error('DB crash'));

    await expect(service.getHistory(10, 0)).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});