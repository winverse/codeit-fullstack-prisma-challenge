# 11. 실습: 코드 구조 개선을 위한 리팩토링 챌린지

지금까지 우리는 기능 구현에 집중해왔습니다. 이번 챌린지에서는 작성된 코드를 더 **읽기 쉽고, 유지보수하기 좋으며, 안정적으로** 만들기 위한 구조 개선 리팩토링을 직접 수행합니다. '매직 넘버'를 제거하고, 커스텀 에러 클래스를 도입하며, 설정(Config)을 안전하게 관리하는 방법을 학습합니다.

## 🎯 학습 목표

- `HttpException`을 상속하는 **커스텀 에러 클래스**를 만들어 에러를 체계적으로 관리할 수 있다.
- `common/constants` 폴더를 활용하여 코드에 하드코딩된 **매직 넘버(Magic Number)**를 제거할 수 있다.
- `zod`를 사용하여 프로젝트 시작 시점에 **환경 변수를 검증**하는 안정적인 설정 로직을 구현할 수 있다.
- **파라미터 검증 미들웨어**를 만들어 URL 파라미터 검증 로직을 재사용할 수 있다.

- 전반적인 코드 구조를 개선하여 **가독성과 유지보수성**을 높일 수 있다.

---

## ♻️ 리팩토링 목표

- **Repository 패턴 활용**: 이미 구현되어 있는 Repository 패턴을 기반으로 하여, 데이터 액세스 로직과 비즈니스 로직을 분리하고 테스트하기 쉬운 구조를 유지합니다.
- **에러 처리 개선**: `res.status(404).json(...)`과 같은 직접적인 응답 대신, `throw new NotFoundException()`처럼 의미 있는 에러를 발생시켜 에러 핸들러가 일관되게 처리하도록 변경합니다.
- **매직 넘버 제거**: `404`, `15 * 60 * 1000` 등 코드에 직접 쓰인 숫자들을 의미 있는 이름의 상수로 대체하여 가독성을 높입니다.
- **파라미터 검증 미들웨어**: URL 파라미터의 유효성을 검사하는 재사용 가능한 미들웨어를 도입하여 중복 코드를 제거합니다.
- **안전한 설정 관리**: 프로젝트 실행에 필수적인 환경 변수들이 누락되거나 형식이 잘못되었을 경우, 서버가 시작되기 전에 문제를 파악하고 프로세스를 종료시켜 잠재적인 런타임 에러를 방지합니다.

---

## 📋 TODO 체크리스트

### 0단계: 환경 설정

- [ ] **npm install**: 의존성 패키지들이 설치되어 있는지 확인하세요.

### 1단계: `common` 폴더 구조 생성 및 정리

- [ ] `src/common` 폴더를 생성하세요.
- [ ] `src/common/errors` 폴더를 생성하세요.
- [ ] `src/common/constants` 폴더를 생성하세요.

### 2단계: 커스텀 에러 클래스 도입

- [ ] **기본 에러 클래스 구현**
  - [ ] `src/common/errors/httpException.js` 파일을 만들고, 모든 커스텀 에러의 기반이 될 `HttpException` 클래스를 작성하세요.
  
- [ ] **구체적인 에러 클래스들 구현**
  - [ ] `src/common/errors/bad-request.exception.js` - `BadRequestException` 클래스 (400 에러)
  - [ ] `src/common/errors/unauthorized.exception.js` - `UnauthorizedException` 클래스 (401 에러)  
  - [ ] `src/common/errors/forbidden.exception.js` - `ForbiddenException` 클래스 (403 에러)
  - [ ] `src/common/errors/not-found.exception.js` - `NotFoundException` 클래스 (404 에러)
  - [ ] `src/common/errors/index.js` - 모든 에러 클래스를 한 번에 export하는 인덱스 파일

- [ ] **에러 핸들러 미들웨어 수정**
  - [ ] `src/middlewares/error-handler.middleware.js`를 수정하여, `err`가 `HttpException`의 인스턴스일 경우 `err.statusCode`와 `err.message`를 사용해 응답하도록 로직을 개선하세요.

