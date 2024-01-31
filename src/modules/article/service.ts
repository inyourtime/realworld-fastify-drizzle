import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import {
  IArticleFeedQuery,
  IArticleFilter,
  IArticleQuery,
  IArticleResponse,
  IArticleUpdate,
  IArticleWithAuthor,
  TCreateArticle,
  TFavouritedUser,
} from '../../declarations/article';
import { db } from '../../db';
import { articleUserFavourites, articles } from '../../db/schema';
import { SQL, and, arrayContains, count, desc, eq, inArray } from 'drizzle-orm';
import { ProfileService } from '../profile/service';

export class ArticleService {
  constructor() {}

  async listAndCount({ limit, page, ...filter }: IArticleQuery) {
    const qb = and(...(await this.qbList(filter)));
    const list = db.query.articles.findMany({
      where: qb,
      orderBy: [desc(articles.createdAt)],
      limit,
      offset: (page - 1) * limit,
      with: {
        favouritedUsers: true,
        author: {
          with: {
            followers: true,
          },
        },
      },
    });

    return Promise.all([list, this.count(qb)]);
  }

  async feed({ limit, page, following }: IArticleFeedQuery) {
    if (following.length < 1) {
      return Promise.all([Promise.resolve([]), Promise.resolve(0)]);
    }
    const query = inArray(articles.authorId, following);
    const list = db.query.articles.findMany({
      where: query,
      orderBy: [desc(articles.createdAt)],
      limit,
      offset: (page - 1) * limit,
      with: {
        favouritedUsers: true,
        author: {
          with: {
            followers: true,
          },
        },
      },
    });

    return Promise.all([list, this.count(query)]);
  }

  private async count(qb: SQL<unknown> | undefined): Promise<number> {
    return db
      .select({ value: count() })
      .from(articles)
      .where(qb)
      .then((result) => result[0].value);
  }

  private async qbList({ tag, authorId, userId }: IArticleFilter) {
    const qb: SQL<unknown>[] = [];
    if (tag) {
      qb.push(arrayContains(articles.tagList, [tag]));
    }
    if (authorId) {
      qb.push(eq(articles.authorId, authorId));
    }
    if (userId) {
      const arcIdArr = (
        await db
          .select({ articleId: articleUserFavourites.articleId })
          .from(articleUserFavourites)
          .where(eq(articleUserFavourites.userId, userId))
      ).reduce((acc: string[], curr) => acc.concat(curr.articleId), []);
      if (arcIdArr.length > 0) qb.push(inArray(articles.id, arcIdArr));
    }
    return qb;
  }

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
