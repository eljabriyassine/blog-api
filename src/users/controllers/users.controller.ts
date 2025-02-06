import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { User, UserRole } from '../models/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { get } from 'http';
import { LoginUserDto } from '../dto/user.login-dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/all')
  findAllUsers(): Promise<User[]> {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findUserById(id);
  }

  @Get('/search/:query')
  findUserByEmailOrUsername(@Param('query') query: string): Promise<User> {
    return this.usersService.findUserByEmailOrUsername(query);
  }

  @Post()
  createUser(@Body() userDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(userDto);
  }

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto): Promise<string> {
    return this.usersService.login(loginUserDto);
  }

  @Patch(':id/role')
  changeUserRole(
    @Param('id') id: string,
    @Body('role') role: UserRole,
  ): Promise<User> {
    return this.usersService.changeUserRole(id, role);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.usersService.deleteUser(id);
  }
}
