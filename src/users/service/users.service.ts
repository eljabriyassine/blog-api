import { BadRequestException } from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { AuthService } from 'src/auth/services/auth.service';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

import { UserEntity } from '../models/user.entity';
import { User, UserRole } from '../models/user.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService,
  ) {}

  async findUserById(userId: string): Promise<User> {
    if (!userId) {
      throw new NotFoundException('No user ID provided');
    }

    this.validateUUID(userId);

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { id, password, ...result } = user;
    return result;
  }

  async findAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    users.map((user) => {
      const { password, id, ...result } = user;
      return result;
    });

    return users;
  }

  async findUserByEmailOrUsername(query: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: [{ email: query }, { username: query }],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async createUser(CreateUserDto: CreateUserDto): Promise<User> {
    let existingUser: UserEntity | null;

    existingUser = await this.userRepository.findOne({
      where: { email: CreateUserDto.email },
    });

    if (existingUser) {
      throw new NotFoundException('Email already exists');
    }

    existingUser = await this.userRepository.findOne({
      where: { username: CreateUserDto.username },
    });
    if (existingUser) {
      throw new NotFoundException('Username already exists');
    }

    // Validate password
    if (CreateUserDto.password) {
      // Hash password before saving
      CreateUserDto.password = await this.authService.hashPassword(
        CreateUserDto.password,
      );
    }

    const savedUser = await this.userRepository.save(CreateUserDto);

    const { id, password, ...result } = savedUser;

    return result;
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (!userId) {
      throw new NotFoundException('No user ID provided');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the new username or email already exists
    if (updateUserDto.email) {
      const emailExists = await this.userRepository.findOne({
        where: { email: updateUserDto.email, id: Not(userId) },
      });
      if (emailExists) {
        throw new NotFoundException('Email is already taken');
      }
    }

    if (updateUserDto.username) {
      const usernameExists = await this.userRepository.findOne({
        where: { username: updateUserDto.username, id: Not(userId) },
      });
      if (usernameExists) {
        throw new NotFoundException('Username is already taken');
      }
    }

    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await this.authService.hashPassword(
        updateUserDto.password,
      );
    }

    await this.userRepository.update(userId, updateUserDto);

    const updatedUser = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = updatedUser;
    return result;
  }

  async deleteUser(userId: string): Promise<{ message: string }> {
    if (!userId) {
      return { message: 'No user ID provided' };
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return { message: 'User not found' };
    }

    await this.userRepository.delete(userId);

    return { message: 'User successfully deleted' };
  }

  async changeUserRole(userId: string, newRole: UserRole): Promise<User> {
    if (!userId) {
      throw new NotFoundException('No user ID provided');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = newRole;
    await this.userRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  validateUUID = (id: string): void => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
  };
}
