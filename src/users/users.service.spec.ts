import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import {
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

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
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should return existing user if found', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });

    const result = await service.saveUser({ id: 1, login: 'Ali' });

    expect(result).toEqual({ id: 1 });
  });

  it('should create and save new user', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.create.mockReturnValue({ id: 1 });
    repo.save.mockResolvedValue({ id: 1 });

    const result = await service.saveUser({
      id: 1,
      login: 'Ali',
    });

    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual({ id: 1 });
  });

  it('should throw InternalServerErrorException on save failure', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.create.mockReturnValue({});
    repo.save.mockRejectedValue(new Error('DB error'));

    await expect(
      service.saveUser({ id: 1, login: 'Ali' }),
    ).rejects.toThrow(InternalServerErrorException);
  });


  it('should return users list', async () => {
    repo.find.mockResolvedValue([{ id: 1 }]);

    const result = await service.getUsers(10, 0);

    expect(result).toEqual([{ id: 1 }]);
  });

  it('should throw InternalServerError on getUsers failure', async () => {
    repo.find.mockRejectedValue(new Error('DB error'));

    await expect(service.getUsers(10, 0)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  it('should return user by id', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });

    const result = await service.getUserById(1);

    expect(result).toEqual({ id: 1 });
  });

  it('should throw BadRequestException for invalid id', async () => {
    await expect(service.getUserById(0)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw NotFoundException if user not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.getUserById(1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw InternalServerError on DB failure', async () => {
    repo.findOne.mockRejectedValue(new Error('DB crash'));

    await expect(service.getUserById(1)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

 
  it('should delete user successfully', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });
    repo.remove.mockResolvedValue({});

    const result = await service.deleteUser(1);

    expect(result).toEqual({
      message: 'User deleted successfully',
    });
  });

  it('should throw BadRequestException for invalid id', async () => {
    await expect(service.deleteUser(0)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should throw NotFoundException if user not found', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.deleteUser(1)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should throw InternalServerError on delete failure', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });
    repo.remove.mockRejectedValue(new Error('DB crash'));

    await expect(service.deleteUser(1)).rejects.toThrow(
      InternalServerErrorException,
    );
  });

  
});