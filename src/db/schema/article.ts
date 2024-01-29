import { relations } from 'drizzle-orm';
import {
  uuid,
  pgTable,
  varchar,
  text,
  uniqueIndex,
  timestamp,
} from 'drizzle-orm/pg-core';
import { comments, users } from '.';

export const articles = pgTable('articles', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  slug: varchar('slug', { length: 256 }).unique().notNull(),
  title: varchar('title', { length: 256 }).notNull(),
  description: text('description').notNull(),
  body: text('body').notNull(),
  tagList: varchar('tag_list', { length: 256 }).array(),
  authorId: uuid('author_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const articlesRelation = relations(articles, ({ one, many }) => ({
  author: one(users, {
    fields: [articles.authorId],
    references: [users.id],
    relationName: 'articles',
  }),
  favouritedUsers: many(articleUserFavourites, {
    relationName: 'favourited_users',
  }),
  comments: many(comments, { relationName: 'article_comments' }),
}));

export const articleUserFavourites = pgTable(
  'articles_users_favourites',
  {
    articleId: uuid('article_id')
      .notNull()
      .references(() => articles.id),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
  },
  (t) => ({
    uniqueIdx: uniqueIndex('article_user_favourite_idx').on(
      t.articleId,
      t.userId,
    ),
  }),
);

export const articleUserFavouritesRelation = relations(
  articleUserFavourites,
  ({ one }) => ({
    article: one(articles, {
      fields: [articleUserFavourites.articleId],
      references: [articles.id],
      relationName: 'favourited_users',
    }),
    user: one(users, {
      fields: [articleUserFavourites.userId],
      references: [users.id],
      relationName: 'favourited_articles',
    }),
  }),
);
