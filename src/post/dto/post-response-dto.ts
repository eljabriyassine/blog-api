import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the post',
    example: 'b38d387e-46d0-4f6d-a4f8-32d7cba5e40a',
  })
  id: string;

  @ApiProperty({
    description: 'The title of the post',
    example: 'My first post',
  })
  title: string;

  @ApiProperty({
    description: 'The description of the post',
    example: 'This is a post description.',
  })
  description: string;

  @ApiProperty({
    description: 'The image URL associated with the post',
    example: 'https://example.com/image.jpg',
  })
  imgUrl: string;

  @ApiProperty({
    description: 'The ID of the user who created the post',
    example: 'e89f9fd1-0e9f-4e6f-9c96-e2d826a1a72e',
  })
  userId: string;

  @ApiProperty({
    description: 'The date when the post was created',
    example: '2025-02-08T14:23:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The date when the post was last updated',
    example: '2025-02-08T14:23:00Z',
  })
  updatedAt: Date;
}
