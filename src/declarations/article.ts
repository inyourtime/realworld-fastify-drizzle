import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { articles } from '../db/schema';

export type TCreateArticle = InferInsertModel<typeof articles>;
export type TSelectArticle = InferSelectModel<typeof articles>;
