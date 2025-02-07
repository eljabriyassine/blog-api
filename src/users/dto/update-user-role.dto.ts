import { IsEnum, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../models/user.interface';

export class UpdateUserRoleDto {
  @ApiProperty({ description: 'The role of the user' })
  @IsEnum(UserRole)
  role: UserRole;
}
