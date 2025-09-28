import express from 'express';
import { postRepository } from '../repository/post.repository.js';
import { NotFoundException } from '../common/errors/index.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';
import { validate } from '../middlewares/validation.middleware.js';
import { validateIdParam } from '../middlewares/param-validation.middleware.js';
import {
  createPostSchema,
  updatePostSchema,
} from '../validators/post.validator.js';

export const postsRouter = express.Router();

// 모든 게시글 조회 (필터링, 정렬, 페이지네이션)
postsRouter.get('/', async (req, res, next) => {
  try {
    const { sort = 'createdAt', order = 'desc' } = req.query;
    const orderBy = { [sort]: order };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const take = limit;

    const { search } = req.query;
    const where = {};
    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    const [posts, total] = await Promise.all([
      postRepository.findAllPosts({ where, orderBy, skip, take }),
      postRepository.countPosts(where),
    ]);

    res.status(HTTP_STATUS.OK).json({
      data: posts,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    next(error);
  }
});

// 특정 게시글 조회
postsRouter.get(
  '/:id',
  validateIdParam('id', '게시글'),
  async (req, res, next) => {
    try {
      const post = await postRepository.findPostById(req.params.id);
      if (!post) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }
      res.status(HTTP_STATUS.OK).json(post);
    } catch (error) {
      next(error);
    }
  },
);

// 게시글 생성
// 새 게시글 작성
postsRouter.post('/', validate(createPostSchema), async (req, res, next) => {
  try {
    const newPost = await postRepository.createPost(req.body);
    res.status(HTTP_STATUS.CREATED).json(newPost);
  } catch (error) {
    next(error);
  }
});

// 게시글 수정
postsRouter.put(
  '/:id',
  validateIdParam('id', '게시글'),
  validate(updatePostSchema),
  async (req, res, next) => {
    try {
      // 게시글 존재 여부 확인
      const existingPost = await postRepository.findPostById(req.params.id);
      if (!existingPost) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      const updatedPost = await postRepository.updatePost(
        req.params.id,
        req.body,
      );
      res.status(HTTP_STATUS.OK).json(updatedPost);
    } catch (error) {
      next(error);
    }
  },
);

// 게시글 삭제
postsRouter.delete(
  '/:id',
  validateIdParam('id', '게시글'),
  async (req, res, next) => {
    try {
      // 게시글 존재 여부 확인
      const existingPost = await postRepository.findPostById(req.params.id);
      if (!existingPost) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      await postRepository.deletePost(req.params.id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
);
