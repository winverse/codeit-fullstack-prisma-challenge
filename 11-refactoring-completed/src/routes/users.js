import express from 'express';
import { userRepository } from '../repository/user.repository.js';
import { NotFoundException } from '../common/errors/index.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';
import { validateIdParam } from '../middlewares/param-validation.middleware.js';

export const usersRouter = express.Router();

// 모든 사용자 조회
usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await userRepository.findAllUsers();
    res.status(HTTP_STATUS.OK).json(users);
  } catch (error) {
    next(error);
  }
});

// 특정 사용자 조회
usersRouter.get(
  '/:id',
  validateIdParam('id', '사용자'),
  async (req, res, next) => {
    try {
      const user = await userRepository.findUserById(req.params.id);
      if (!user) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }
      res.status(HTTP_STATUS.OK).json(user);
    } catch (error) {
      next(error);
    }
  },
);

// 새 사용자 생성
usersRouter.post('/', async (req, res, next) => {
  try {
    const newUser = await userRepository.createUser(req.body);
    res.status(HTTP_STATUS.CREATED).json(newUser);
  } catch (error) {
    next(error);
  }
});

// 사용자 정보 수정
// 사용자 정보 업데이트
usersRouter.put(
  '/:id',
  validateIdParam('id', '사용자'),
  async (req, res, next) => {
    try {
      // 사용자 존재 여부 확인
      const existingUser = await userRepository.findUserById(req.params.id);
      if (!existingUser) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      const updatedUser = await userRepository.updateUser(
        req.params.id,
        req.body,
      );
      res.status(HTTP_STATUS.OK).json(updatedUser);
    } catch (error) {
      next(error);
    }
  },
);

// 사용자 삭제
usersRouter.delete(
  '/:id',
  validateIdParam('id', '사용자'),
  async (req, res, next) => {
    try {
      // 사용자 존재 여부 확인
      const existingUser = await userRepository.findUserById(req.params.id);
      if (!existingUser) {
        throw new NotFoundException('사용자를 찾을 수 없습니다.');
      }

      await userRepository.deleteUser(req.params.id);
      res.status(HTTP_STATUS.NO_CONTENT).send();
    } catch (error) {
      next(error);
    }
  },
);

// 사용자 생성과 동시에 게시글 생성 (트랜잭션)
usersRouter.post('/with-post', async (req, res, next) => {
  try {
    const { user, post } = req.body;
    const result = await userRepository.createUserAndPost(user, post);
    res.status(HTTP_STATUS.CREATED).json(result);
  } catch (error) {
    next(error);
  }
});
