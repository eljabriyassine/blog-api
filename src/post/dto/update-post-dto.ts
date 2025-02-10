import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdatePostDto {
  @ApiPropertyOptional({
    description: 'The new title of the post',
    example: 'Updated Post Title',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'The new description of the post',
    example: 'Updated description of the post.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description: 'The new image URL associated with the post',
    example: 'https://example.com/new-image.jpg',
  })
  @IsOptional()
  @IsUrl()
  imgUrl?: string;
}
