import { PrismaClient } from '@prisma/client';

// NODE_ENV 환경 변수에 따라 로그 레벨을 동적으로 설정
const getPrismaLogLevel = () => {
  if (process.env.NODE_ENV === 'production') {
    return ['warn', 'error'];
  }
  // 개발 환경이나 다른 환경에서는 모든 로그를 활성화
  return ['query', 'info', 'warn', 'error'];
};

export const prisma = new PrismaClient({
  log: getPrismaLogLevel(),
});
