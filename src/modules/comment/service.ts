import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import {
  ICommentResponse,
  ICommentWithAuthor,
  TCreateComment,
} from '../../declarations/comment';
import { db } from '../../db';
import { comments } from '../../db/schema';
import { eq } from 'drizzle-orm';
import { ProfileService } from '../profile/service';

export class CommentService {
  constructor() {}

  async create(data: TCreateComment): Promise<ICommentWithAuthor | undefined> {
    return db
      .insert(comments)
      .values({ ...data })
      .returning({ id: comments.id })
      .then(([comment]) => this.get(comment.id));
  }

  async get(id: string): Promise<ICommentWithAuthor | undefined> {
    return db.query.comments.findFirst({
      where: eq(comments.id, id),
      with: {
        author: {
          with: {
            followers: true,
          },
        },
      },
      columns: {
        authorId: false,
      },
    });
  }

  async list(articleId: string): Promise<ICommentWithAuthor[]> {
    return db.query.comments.findMany({
      where: eq(comments.articleId, articleId),
      with: {
        author: {
          with: {
            followers: true,
          },
        },
      },
      columns: {
        authorId: false,
      },
    });
  }

  async delete(id: string) {
    await db.delete(comments).where(eq(comments.id, id));
  }

  response(comment: ICommentWithAuthor, userId?: string): ICommentResponse {
    return {
      id: comment.id,
      body: comment.body,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      author: new ProfileService().response(comment.author, userId),
    };
  }
}
async function commentService(fastify: FastifyInstance) {
  fastify.decorate('commentService', new CommentService());
}

export default fp(commentService);

declare module 'fastify' {
  export interface FastifyInstance {
    commentService: CommentService;
  }
}
