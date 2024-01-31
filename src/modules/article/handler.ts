import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ApiRequest } from '../../declarations/api';
import { Err404UserNotFound } from '../../utils/exceptions/user';
import {
  TArticleCreateSchema,
  TArticleUpdateSchema,
  TArticlesListQuery,
} from './schema';
import {
  Err403ArticleForbidden,
  Err404ArticleNotFound,
  Err422ArticleExist,
} from '../../utils/exceptions/article';
import { IArticleQuery, IArticleUpdate } from '../../declarations/article';

type ArticleListApi = ApiRequest<{ Querystring: TArticlesListQuery }>;
export async function listArticles(
  this: FastifyInstance,
  request: FastifyRequest<ArticleListApi>,
  reply: FastifyReply,
) {
  const { limit, page, tag, author, favorited } = request.query;

  let query: IArticleQuery = {
    limit: Number(limit) || 20,
    page: Number(page) || 1,
    tag,
  };

  if (author) {
    const selectedAuthor = await this.profileService.get(author);
    if (selectedAuthor) query.authorId = selectedAuthor.id;
  }
  if (favorited) {
    const favoriter = await this.profileService.get(favorited);
    if (favoriter) query.userId = favoriter.id;
  }

  const [result, count] = await this.articleService.listAndCount(query);
  const mapResult = result.map((ele) =>
    this.articleService.response(ele, request.auth?.userId),
  );

  return this.paginator(mapResult, count, query.limit, query.page);
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
      slug: this.slug(article.title),
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
    slug: article.title ? this.slug(article.title) : undefined,
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

type ArticleDeleteApi = ApiRequest<{ Params: { slug: string } }>;
export async function deleteArticle(
  this: FastifyInstance,
  request: FastifyRequest<ArticleDeleteApi>,
  reply: FastifyReply,
) {
  const loginUser = await this.userService.findById(request.auth!.userId);
  if (!loginUser) throw Err404UserNotFound;

  const targetArc = await this.articleService.findBySlug(request.params.slug);
  if (!targetArc) throw Err404ArticleNotFound;

  if (targetArc.author.id !== loginUser.id) {
    throw Err403ArticleForbidden;
  }

  await this.articleService.delete(targetArc.id);

  return {
    message: 'Article successfully deleted!!!',
  };
}

type ArticleFavoriteApi = ApiRequest<{ Params: { slug: string } }>;
export async function favoriteArticle(
  this: FastifyInstance,
  request: FastifyRequest<ArticleFavoriteApi>,
  reply: FastifyReply,
) {
  const loginUser = await this.userService.findById(request.auth!.userId);
  if (!loginUser) throw Err404UserNotFound;

  const targetArc = await this.articleService.findBySlug(request.params.slug);
  if (!targetArc) throw Err404ArticleNotFound;

  let response = {
    article: this.articleService.response(targetArc, loginUser.id),
  };

  try {
    await this.articleService.favorite(targetArc.id, loginUser.id);
    response.article.favorited = true;
    response.article.favoritesCount += 1;
    return response;
  } catch (err: any) {
    if (err.code === '23505') {
      return response;
    }
    throw err;
  }
}

type ArticleUnFavoriteApi = ApiRequest<{ Params: { slug: string } }>;
export async function unFavoriteArticle(
  this: FastifyInstance,
  request: FastifyRequest<ArticleUnFavoriteApi>,
  reply: FastifyReply,
) {
  const loginUser = await this.userService.findById(request.auth!.userId);
  if (!loginUser) throw Err404UserNotFound;

  const targetArc = await this.articleService.findBySlug(request.params.slug);
  if (!targetArc) throw Err404ArticleNotFound;

  let response = {
    article: this.articleService.response(targetArc, loginUser.id),
  };

  const result = await this.articleService.unFavorite(
    targetArc.id,
    loginUser.id,
  );
  if (result.rowCount && result.rowCount > 0) {
    response.article.favorited = false;
    response.article.favoritesCount -= 1;
    return response;
  }

  return response;
}
