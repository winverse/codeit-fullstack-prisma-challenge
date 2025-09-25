import express from 'express';
// TODO: routes/index.js를 생성한 후 import 해주세요
// import { router } from './routes/index.js';

const app = express();
const PORT = 3000;

// JSON 파싱 미들웨어
app.use(express.json());

// 기본 라우트 (테스트용)
app.get('/', (req, res) => {
  res.json({
    message: 'Hello Express!',
    timestamp: new Date().toISOString(),
  });
});

// TODO: API 라우터 등록
// routes/index.js를 생성하고 아래 주석을 해제해주세요
// app.use('/', router);

// 서버 시작
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

/*
 * 📋 할 일:
 * 1. routes/index.js 파일 생성
 * 2. routes/users.js 파일 생성
 * 3. repository/user.repository.js 파일 생성
 * 4. 위의 TODO 주석들을 해제하고 실제 코드로 교체
 */
