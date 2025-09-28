import express from 'express';
import { commentRepository } from '../repository/comment.repository.js';
import { postRepository } from '../repository/post.repository.js';
import {
  BadRequestException,
  NotFoundException,
} from '../common/errors/index.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';
import { validate } from '../middlewares/validation.middleware.js';
import { validateIdParam } from '../middlewares/param-validation.middleware.js';
import {
  createCommentSchema,
  updateCommentSchema,
} from '../validators/comment.validator.js';

export const commentsRouter = express.Router();

// POST /comments - 새 댓글 생성
commentsRouter.post(
  '/',
  validate(createCommentSchema),
  async (req, res, next) => {
    try {
      // 게시글 존재 여부 확인
      const post = await postRepository.findPostById(req.body.postId);
      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      const newComment = await commentRepository.createComment(req.body);
      res.status(HTTP_STATUS.CREATED).json(newComment);
    } catch (error) {
      next(error);
    }
  },
);

// GET /comments/search?q=검색어 - 댓글 검색
commentsRouter.get('/search', async (req, res, next) => {
  try {
    const { q: keyword } = req.query;
    if (!keyword) {
      throw new BadRequestException('검색어를 입력해주세요.');
    }

    const comments = await commentRepository.searchComments(keyword);

    res.status(HTTP_STATUS.OK).json(comments);
  } catch (error) {
    next(error);
  }
});

// GET /comments - 모든 댓글 조회 (페이지네이션 적용)
commentsRouter.get('/', async (req, res, next) => {
  try {
    const { page, limit } = req.query;

    if (page || limit) {
      const result = await commentRepository.getCommentsWithPagination(
        parseInt(page) || 1,
        parseInt(limit) || 10,
      );
      return res.status(HTTP_STATUS.OK).json(result);
    }

    const comments = await commentRepository.findAllComments();
    return res.status(HTTP_STATUS.OK).json(comments);
  } catch (error) {
    next(error);
  }
});

// GET /comments/post/:postId/details - 특정 게시글의 상세 댓글 정보
commentsRouter.get(
  '/post/:postId/details',
  validateIdParam('postId', '게시글'),
  async (req, res, next) => {
    try {
      const comments = await commentRepository.getCommentsWithDetails(
        req.params.postId,
      );

      res.status(HTTP_STATUS.OK).json(comments);
    } catch (error) {
      next(error);
    }
  },
);

// GET /comments/post/:postId - 특정 게시글의 댓글 목록 조회
commentsRouter.get(
  '/post/:postId',
  validateIdParam('postId', '게시글'),
  async (req, res, next) => {
    try {
      // 게시글 존재 여부 확인
      const post = await postRepository.findPostById(req.params.postId);
      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      const comments = await commentRepository.findCommentsByPostId(
        req.params.postId,
      );
      res.status(HTTP_STATUS.OK).json(comments);
    } catch (error) {
      next(error);
    }
  },
);

// GET /comments/:id - 특정 댓글 조회
commentsRouter.get(
  '/:id',
  validateIdParam('id', '댓글'),
  async (req, res, next) => {
    try {
      const comment = await commentRepository.findCommentById(req.params.id);

      if (!comment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      res.status(HTTP_STATUS.OK).json(comment);
    } catch (error) {
      next(error);
    }
  },
);

// PUT /comments/:id - 댓글 수정
commentsRouter.put(
  '/:id',
  validateIdParam('id', '댓글'),
  validate(updateCommentSchema),
  async (req, res, next) => {
    try {
      // 댓글 존재 여부 확인
      const existingComment = await commentRepository.findCommentById(
        req.params.id,
      );
      if (!existingComment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      const updatedComment = await commentRepository.updateComment(
        req.params.id,
        req.body,
      );
      res.status(HTTP_STATUS.OK).json(updatedComment);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /comments/:id - 댓글 삭제
commentsRouter.delete(
  '/:id',
  validateIdParam('id', '댓글'),
  async (req, res, next) => {
    try {
      // 댓글 존재 여부 확인
      const existingComment = await commentRepository.findCommentById(
        req.params.id,
      );
      if (!existingComment) {
        throw new NotFoundException('댓글을 찾을 수 없습니다.');
      }

      await commentRepository.deleteComment(req.params.id);

      res
        .status(HTTP_STATUS.OK)
        .json({ message: '댓글이 성공적으로 삭제되었습니다.' });
    } catch (error) {
      next(error);
    }
  },
);
