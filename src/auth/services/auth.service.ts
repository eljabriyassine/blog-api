import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/models/user.interface';

const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateJWT(user: User): Promise<string> {
    const { password, ...result } = user;
    return this.jwtService.signAsync({ ...result });
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePasswordHash(
    newPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return bcrypt.compare(newPassword, passwordHash);
  }
}
