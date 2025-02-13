import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from 'src/post/models/post.entity';
import { CreatePostDto } from '../dto/create-post-dto';
import { PostResponseDto } from '../dto/post-response-dto';
import { UpdatePostDto } from '../dto/update-post-dto';
import { UserEntity } from 'src/users/models/user.entity';
import * as path from 'path';
const imageToBase64 = require('image-to-base64');
import * as mime from 'mime-types';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  // CREATE: Add a new post
  async createPost(
    createPostDto: CreatePostDto,
    user: UserEntity,
    file: Express.Multer.File,
  ): Promise<PostResponseDto> {
    const existPost = await this.postRepository.findOne({
      where: { title: createPostDto.title },
    });
    if (existPost) {
      throw new ConflictException('title already exists');
    }

    const post = this.postRepository.create({
      ...createPostDto,
      imgUrl: `/uploads/postImages/${file.filename}`,
      user,
    });

    await this.postRepository.save(post);

    return this.mapToPostResponseDto(post);
  }

  async getAllPosts(): Promise<PostResponseDto[]> {
    const posts = await this.postRepository.find({ relations: ['user'] });
    return Promise.all(posts.map((post) => this.mapToPostResponseDto(post)));
  }

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
  private async mapToPostResponseDto(
    post: PostEntity,
  ): Promise<PostResponseDto> {
    // Read image based on imgUrl path and convert to base64
    const imagePath = path.join(__dirname, '..', '..', '..', post.imgUrl);

    // Get the mime type based on the file extension
    const mimeType = mime.lookup(imagePath); // This will return the mime type based on the file extension

    // Read the image content and convert it to base64 asynchronously
    let base64Image = '';
    try {
      base64Image = await imageToBase64(imagePath); // Image URL
    } catch (error) {
      console.error('Error converting image to base64:', error);
      base64Image = '';
    }

    return {
      id: post.id,
      title: post.title,
      description: post.description,
      content: post.content,
      imgUrl: base64Image
        ? `data:${mimeType};base64,${base64Image}`
        : post.imgUrl, // Use base64 if available, otherwise use the original imgUrl
      userId: post.user.id,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      userName: post.user.name,
    };
  }
}
