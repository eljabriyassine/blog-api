import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { User, UserRole } from '../models/user.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/user.login-dto';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateUserRoleDto } from '../dto/update-user-role.dto';

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

  @Post('/register')
  register(@Body() userDto: CreateUserDto): Promise<User> {
    return this.usersService.register(userDto);
  }

  @Post('/login')
  login(
    @Body() loginUserDto: LoginUserDto,
  ): Promise<{ access_token: string } | { message: string }> {
    return this.usersService.login(loginUserDto);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  changeUserRole(
    @Param('id') id: string,
    @Body('role') role: UpdateUserRoleDto,
  ): Promise<User> {
    return this.usersService.changeUserRole(id, role);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<{ message: string }> {
    return this.usersService.deleteUser(id);
  }
}
