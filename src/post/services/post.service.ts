import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/post/models/post.entity';
import { CreatePostDto } from '../dto/create-post-dto';
import { PostResponseDto } from '../dto/post-response-dto';
import { UpdatePostDto } from '../dto/update-post-dto';
import { UsersService } from 'src/users/service/users.service';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,

    private readonly userService:UsersService,
  ) {}

  // CREATE: Add a new post
  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
  ): Promise<PostResponseDto> {
    const user = await this.userService.findUserById( userId );
    if (!user) {
      throw new Error('User not found');
    }

    const post = this.postRepository.create({
      ...createPostDto,
      user,
    });

    await this.postRepository.save(post);

    return this.mapToPostResponseDto(post);
  }

  // READ: Get all posts
  async getAllPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({ relations: ['user'] });
    return posts.map((post) => this.mapToPostResponseDto(post));
  }

  // READ: Get a single post by ID
  async getPostById(postId: string): Promise<PostResponseDto> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: ['user'],
    });
    if (!post) {
      throw new Error('Post not found');
    }
    return this.mapToPostResponseDto(post);
  }

  // UPDATE: Update an existing post
  async updatePost(
    postId: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new Error('Post not found');
    }

    // Update fields
    const updatedPost = Object.assign(post, updatePostDto);
    await this.postRepository.save(updatedPost);

    return this.mapToPostResponseDto(updatedPost);
  }

  // DELETE: Delete a post by ID
  async deletePost(postId: string): Promise<void> {
    const post = await this.postRepository.findOneBy({ id: postId });
    if (!post) {
      throw new Error('Post not found');
    }

    await this.postRepository.delete(postId);
  }

  // Helper method to map entity to response DTO
  private mapToPostResponseDto(post: PostEntity): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      imgUrl: post.imgUrl,
      userId: post.user.id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}
