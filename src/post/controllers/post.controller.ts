import {
  Controller,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Get,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostService } from 'src/post/services/post.service';
import { CreatePostDto } from '../dto/create-post-dto';
import { PostResponseDto } from '../dto/post-response-dto';
import { UpdatePostDto } from '../dto/update-post-dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { OwnershipGuard } from 'src/auth/guards/owner.ship.guard';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // CREATE: Create a new post
  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(
    @Request() req,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.createPost(createPostDto, req.user);
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
  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnershipGuard)
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postService.updatePost(id, updatePostDto);
  }

  // DELETE: Delete a post by ID
  @UseGuards(JwtAuthGuard)
  @UseGuards(OwnershipGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string): Promise<void> {
    return this.postService.deletePost(id);
  }
}
