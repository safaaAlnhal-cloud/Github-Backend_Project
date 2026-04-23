import { Test, TestingModule } from '@nestjs/testing';
import { GitHubService } from './github.service';
import { BadRequestException, InternalServerErrorException } from '@nestjs/common';

describe('GitHubService', () => {
  let service: GitHubService;

  const mockFetch = jest.fn();

  beforeAll(() => {
    global.fetch = mockFetch as any;
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GitHubService],
    }).compile();

    service = module.get<GitHubService>(GitHubService);
    jest.clearAllMocks();
  });

  it('should return github user data successfully', async () => {
    const mockUser = {
      login: 'Ali',
      id: 1,
      name: 'Ali',
    };

    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockUser),
    });

    const result = await service.fetchUser('Ali');

    expect(result).toEqual(mockUser);
    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.github.com/users/Ali',
    );
  });

  it('should throw BadRequestException when user not found (404)', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    });

    await expect(service.fetchUser('fakeUser')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException for other GitHub errors', async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    await expect(service.fetchUser('Ali')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw InternalServerErrorException on network failure', async () => {
    mockFetch.mockRejectedValue(new Error('Network down'));

    await expect(service.fetchUser('Ali')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});