import { verifyToken } from '../utils/jwt.util.js';
import { PrismaClient } from '@prisma/client';
import { UnauthorizedException } from '../common/errors/index.js';

const prisma = new PrismaClient();

export const authMiddleware = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (!accessToken) {
      throw new UnauthorizedException('인증 정보가 없습니다.');
    }

    const payload = verifyToken(accessToken, 'access');
    if (!payload) {
      throw new UnauthorizedException('인증 정보가 유효하지 않습니다.');
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new UnauthorizedException(
        '인증 정보와 일치하는 사용자가 없습니다.',
      );
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