- [ ] **라우터 코드 리팩토링**
  - [ ] 기존 라우터들에서 `res.status(...).json(...)`으로 에러를 직접 처리하던 부분을 `throw new NotFoundException('사용자를 찾을 수 없습니다.')` 와 같은 형태로 변경하세요.

### 3단계: 매직 넘버 제거 (Constants 활용)

- [ ] **HTTP 상태 코드 상수화**
  - [ ] `src/common/constants/http-status.js` 파일을 생성하고, `HTTP_STATUS.OK`, `HTTP_STATUS.CREATED`, `HTTP_STATUS.BAD_REQUEST` 등 자주 사용하는 상태 코드를 상수로 정의하세요.
  - [ ] `error-handler.middleware.js`와 각 라우터에서 숫자 상태 코드 대신 위에서 정의한 상수를 사용하도록 수정하세요.

- [ ] **시간 관련 상수화**
  - [ ] `src/common/constants/time.js` 파일을 생성하고, `ONE_MINUTE_IN_MS`, `FIFTEEN_MINUTES_IN_MS`, `ONE_DAY_IN_MS`, `SEVEN_DAYS_IN_MS` 등 시간 관련 값들을 밀리초 단위의 상수로 정의하세요.
  - [ ] `src/utils/cookie.util.js`와 `src/utils/jwt.util.js`에서 쿠키 및 토큰 만료 시간을 설정할 때, `15 * 60 * 1000`과 같은 매직 넘버 대신 정의한 시간 상수를 사용하도록 수정하세요.

### 4단계: 파라미터 검증 미들웨어 도입

- [ ] **ID 파라미터 검증 미들웨어 생성**
  - [ ] `src/middlewares/param-validation.middleware.js` 파일을 만들고, URL 파라미터가 유효한 양의 정수인지 검증하는 `validateIdParam` 미들웨어를 작성하세요.
  - [ ] 이 미들웨어는 파라미터명과 리소스명을 받아서 재사용 가능하도록 구현하세요.

- [ ] **모든 라우터에 ID 검증 적용**
  - [ ] `posts.js`, `users.js`, `comments.js`, `transactions.js`의 `/:id` 파라미터를 사용하는 모든 라우트에 `validateIdParam` 미들웨어를 적용하세요.
  - [ ] 기존의 `parseInt(req.params.id)` 및 `isNaN` 검증 로직을 제거하고 미들웨어로 대체하세요.

### 5단계: 스키마 검증 강화

- [ ] **트랜잭션 요청 본문 검증**
  - [ ] `src/validators/transaction.validator.js` 파일을 생성하고, `createPostWithCommentSchema` 스키마를 정의하세요.
  - [ ] `transactions.js`의 POST 라우트에 `validate(createPostWithCommentSchema)` 미들웨어를 적용하세요.

### 6단계: 환경 변수 검증 (Config)

