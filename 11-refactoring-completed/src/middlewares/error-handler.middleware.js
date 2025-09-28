import { Prisma } from '@prisma/client';
import { HttpException } from '../common/errors/httpException.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';

export const errorHandler = (err, req, res, _next) => {
  console.error(err.stack);

  // HttpException인 경우
  if (err instanceof HttpException) {
    return res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
  }

  // Zod 검증 에러인 경우
  if (err.name === 'ZodError') {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      error: '입력 데이터 검증 실패',
      details: err.errors,
    });
  }

  // Prisma의 특정 에러 코드 처리
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0];
      return res
        .status(HTTP_STATUS.CONFLICT)
        .json({ message: `${field}가 이미 사용 중입니다.` });
    }

    // 코드 참고, https://www.prisma.io/docs/orm/reference/error-reference
  }

  // 처리되지 않은 모든 에러
  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ message: '서버 내부 오류가 발생했습니다.' });
};
