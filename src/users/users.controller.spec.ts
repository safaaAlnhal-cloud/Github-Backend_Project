import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GitHubService } from './github.service';
import { SearchHistoryService } from './search-history.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { BadRequestException ,InternalServerErrorException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: any;
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
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
    githubService = module.get(GitHubService);
    historyService = module.get(SearchHistoryService);
  });

  it('should search github user and save it', async () => {
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
    usersService.saveUser.mockResolvedValue(savedUser);
    historyService.logSearch.mockResolvedValue(undefined);

    const result = await controller.searchUser(dto);

    expect(githubService.fetchUser).toHaveBeenCalledWith('Ali');
    expect(usersService.saveUser).toHaveBeenCalledWith(githubData);
    expect(historyService.logSearch).toHaveBeenCalledWith('Ali', 1);
    expect(result).toEqual(savedUser);
  });

  it('should fail when username is empty', async () => {
  await expect(
    controller.searchUser({ username: '' }),
  ).rejects.toThrow();
});

  it('should throw error if GitHub user not found', async () => {
    githubService.fetchUser.mockRejectedValue(
      new BadRequestException('GitHub user not found'),
    );

    await expect(
      controller.searchUser({ username: 'fake' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('should return users list', () => {
    const result = [{ id: 1, username: 'Ali' }];
    usersService.getUsers.mockReturnValue(result);
    const response = controller.getUsers({ limit: 10, offset: 0 });
    expect(usersService.getUsers).toHaveBeenCalledWith(10, 0);
    expect(response).toEqual(result);
  });

  it('should return search history', () => {
    const history = [{ id: 1, username: 'Ali' }];

    historyService.getHistory.mockReturnValue(history);

    const result = controller.getHistory({ limit: 10, offset: 0 });

    expect(historyService.getHistory).toHaveBeenCalledWith(10, 0);
    expect(result).toEqual(history);
  });


  it('should return user by id', () => {
    const user = { id: 1, username: 'Ali' };

    usersService.getUserById.mockReturnValue(user);

    const result = controller.getUserById({ id: 1 });

    expect(usersService.getUserById).toHaveBeenCalledWith(1);
    expect(result).toEqual(user);
  });


  it('should delete user', () => {
    const response = { message: 'User deleted successfully' };

    usersService.deleteUser.mockReturnValue(response);

    const result = controller.deleteUser({ id: 1 });

    expect(usersService.deleteUser).toHaveBeenCalledWith(1);
    expect(result).toEqual(response);
  });
  
it('should throw error if saveUser fails', async () => {
  githubService.fetchUser.mockResolvedValue({ id: 1, login: 'Ali' });

  usersService.saveUser.mockRejectedValue(
    new InternalServerErrorException(),
  );

  await expect(
    controller.searchUser({ username: 'Ali' }),
  ).rejects.toThrow();
});

it('should still fail if history logging fails', async () => {
  githubService.fetchUser.mockResolvedValue({ id: 1, login: 'Ali' });
  usersService.saveUser.mockResolvedValue({ id: 1 });

  historyService.logSearch.mockRejectedValue(
    new Error('history db error'),
  );

  await expect(
    controller.searchUser({ username: 'Ali' }),
  ).rejects.toThrow();
});
});