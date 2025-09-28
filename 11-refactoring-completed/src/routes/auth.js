import express from 'express';
import { userRepository } from '../repository/user.repository.js';
import { hashPassword, comparePassword } from '../utils/hash.util.js';
import {
  generateTokens,
  setAuthCookies,
  clearAuthCookies,
} from '../utils/cookie.util.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validation.middleware.js';
import { signUpSchema, loginSchema } from '../validators/auth.validator.js';
import {
  UnauthorizedException,
  BadRequestException,
} from '../common/errors/index.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';

export const authRouter = express.Router();

// 회원가입 API
authRouter.post('/signup', validate(signUpSchema), async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // 이미 존재하는 이메일인지 확인
    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('이미 사용 중인 이메일입니다.');
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.createUser({
      email,
      password: hashedPassword,
      name,
    });

    const { password: _password, ...userWithoutPassword } = user;

    res.status(HTTP_STATUS.CREATED).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

// 로그인 API
authRouter.post('/login', validate(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userRepository.findUserByEmail(email);

    if (!user) {
      throw new UnauthorizedException('인증 정보가 유효하지 않습니다.');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('인증 정보가 유효하지 않습니다.');
    }

    const tokens = generateTokens(user);

    setAuthCookies(res, tokens);

    res.status(HTTP_STATUS.OK).json({ message: '로그인 성공' });
  } catch (error) {
    next(error);
  }
});

// 로그아웃 API
authRouter.post('/logout', (req, res, next) => {
  try {
    clearAuthCookies(res);

    res.status(HTTP_STATUS.OK).json({ message: '로그아웃 성공' });
  } catch (error) {
    next(error);
  }
});

// 내 정보 조회 API
authRouter.get('/me', authMiddleware, (req, res) => {
  res.status(HTTP_STATUS.OK).json(req.user);
});
