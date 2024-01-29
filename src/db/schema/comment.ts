import { relations } from 'drizzle-orm';
import { uuid, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { articles, users } from '.';

export const comments = pgTable('comments', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  body: text('body').notNull(),
  authorId: uuid('author_id').notNull(),
  articleId: uuid('article_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
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
