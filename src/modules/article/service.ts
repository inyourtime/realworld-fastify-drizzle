import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import {
  IArticleResponse,
  IArticleUpdate,
  IArticleWithAuthor,
  TCreateArticle,
  TFavouritedUser,
} from '../../declarations/article';
import { db } from '../../db';
import { articleUserFavourites, articles } from '../../db/schema';
import { and, eq } from 'drizzle-orm';
import { ProfileService } from '../profile/service';

export class ArticleService {
  constructor() {}

  async create(data: TCreateArticle): Promise<IArticleWithAuthor | undefined> {
    return db
      .insert(articles)
      .values({ ...data })
      .returning({
        id: articles.id,
      })
      .then(([article]) => this.get(article.id));
  }

  async get(id: string): Promise<IArticleWithAuthor | undefined> {
    return db.query.articles.findFirst({
      where: eq(articles.id, id),
      with: {
        favouritedUsers: true,
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

  async findBySlug(slug: string): Promise<IArticleWithAuthor | undefined> {
    return db.query.articles.findFirst({
      where: eq(articles.slug, slug),
      with: {
        favouritedUsers: true,
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

  async update(data: IArticleUpdate): Promise<IArticleWithAuthor | undefined> {
    return db
      .update(articles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(articles.id, data.id))
      .then(() => this.get(data.id));
  }

  async delete(id: string): Promise<void> {
    await db.delete(articles).where(eq(articles.id, id));
  }

  async favorite(articleId: string, userId: string): Promise<void> {
    await db.insert(articleUserFavourites).values({ articleId, userId });
  }

  async unFavorite(articleId: string, userId: string) {
    return db
      .delete(articleUserFavourites)
      .where(
        and(
          eq(articleUserFavourites.articleId, articleId),
          eq(articleUserFavourites.userId, userId),
        ),
      );
  }

  isFavorite(favorites: TFavouritedUser[], userId: string): boolean {
    return favorites.filter((ele) => ele.userId === userId).length === 0
      ? false
      : true;
  }

  response(article: IArticleWithAuthor, userId?: string): IArticleResponse {
    return {
      slug: article.slug,
      title: article.title,
      description: article.description,
      body: article.body,
      tagList: article.tagList,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      favorited: userId
        ? this.isFavorite(article.favouritedUsers, userId)
        : false,
      favoritesCount: article.favouritedUsers.length,
      author: new ProfileService().response(article.author, userId),
    };
  }
}

async function articleService(fastify: FastifyInstance) {
  fastify.decorate('articleService', new ArticleService());
}

export default fp(articleService);

declare module 'fastify' {
  export interface FastifyInstance {
    articleService: ArticleService;
  }
}
