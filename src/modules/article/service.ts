import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import {
  IArticleResponse,
  IArticleUpdate,
  IArticleWithAuthor,
  TCreateArticle,
} from '../../declarations/article';
import { db } from '../../db';
import { articles } from '../../db/schema';
import { eq } from 'drizzle-orm';
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

  async update(data: IArticleUpdate) {
    return db
      .update(articles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(articles.id, data.id))
      .then(() => this.get(data.id));
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
      favorited: false,
      favoritesCount: 0,
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
