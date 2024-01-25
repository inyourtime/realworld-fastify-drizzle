import { relations } from 'drizzle-orm';
import { uuid, pgTable, varchar, text, uniqueIndex } from 'drizzle-orm/pg-core';
import { articles, articleUserFavourites, comments } from '.';
import { baseTimestamp } from '..';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom().notNull(),
  email: varchar('email', { length: 256 }).unique().notNull(),
  username: varchar('username', { length: 256 }).unique().notNull(),
  password: varchar('password', { length: 256 }).notNull(),
  bio: text('bio'),
  image: varchar('image', { length: 256 }),
  ...baseTimestamp,
});

export const usersRelation = relations(users, ({ many }) => ({
  followers: many(userFollower, { relationName: 'followers' }),
  following: many(userFollower, { relationName: 'following' }),
  articles: many(articles, { relationName: 'articles' }),
  favouritedArticles: many(articleUserFavourites, {
    relationName: 'favourited_articles',
  }),
  comments: many(comments, { relationName: 'comments' }),
}));

export const userFollower = pgTable(
  'users_followers',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    followingId: uuid('following_id')
      .notNull()
      .references(() => users.id),
  },
  (t) => ({
    uniqueIdx: uniqueIndex('users_followers_idx').on(t.userId, t.followingId),
  }),
);

export const userFollowerRelation = relations(userFollower, ({ one }) => ({
  user: one(users, {
    fields: [userFollower.userId],
    references: [users.id],
    relationName: 'following',
  }),
  following: one(users, {
    fields: [userFollower.followingId],
    references: [users.id],
    relationName: 'followers',
  }),
}));
