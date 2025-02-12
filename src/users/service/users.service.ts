import {
  BadRequestException,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';

import { AuthService } from 'src/auth/services/auth.service';

import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

import { UserEntity } from '../models/user.entity';
import { User, UserRole } from '../models/user.interface';
import { LoginUserDto } from '../dto/user.login-dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';

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

  async register(createUserDto: CreateUserDto): Promise<User> {
    let existingUser: UserEntity | null;

    existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new NotFoundException('Email already exists');
    }

    existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });
    if (existingUser) {
      throw new NotFoundException('Username already exists');
    }

    // Validate password
    if (createUserDto.password) {
      // Hash password before saving
      createUserDto.password = await this.authService.hashPassword(
        createUserDto.password,
      );
    }

    const savedUser = await this.userRepository.save(createUserDto);

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

  async changeUserRole(
    userId: string,
    newRole: UpdateUserRoleDto,
  ): Promise<User> {
    if (!userId) {
      throw new NotFoundException('No user ID provided');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = newRole.role;
    await this.userRepository.save(user);

    const { password, ...result } = user;
    return result;
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { id, password, ...result } = user;
    return result;
  }

  async login(
    loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string } | { message: string }> {
    if (!loginUserDto.email || !loginUserDto.password) {
      throw new BadRequestException('Email and password are required');
    }

    const validUser = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!validUser) {
      throw new NotFoundException('Wrong credentials'); // Unauthorized for login failure
    }

    // Generate and return the JWT token
    const token = await this.authService.generateJWT(validUser);

    return { access_token: token };
  }

  validateUser = async (email: string, password: string): Promise<User> => {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password) {
      throw new NotFoundException('Wrong password');
    }

    const isPasswordValid = await this.authService.comparePasswordHash(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new NotFoundException('Invalid password');
    }

    return user;
  };

  validateUUID = (id: string): void => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new BadRequestException('Invalid UUID format');
    }
  };
}
