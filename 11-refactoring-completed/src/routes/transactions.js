import express from 'express';
import { transactionRepository } from '../repository/transaction.repository.js';
import { userRepository } from '../repository/user.repository.js';
import { postRepository } from '../repository/post.repository.js';
import { NotFoundException } from '../common/errors/index.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';
import { validate } from '../middlewares/validation.middleware.js';
import { validateIdParam } from '../middlewares/param-validation.middleware.js';
import { createPostWithCommentSchema } from '../validators/transaction.validator.js';

export const transactionsRouter = express.Router();

// 1. 게시글 + 첫 댓글 동시 생성
transactionsRouter.post(
  '/posts-with-comment',
  validate(createPostWithCommentSchema),
  async (req, res, next) => {
    try {
      const { authorId, title, content, commentContent } = req.body;

      // 작성자 존재 여부 확인
      const author = await userRepository.findUserById(authorId);
      if (!author) {
        throw new NotFoundException('작성자를 찾을 수 없습니다.');
      }

      const result = await transactionRepository.createPostWithComment(
        authorId,
        { title, content, published: true },
        commentContent,
      );

      res.status(HTTP_STATUS.CREATED).json({
        message: '게시글과 첫 댓글이 함께 생성되었습니다.',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },
);

// 2. 안전한 게시글 삭제 (댓글까지 함께)
transactionsRouter.delete(
  '/posts/:id',
  validateIdParam('id', '게시글'),
  async (req, res, next) => {
    try {
      // 게시글 존재 여부 확인
      const post = await postRepository.findPostById(req.params.id);
      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      const result = await transactionRepository.deletePostWithComments(
        req.params.id,
      );

      res.status(HTTP_STATUS.OK).json({
        message: '게시글과 댓글이 안전하게 삭제되었습니다.',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  },
);
