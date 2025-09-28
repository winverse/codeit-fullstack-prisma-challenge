import { BadRequestException } from '../common/errors/index.js';

/**
 * URL 파라미터가 유효한 양의 정수인지 검증하는 미들웨어
 * @param {string} paramName - 검증할 파라미터 이름 (예: 'id', 'postId', 'userId')
 * @param {string} resourceName - 리소스 이름 (에러 메시지용, 예: '게시글', '사용자', '댓글')
 */
export const validateIdParam = (paramName, resourceName = 'ID') => {
  return (req, res, next) => {
    const paramValue = parseInt(req.params[paramName]);

    if (isNaN(paramValue) || paramValue <= 0) {
      throw new BadRequestException(
        `올바른 ${resourceName} ID를 입력해주세요.`,
      );
    }

    // 검증된 숫자값을 req.params에 다시 할당
    req.params[paramName] = paramValue;

    next();
  };
};
