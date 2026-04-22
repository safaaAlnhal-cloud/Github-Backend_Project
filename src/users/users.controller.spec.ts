import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GitHubService } from './github.service';
import { SearchHistoryService } from './search-history.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { BadRequestException } from '@nestjs/common';


describe('UsersController', () => {
  let controller: UsersController;
  let service: any;
  let githubService: any;
  let historyService: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn(),
            saveUser: jest.fn(),
            getUserById: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
        {
          provide: GitHubService,
          useValue: {
            fetchUser: jest.fn(),
          },
        },
        {
          provide: SearchHistoryService,
          useValue: {
            logSearch: jest.fn(),
            getHistory: jest.fn(),
          },
        },
        {
          provide: WINSTON_MODULE_PROVIDER,
          useValue: {
            info: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(UsersController);
    service = module.get(UsersService);
    githubService = module.get(GitHubService);
    historyService = module.get(SearchHistoryService);
  });

  
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  
  it('should return users from service', () => {
    const result = [{ id: 1, name: 'Ali' }];

    service.getUsers.mockReturnValue(result);

    const response = controller.getUsers({ limit: 10, offset: 0 });

    expect(response).toEqual(result);
    expect(service.getUsers).toHaveBeenCalledWith(10, 0);
  });

  
  it('should search user and return saved user', async () => {
    const dto = { username: 'Ali' };
    const githubData = {
      id: 1,
      login: 'Ali',
    };
    const savedUser = {
      id: 1,
      username: 'Ali',
    };
    githubService.fetchUser.mockResolvedValue(githubData);
    service.saveUser.mockResolvedValue(savedUser);
    historyService.logSearch.mockResolvedValue(null);

    const result = await controller.searchUser(dto);

    expect(githubService.fetchUser).toHaveBeenCalledWith('Ali');
    expect(service.saveUser).toHaveBeenCalledWith(githubData);
    expect(historyService.logSearch).toHaveBeenCalledWith('Ali', 1);
    expect(result).toEqual(savedUser);
  });

  it('should return user by id', async () => {
  const user = { id: 1, username: 'Ali' };

  service.getUserById.mockResolvedValue(user);

  const result = await controller.getUserById({ id: 1 });

  expect(service.getUserById).toHaveBeenCalledWith(1);
  expect(result).toEqual(user);
});

it('should delete user', async () => {
  const response = { message: 'User deleted successfully' };

  service.deleteUser.mockResolvedValue(response);

  const result = await controller.deleteUser({ id: 1 });

  expect(service.deleteUser).toHaveBeenCalledWith(1);
  expect(result).toEqual(response);
});


it('should return search history', async () => {
  const history = [{ id: 1, username: 'Ali' }];

  historyService.getHistory.mockResolvedValue(history);

  const result = await controller.getHistory({ limit: 10, offset: 0 });

  expect(historyService.getHistory).toHaveBeenCalledWith(10, 0);
  expect(result).toEqual(history);
});

it('should handle github 404 error', async () => {
  githubService.fetchUser.mockRejectedValue(
    new BadRequestException('GitHub user not found')
  );

  await expect(
    controller.searchUser({ username: 'fake' })
  ).rejects.toThrow('GitHub user not found');
});

it('should handle network error from GitHub API', async () => {
  githubService.fetchUser.mockRejectedValue(
    new Error('Network Error')
  );

  await expect(
    controller.searchUser({ username: 'Ali' })
  ).rejects.toThrow('Network Error');
});



});