- [ ] **config 폴더 및 검증 로직 생성**
  - [ ] `src/config` 폴더를 생성하세요.
  - [ ] `src/config/config.js` 파일을 만들고, `zod`를 사용하여 프로젝트에 필요한 환경 변수들(`DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `PORT`, `NODE_ENV` 등)의 유효성을 검사하는 스키마를 정의하세요.

- [ ] **에러 처리 및 설정 객체 export**
  - [ ] 환경 변수 검증에 실패할 경우, 어떤 값이 누락되었는지 로그를 출력하고 `process.exit(1)`을 호출하여 서버 시작을 중단시키는 로직을 구현하세요.
  - [ ] 검증을 통과한 환경 변수들을 `config` 객체로 export하여, `server.js`나 `jwt.util.js` 등 다른 파일에서 `process.env` 대신 이 설정 객체를 사용하도록 변경하세요.

### 7단계: 테스트 및 검증

- [ ] **환경 변수 검증 테스트**
  - [ ] `.env` 파일에서 `JWT_SECRET`을 지우고 서버를 실행했을 때, 설정 검증 단계에서 에러 로그를 출력하며 비정상 종료되나요?

- [ ] **커스텀 에러 테스트**
  - [ ] 존재하지 않는 사용자를 조회하는 API를 요청했을 때, `NotFoundException`이 발생하고 중앙 에러 핸들러가 이를 처리하여 `404` 상태 코드와 메시지를 응답하나요?

- [ ] **매직 넘버 제거 확인**
  - [ ] `cookie.util.js`나 `jwt.util.js` 파일에 `60 * 1000`과 같이 하드코딩된 시간 관련 숫자가 모두 사라지고, `time.js`의 상수로 대체되었나요?
  - [ ] `error-handler.middleware.js`에 `400`, `401`, `404` 같은 숫자 상태 코드가 사라지고, `http-status.js`의 상수로 대체되었나요?

---

## 💡 구현 가이드 (힌트)

### 1단계: `common` 폴더 구조 생성

```bash
# 폴더 구조 생성
mkdir -p src/common/errors
mkdir -p src/common/constants
```

### 2단계: 커스텀 에러 클래스 도입

#### 기본 HttpException 클래스
```javascript
// src/common/errors/httpException.js
export class HttpException extends Error {
  statusCode;
  constructor(description, statusCode) {
    super(description);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}
```

#### 구체적인 에러 클래스들
```javascript
// src/common/errors/bad-request.exception.js
import { HttpException } from './httpException.js';

export class BadRequestException extends HttpException {
  constructor(message = '잘못된 요청입니다.') {
    super(message, 400);
  }
}

// src/common/errors/unauthorized.exception.js
import { HttpException } from './httpException.js';

export class UnauthorizedException extends HttpException {
  constructor(message = '인증이 필요합니다.') {
    super(message, 401);
  }
}

// src/common/errors/forbidden.exception.js
import { HttpException } from './httpException.js';

export class ForbiddenException extends HttpException {
  constructor(message = '접근 권한이 없습니다.') {
    super(message, 403);
  }
}

// src/common/errors/not-found.exception.js
import { HttpException } from './httpException.js';

export class NotFoundException extends HttpException {
  constructor(message = '요청한 리소스를 찾을 수 없습니다.') {
    super(message, 404);
  }
}

// src/common/errors/index.js
export * from './bad-request.exception.js';
export * from './forbidden.exception.js';
export * from './httpException.js';
export * from './not-found.exception.js';
export * from './unauthorized.exception.js';
```

#### 에러 핸들러 미들웨어 수정
```javascript
// src/middlewares/error-handler.middleware.js 수정 부분
import { Prisma } from '@prisma/client';
import { HttpException } from '../common/errors/index.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';

export const errorHandler = (err, req, res, next) => {
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
  }

  // 처리되지 않은 모든 에러
  res
    .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
    .json({ message: '서버 내부 오류가 발생했습니다.' });
};
```

#### 라우터에서 커스텀 에러 사용
```javascript
// 리팩토링 전
if (!user) {
  return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
}

// 리팩토링 후
import { NotFoundException } from '../common/errors/index.js';

if (!user) {
  throw new NotFoundException('사용자를 찾을 수 없습니다.');
}
```

### 3단계: 매직 넘버 제거 (Constants 활용)

#### HTTP 상태 코드 상수화
```javascript
// src/common/constants/http-status.js
export const HTTP_STATUS = {
  // 성공 응답
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  
  // 클라이언트 에러
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  
  // 서버 에러
  INTERNAL_SERVER_ERROR: 500,
};
```

#### 시간 관련 상수화
```javascript
// src/common/constants/time.js
export const ONE_MINUTE_IN_MS = 60 * 1000;
export const FIFTEEN_MINUTES_IN_MS = 15 * ONE_MINUTE_IN_MS;
export const ONE_HOUR_IN_MS = 60 * ONE_MINUTE_IN_MS;
export const ONE_DAY_IN_MS = 24 * ONE_HOUR_IN_MS;
export const SEVEN_DAYS_IN_MS = 7 * ONE_DAY_IN_MS;
```

#### 상수 적용 예시
```javascript
// 리팩토링 전 - cookie.util.js
const FIFTEEN_MINUTES = 15 * 60 * 1000; // 매직 넘버
const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000; // 매직 넘버

// 리팩토링 후
import { config } from '../config/config.js';
import { FIFTEEN_MINUTES_IN_MS, SEVEN_DAYS_IN_MS } from '../common/constants/time.js';

export const setAuthCookies = (res, tokens) => {
  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: FIFTEEN_MINUTES_IN_MS, // 의미가 명확함
  });

  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: SEVEN_DAYS_IN_MS, // 의미가 명확함
  });
};
```

### 4단계: 파라미터 검증 미들웨어 도입

#### 파라미터 검증 미들웨어 생성
```javascript
// src/middlewares/param-validation.middleware.js
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
      throw new BadRequestException(`올바른 ${resourceName} ID를 입력해주세요.`);
    }
    
    // 검증된 숫자값을 req.params에 다시 할당
    req.params[paramName] = paramValue;
    
    next();
  };
};
```

#### 라우터에 미들웨어 적용
```javascript
// 리팩토링 전
router.get('/:id', async (req, res, next) => {
  try {
    const postId = parseInt(req.params.id);
    if (isNaN(postId) || postId <= 0) {
      throw new BadRequestException('올바른 게시글 ID를 입력해주세요.');
    }
    // ... 나머지 로직
  }
});

