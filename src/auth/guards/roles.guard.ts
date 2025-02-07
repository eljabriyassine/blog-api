import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { forwardRef, Inject } from '@nestjs/common';
import { User } from 'src/users/models/user.interface';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    // Directly use promise from userService.findOne
    const userData = user.id
      ? await this.userService.findUserById(user.id)
      : null;

    // Check if user has the role
    if (userData) {
      const hasRole = roles.indexOf(userData.role || '') > -1;
      return hasRole;
    }

    return false;
  }
}
