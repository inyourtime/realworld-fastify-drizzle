import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ApiRequest } from '../../declarations/api';
import { TCommentCreateSchema } from './schema';
import { Err404UserNotFound } from '../../utils/exceptions/user';
import {
  Err403CommentForbidden,
  Err404ArticleNotFound,
  Err404CommentNotFound,
} from '../../utils/exceptions/article';

type CommentPostApi = ApiRequest<{
  Body: TCommentCreateSchema;
  Params: { slug: string };
}>;
export async function addCommentsToArticle(
  this: FastifyInstance,
  request: FastifyRequest<CommentPostApi>,
  reply: FastifyReply,
) {
  const { body } = request.body.comment;

  const loginUser = await this.userService.findById(request.auth!.userId);
  if (!loginUser) throw Err404UserNotFound;

  const targetArc = await this.articleService.findBySlug(request.params.slug);
  if (!targetArc) throw Err404ArticleNotFound;

  const result = await this.commentService.create({
    body,
    articleId: targetArc.id,
    authorId: loginUser.id,
  });

  return this.commentService.response(result!, request.auth?.userId);
}

type CommentGetApi = ApiRequest<{
  Params: { slug: string };
}>;
export async function getCommentsFromArticle(
  this: FastifyInstance,
  request: FastifyRequest<CommentGetApi>,
  reply: FastifyReply,
) {
  const targetArc = await this.articleService.findBySlug(request.params.slug);
  if (!targetArc) throw Err404ArticleNotFound;

  const commentList = await this.commentService.list(targetArc.id);

  return {
    comments: commentList.map((comment) =>
      this.commentService.response(comment, request.auth?.userId),
    ),
  };
}

type CommentDeleteApi = ApiRequest<{
  Params: { slug: string; id: string };
}>;
export async function deleteComment(
  this: FastifyInstance,
  request: FastifyRequest<CommentDeleteApi>,
  reply: FastifyReply,
) {
  const loginUser = await this.userService.findById(request.auth!.userId);
  if (!loginUser) throw Err404UserNotFound;

  const targetComment = await this.commentService.get(request.params.id);
  if (!targetComment) throw Err404CommentNotFound;

  if (targetComment.author.id !== loginUser.id) {
    throw Err403CommentForbidden;
  }

  await this.commentService.delete(targetComment.id);

  return {
    message: 'comment has been successfully deleted!!!',
  };
}