// 리팩토링 후
import { validateIdParam } from '../middlewares/param-validation.middleware.js';

export const postsRouter = express.Router();

postsRouter.get('/:id', validateIdParam('id', '게시글'), async (req, res, next) => {
  try {
    // req.params.id는 이미 검증된 숫자 타입
    const post = await postRepository.findPostById(req.params.id);
    // ... 나머지 로직
  }
});

// 다양한 파라미터에 적용
postsRouter.get('/:postId', validateIdParam('postId', '게시글'), handler);
usersRouter.put('/:userId', validateIdParam('userId', '사용자'), handler);
commentsRouter.delete('/:commentId', validateIdParam('commentId', '댓글'), handler);
```

### 5단계: 스키마 검증 강화

#### 트랜잭션 스키마 생성
```javascript
// src/validators/transaction.validator.js
import { z } from 'zod';

export const createPostWithCommentSchema = z.object({
  authorId: z.number().int('유효한 작성자 ID가 아닙니다.'),
  title: z.string().min(1, '게시글 제목을 입력해주세요.'),
  content: z.string().min(1, '게시글 내용을 입력해주세요.'),
  commentContent: z.string().min(1, '댓글 내용을 입력해주세요.'),
});
```

#### 트랜잭션 라우터에 적용
```javascript
// 리팩토링 전 - transactions.js
router.post('/posts-with-comment', async (req, res, next) => {
  try {
    const { authorId, title, content, commentContent } = req.body;
    
    // 수동 검증 (제거할 부분)
    if (!authorId || !title || !content || !commentContent) {
      throw new BadRequestException('필수 필드가 누락되었습니다.');
    }
    
    // ... 나머지 로직
  }
});

// 리팩토링 후 - Repository 패턴 사용
import express from 'express';
import { transactionRepository } from '../repository/transaction.repository.js';
import { userRepository } from '../repository/user.repository.js';
import { NotFoundException } from '../common/errors/index.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';
import { validate } from '../middlewares/validation.middleware.js';
import { validateIdParam } from '../middlewares/param-validation.middleware.js';
import { createPostWithCommentSchema } from '../validators/transaction.validator.js';

export const transactionsRouter = express.Router();

// 게시글 + 첫 댓글 동시 생성
transactionsRouter.post('/posts-with-comment', 
  validate(createPostWithCommentSchema), // 스키마 검증 미들웨어 적용
  async (req, res, next) => {
    try {
      const { authorId, title, content, commentContent } = req.body;
      
      // 작성자 존재 여부 확인
      const author = await userRepository.findUserById(authorId);
      if (!author) {
        throw new NotFoundException('작성자를 찾을 수 없습니다.');
      }

      const result = await transactionRepository.createPostWithComment(
        authorId,
        { title, content, published: true },
        commentContent,
      );

      res.status(HTTP_STATUS.CREATED).json({
        message: '게시글과 첫 댓글이 함께 생성되었습니다.',
        ...result,
      });
    } catch (error) {
      next(error);
    }
  }
);
```

### 6단계: 환경 변수 검증 (Config)

#### Config 검증 로직 생성
```javascript
// src/config/config.js
import { z } from 'zod';

