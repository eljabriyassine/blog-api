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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostService } from 'src/post/services/post.service';
import { CreatePostDto } from '../dto/create-post-dto';
import { PostResponseDto } from '../dto/post-response-dto';
import { UpdatePostDto } from '../dto/update-post-dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { OwnershipGuard } from 'src/auth/guards/owner.ship.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  // CREATE: Create a new post
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/postImages',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createPost(
    @Request() req,
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<PostResponseDto> {
    const createPostDto: CreatePostDto = {
      title: body.title,
      content: body.content,
      description: body.description,
    };
    return this.postService.createPost(createPostDto, req.user, file);
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
