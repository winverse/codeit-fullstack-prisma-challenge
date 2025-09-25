import express from 'express';
import { usersRouter } from './users.js';
import { postsRouter } from './posts.js';

export const router = express.Router();

/**
 * 📋 TODO: API 라우터들을 등록해주세요!
 *
 * Express Router를 사용하여 각 엔드포인트별로 라우터를 분리하고
 * 이곳에서 모든 라우터들을 한곳에 모아 관리합니다.
 */

// 라우터 등록
router.use('/users', usersRouter);
router.use('/posts', postsRouter);

// 기본 엔드포인트 - API 상태 확인용
router.get('/', (req, res) => {
  res.json({
    message: '🎉 CRUD Challenge API가 성공적으로 실행되고 있습니다!',
    version: '1.0.0',
    endpoints: {
      users: {
        'POST /api/users': '새 사용자 생성',
        'GET /api/users': '모든 사용자 조회',
        'GET /api/users/:id': '특정 사용자 조회',
        'PUT /api/users/:id': '사용자 정보 수정',
        'DELETE /api/users/:id': '사용자 삭제',
      },
    },
    instructions: [
      '1. users.js에서 usersRouter를 import 하세요',
      "2. router.use('/users', usersRouter); 주석을 해제하세요",
      '3. user.repository.js의 함수들을 구현하세요',
      '4. users.js의 API 엔드포인트들을 구현하세요',
    ],
  });
});

/**
 * 🎯 구현 완료 후 예상 API 엔드포인트:
 *
 * GET /api/ - API 정보 조회
 * POST /api/users - 새 사용자 생성
 * GET /api/users - 모든 사용자 조회
 * GET /api/users/:id - 특정 사용자 조회
 * PUT /api/users/:id - 사용자 정보 수정
 * DELETE /api/users/:id - 사용자 삭제
 *
 * 💡 사용법:
 * 1. users.js를 먼저 완성하세요
 * 2. 위에서 TODO 주석들을 해결하세요
 * 3. server.js에서 이 router를 '/api' 경로에 등록하세요
 *
 * 🔗 다음 단계:
 * server.js에서 app.use('/api', router)로 등록하고 서버를 시작하세요!
 */
