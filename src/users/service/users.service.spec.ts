import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/services/auth.service'; // Use relative path or mock import
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let authService: AuthService;
  let userRepository: Repository<UserEntity>;

  // Mock AuthService
  const mockAuthService = {
    hashPassword: jest.fn().mockResolvedValue('hashedPassword'),
    comparePasswordHash: jest.fn().mockResolvedValue(true),
    generateJWT: jest.fn().mockResolvedValue('mockJwtToken'),
  };

  // Mock UserRepository
  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedPassword',
    }),
    save: jest.fn().mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedPassword',
    }),
    update: jest.fn().mockResolvedValue({}),
    delete: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: AuthService, useValue: mockAuthService },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto = {
      name: 'test',
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      role: 'user',
    };

    const result = await service.createUser(createUserDto);
    expect(result.email).toEqual('test@example.com');
    expect(result.username).toEqual('testuser');
  });

  it('should throw error if email exists', async () => {
    mockUserRepository.findOne = jest.fn().mockResolvedValueOnce({
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      password: 'hashedPassword',
    });

    const createUserDto = {
      email: 'test@example.com',
      username: 'newuser',
      password: 'password123',
    };

    await expect(service.createUser(createUserDto)).rejects.toThrowError(
      'Email already exists',
    );
  });

  it('should validate UUID format', () => {
    expect(() => service.validateUUID('invalid-uuid')).toThrowError(
      'Invalid UUID format',
    );
    expect(() =>
      service.validateUUID('123e4567-e89b-12d3-a456-426614174000'),
    ).not.toThrowError();
  });
});
