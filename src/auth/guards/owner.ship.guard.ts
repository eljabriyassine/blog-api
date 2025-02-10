import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PostService } from 'src/post/services/post.service';
import { User } from 'src/users/models/user.interface';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(forwardRef(() => PostService))
    private postService: PostService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const postId = request.params.id; // Assuming postId is passed as a parameter
    const user: User = request.user;
    return this.validateOwnership(postId, user.id as string);
  }

  private async validateOwnership(
    postId: string,
    userId: string,
  ): Promise<boolean> {
    const post = await this.postService.getPostById(postId);

    if (!post) {
      throw new ForbiddenException('Post not found');
    }

    if (post.id !== userId) {
      throw new ForbiddenException('You do not own this post');
    }

    return true;
  }
}
