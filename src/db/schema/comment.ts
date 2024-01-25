import { relations } from 'drizzle-orm';
import { uuid, pgTable, text } from 'drizzle-orm/pg-core';
import { articles, users } from '.';
import { baseTimestamp } from '..';

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  body: text('body').notNull(),
  authorId: uuid('author_id').notNull(),
  articleId: uuid('article_id').notNull(),
  ...baseTimestamp,
});

export const commentsRelation = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
    relationName: 'comments',
  }),
  article: one(articles, {
    fields: [comments.articleId],
    references: [articles.id],
    relationName: 'article_comments',
  }),
}));
