import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
describe('UsersService', () => {
  let service: UsersService;
  let repo: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user if exists', async () => {
    const mockUser = { id: 1, username: 'Ali' };

    repo.findOne.mockResolvedValue(mockUser);

    const result = await service.getUserById(1);

    expect(result).toEqual(mockUser);
  });


 it('should throw NotFoundException if user not found', async () => {
  repo.findOne = jest.fn().mockResolvedValue(null);

  await expect(service.getUserById(1)).rejects.toThrow('User not found');
}); 

it('should throw BadRequestException if id is invalid', async () => {
  await expect(service.getUserById(0)).rejects.toThrow('Invalid user id');
});

it('should create and save new user', async () => {
  const data = { id: 1, login: 'Ali' };

  repo.findOne = jest.fn().mockResolvedValue(null);
  repo.create = jest.fn().mockReturnValue({ username: 'Ali' });
  repo.save = jest.fn().mockResolvedValue({ id: 1, username: 'Ali' });

  const result = await service.saveUser(data);

  expect(repo.create).toHaveBeenCalled();
  expect(repo.save).toHaveBeenCalled();
  expect(result).toBeDefined();
});


it('should throw BadRequestException if id is invalid', async () => {
  await expect(service.deleteUser(0)).rejects.toThrow('Invalid user id');
});

it('should throw NotFoundException if user not found', async () => {
  repo.findOne = jest.fn().mockResolvedValue(null);

  await expect(service.deleteUser(1)).rejects.toThrow('User not found');
});

it('should delete user successfully', async () => {
  const mockUser = { id: 1 };

  repo.findOne = jest.fn().mockResolvedValue(mockUser);
  repo.remove = jest.fn().mockResolvedValue(mockUser);

  const result = await service.deleteUser(1);

  expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  expect(repo.remove).toHaveBeenCalledWith(mockUser);
  expect(result).toEqual({
    message: 'User deleted successfully',
  });
});

it('should handle github api failure', async () => {
  repo.findOne = jest.fn().mockRejectedValue(new Error('API failed'));

  await expect(service.saveUser({ id: 1, login: 'Ali' }))
    .rejects.toThrow('API failed');
});


});