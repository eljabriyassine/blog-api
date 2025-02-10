import { Controller, Post, Body, Param, Put, Delete, Get } from '@nestjs/common';
import { PostService } from 'src/post/services/post.service';
import { CreatePostDto } from '../dto/create-post-dto';
import { PostResponseDto } from '../dto/post-response-dto';
import { UpdatePostDto } from '../dto/update-post-dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // CREATE: Create a new post
  @Post()
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @Body('userId') userId: string, // Assuming userId is provided in the body
  ): Promise<PostResponseDto> {
    return this.postService.createPost(createPostDto, userId);
  }

  // READ: Get all posts
  @Get()
  async getAllPosts(): Promise<PostResponseDto[]> {
    return this.postService.getAllPosts();
  }

  // READ: Get a post by ID
  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostResponseDto> {
    return this.postService.getPostById(id);
  }

  // UPDATE: Update a post by ID
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.updatePost(id, updatePostDto);
  }

  // DELETE: Delete a post by ID
  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postService.deletePost(id);
  }
}