// 환경 변수 스키마 정의
const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().min(1000).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
});

// 환경 변수 검증 함수
const parseEnvironment = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('환경 변수 검증에 실패했습니다:', error.errors);
    }
    process.exit(1);
  }
};

// 검증된 환경 변수 객체 export
export const config = parseEnvironment();

// 타입 안전성을 위한 타입 정의 (선택사항)
export type Config = z.infer<typeof envSchema>;
```

#### 다른 파일에서 config 사용
```javascript
// 리팩토링 전 - server.js
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

// 리팩토링 후
import { config } from './config/config.js';

app.listen(config.PORT, () => {
  console.log(`Server is running at http://localhost:${config.PORT}`);
});

// 리팩토링 전 - jwt.util.js
const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

// 리팩토링 후
import { config } from '../config/config.js';

const accessToken = jwt.sign(payload, config.JWT_SECRET, { expiresIn: '15m' });
const refreshToken = jwt.sign({ userId: user.id }, config.JWT_REFRESH_SECRET, { expiresIn: '7d' });
```

### (심화) 환경별 동적 Prisma 로깅 설정
프로덕션 환경에서는 불필요한 `query` 로그를 남기지 않는 것이 좋습니다. `PrismaClient`를 초기화할 때, `NODE_ENV` 환경 변수를 확인하여 로깅 수준을 동적으로 설정하는 패턴을 적용할 수 있습니다.

- `src/db/index.js` 파일을 생성하고 아래와 같이 작성합니다.

```javascript
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
```

- 이후, 다른 파일에서는 `new PrismaClient()` 대신 `import { prisma } from '../db/index.js'` 와 같이 가져와서 사용합니다.

### 7단계: 전체적인 리팩토링 예시

#### 완전히 리팩토링된 라우터 예시
```javascript
// src/routes/posts.js - 완전 리팩토링 버전
import express from 'express';
import { postRepository } from '../repository/post.repository.js';
import { NotFoundException } from '../common/errors/index.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';
import { validate } from '../middlewares/validation.middleware.js';
import { validateIdParam } from '../middlewares/param-validation.middleware.js';
import { createPostSchema, updatePostSchema } from '../validators/post.validator.js';

export const postsRouter = express.Router();

// 특정 게시글 조회 - 모든 검증 미들웨어 적용
postsRouter.get('/:id', 
  validateIdParam('id', '게시글'), // ID 검증
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
  }
);

// 게시글 생성 - 스키마 검증 적용
postsRouter.post('/', 
  validate(createPostSchema), // 요청 본문 검증
  async (req, res, next) => {
    try {
      const newPost = await postRepository.createPost(req.body);
      res.status(HTTP_STATUS.CREATED).json(newPost);
    } catch (error) {
      next(error);
    }
  }
);

// 게시글 수정 - 다중 미들웨어 적용
postsRouter.put('/:id', 
  validateIdParam('id', '게시글'), // ID 검증
  validate(updatePostSchema), // 요청 본문 검증
  async (req, res, next) => {
    try {
      // 존재 여부 확인
      const existingPost = await postRepository.findPostById(req.params.id);
      if (!existingPost) {
        throw new NotFoundException('게시글을 찾을 수 없습니다.');
      }

      const updatedPost = await postRepository.updatePost(req.params.id, req.body);
      res.status(HTTP_STATUS.OK).json(updatedPost);
    } catch (error) {
      next(error);
    }
  }
);
```

### 실제 auth.js 리팩토링 예시

```javascript
// 리팩토링 전 - auth.js
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/hash.util.js';
// ...

const router = express.Router();
const prisma = new PrismaClient();

router.post('/signup', validate(signUpSchema), async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name },
    });
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
});

export { router as authRouter };

// 리팩토링 후 - Repository 패턴 + 모든 개선사항 적용
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
```



### 3단계: HttpException 구조

```javascript
// src/common/errors/httpException.js
export class HttpException extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

// src/common/errors/not-found.exception.js
import { HttpException } from './httpException.js';
import { HTTP_STATUS } from '../constants/http-status.js';

