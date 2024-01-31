import Exception from '..';
import { STATUS_CODE } from '../../http/status';

export const Err422ArticleExist = Exception.new(
  'Article slug are already exist',
  STATUS_CODE.UNPROCESSABLE_CONTENT,
);

export const Err404ArticleNotFound = Exception.new(
  'Article Not Found',
  STATUS_CODE.NOT_FOUND,
);

export const Err403ArticleForbidden = Exception.new(
  'No permission in this Article',
  STATUS_CODE.FORBIDDEN,
);

export const Err404CommentNotFound = Exception.new(
  'Comment Not Found',
  STATUS_CODE.NOT_FOUND,
);

export const Err403CommentForbidden = Exception.new(
  'No permission in this Comment',
  STATUS_CODE.FORBIDDEN,
);
