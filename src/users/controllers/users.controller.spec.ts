import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { GitHubService } from '../services/github.service';
import { SearchHistoryService } from '../services/search-history.service';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUsers: jest.fn(),
            createUser: jest.fn(),   // ✅ مهم
            deleteUser: jest.fn(),   // ✅ مهم
          },
        },
        {
          provide: GitHubService,
          useValue: {},
        },
        {
          provide: SearchHistoryService,
          useValue: {},
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

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  // =========================
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // =========================
  it('should return users from service', () => {
    const result = [{ id: 1, name: 'Ali' }];

    jest.spyOn(service, 'getUsers').mockReturnValue(result as any);

    const response = controller.getUsers({ limit: 10, offset: 0 });

    expect(response).toEqual(result);
    expect(service.getUsers).toHaveBeenCalledWith(10, 0);
  });

  // =========================
  
});