import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ApiRequest, IAnyObject } from '../../declarations/api';
import { Err404UserNotFound } from '../../utils/exceptions/user';
import {
  TArticleCreateSchema,
  TArticleUpdateSchema,
  TArticlesListQuery,
} from './schema';
import slugify from 'slugify';
import {
  Err403ArticleForbidden,
  Err404ArticleNotFound,
  Err422ArticleExist,
} from '../../utils/exceptions/article';
import { IArticleUpdate } from '../../declarations/article';

type ArticleListApi = ApiRequest<{ Querystring: TArticlesListQuery }>;
export async function listArticles(
  this: FastifyInstance,
  request: FastifyRequest<ArticleListApi>,
  reply: FastifyReply,
) {
  const { limit, offset, tag, author, favorited } = request.query;
}

type ArticleCreateApi = ApiRequest<{ Body: TArticleCreateSchema }>;
export async function createArticle(
  this: FastifyInstance,
  request: FastifyRequest<ArticleCreateApi>,
  reply: FastifyReply,
) {
  const { article } = request.body;
  const author = await this.userService.findById(request.auth!.userId);
  if (!author) throw Err404UserNotFound;

  try {
    const newArticle = await this.articleService.create({
      ...article,
      slug: slugify(article.title, { lower: true, replacement: '-' }),
      authorId: author.id,
    });
    if (!newArticle) throw Err404ArticleNotFound;

    return {
      article: this.articleService.response(newArticle, author.id),
    };
  } catch (err: any) {
    if (err.code === '23505') {
      throw Err422ArticleExist;
    }
    throw err;
  }
}

type ArticleGetApi = ApiRequest<{ Params: { slug: string } }>;
export async function getArticle(
  this: FastifyInstance,
  request: FastifyRequest<ArticleGetApi>,
  reply: FastifyReply,
) {
  const article = await this.articleService.findBySlug(request.params.slug);
  if (!article) throw Err404ArticleNotFound;

  return {
    article: this.articleService.response(article),
  };
}

type ArticlePutApi = ApiRequest<{
  Params: { slug: string };
  Body: TArticleUpdateSchema;
}>;
export async function updateArticle(
  this: FastifyInstance,
  request: FastifyRequest<ArticlePutApi>,
  reply: FastifyReply,
) {
  const { article } = request.body;

  const loginUser = await this.userService.findById(request.auth!.userId);
  if (!loginUser) throw Err404UserNotFound;

  const targetArc = await this.articleService.findBySlug(request.params.slug);
  if (!targetArc) throw Err404ArticleNotFound;

  if (targetArc.author.id !== loginUser.id) {
    throw Err403ArticleForbidden;
  }

  const update: IArticleUpdate = {
    id: targetArc.id,
    slug: article.title
      ? slugify(article.title, { lower: true, replacement: '-' })
      : undefined,
    ...article,
  };

  try {
    const arcReturn = await this.articleService.update(update);
    if (!arcReturn) throw Err404ArticleNotFound;

    return {
      article: this.articleService.response(arcReturn, loginUser.id),
    };
  } catch (err: any) {
    if (err.code === '23505') {
      throw Err422ArticleExist;
    }
    throw err;
  }
}
