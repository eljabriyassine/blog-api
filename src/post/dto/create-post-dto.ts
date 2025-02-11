import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My first post',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the post',
    example: 'This is a post description.',
  })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({
    description: 'The image URL associated with the post',
    example: 'https://example.com/image.jpg',
  })
  @IsNotEmpty()
  @IsUrl()
  imgUrl: string;

  @ApiPropertyOptional({
    description: 'User ID to relate the post to a user',
    example: 'e89f9fd1-0e9f-4e6f-9c96-e2d826a1a72e',
  })
  @IsOptional()
  userId?: string;  // userId to relate the post to a user
}