export class NotFoundException extends HttpException {
  constructor(message = '요청한 리소스를 찾을 수 없습니다.') {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}
```

### 4단계: Constants 예시

```javascript
// src/common/constants/http-status.js
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// src/common/constants/time.js
export const ONE_MINUTE_IN_MS = 60 * 1000;
export const FIFTEEN_MINUTES_IN_MS = 15 * ONE_MINUTE_IN_MS;
export const ONE_DAY_IN_MS = 24 * 60 * ONE_MINUTE_IN_MS;
export const SEVEN_DAYS_IN_MS = 7 * ONE_DAY_IN_MS;
```

### 5단계: Config 검증 예시

```javascript
// src/config/config.js
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().min(1000).max(65535).default(3000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
});

const parseEnvironment = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ 환경 변수 검증 실패:', error.errors);
    }
    process.exit(1);
  }
};

export const config = parseEnvironment();
```

### 6단계: 라우터 리팩토링 예시

```javascript
// 리팩토링 전
router.get('/:id', async (req, res, next) => {
  try {
    const user = await userRepository.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// 리팩토링 후 - Repository 패턴 + 커스텀 에러 + 상수 사용
import express from 'express';
import { userRepository } from '../repository/user.repository.js';
import { NotFoundException } from '../common/errors/index.js';
import { HTTP_STATUS } from '../common/constants/http-status.js';
import { validateIdParam } from '../middlewares/param-validation.middleware.js';

export const usersRouter = express.Router();

usersRouter.get('/:id', 
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
  }
);
```

---

## ✅ 완료 확인사항

- [ ] **Repository 패턴 활용**
  - [ ] 모든 라우터에서 `PrismaClient` 직접 사용 대신 Repository를 사용하고 있나요?
  - [ ] `userRepository.findUserByEmail()`, `userRepository.createUser()` 등 적절한 메서드를 사용하고 있나요?
  - [ ] 라우터에서 `import { PrismaClient }` 구문이 제거되었나요?

- [ ] **파라미터 검증 미들웨어**
  - [ ] `src/middlewares/param-validation.middleware.js`에 `validateIdParam` 미들웨어가 구현되었나요?
  - [ ] 모든 `:id` 파라미터를 사용하는 라우트에 미들웨어가 적용되었나요?
  - [ ] 잘못된 ID(`/posts/abc`, `/users/-1`)로 요청 시 400 에러가 발생하나요?

- [ ] **스키마 검증 강화**
  - [ ] `src/validators/transaction.validator.js`가 생성되었나요?
  - [ ] 트랜잭션 라우트에서 요청 본문 검증이 적용되었나요?

- [ ] **커스텀 에러 및 상수**
  - [ ] `src/common/errors/` 폴더에 모든 커스텀 에러 클래스가 구현되었나요?
  - [ ] `src/common/constants/` 폴더에 HTTP 상태 코드와 시간 상수가 정의되었나요?
  - [ ] 모든 라우터에서 `res.status().json()` 대신 커스텀 에러를 throw하도록 변경되었나요?
  - [ ] 모든 하드코딩된 숫자들이 상수로 대체되었나요?

- [ ] **환경 변수 검증**
  - [ ] `src/config/config.js`에서 환경 변수 검증이 구현되었나요?
  - [ ] `server.js`, `cookie.util.js`, `jwt.util.js`에서 `process.env` 대신 `config` 객체를 사용하고 있나요?
  - [ ] 잘못된 환경 변수로 서버 시작 시 적절한 에러 메시지와 함께 종료되나요?

- [ ] **전체적인 코드 품질**
  - [ ] 모든 라우터가 `export const routerName = express.Router()` 패턴을 사용하고 있나요?
  - [ ] HTTP 상태 코드 대신 `HTTP_STATUS` 상수를 사용하고 있나요?
  - [ ] 시간 관련 매직 넘버가 모두 `time.js`의 상수로 대체되었나요?

---

## 🚀 다음 단계

리팩토링이 완료되었다면, 이제 `12-production` 단계에서 프로덕션 배포를 위한 설정들을 학습해봅시다!