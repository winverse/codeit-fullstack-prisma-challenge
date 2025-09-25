# 실습: 07. 고급 쿼리 챌린지 - Comment API

이번 챌린지에서는 07-advanced-queries에서 학습한 **검색, 페이지네이션, 복잡한 쿼리**를 Comment 기능에 적용해봅니다.

## 🎯 학습 목표

- Comment에 대한 간단한 검색 기능을 구현할 수 있다.
- Comment 목록에 페이지네이션을 적용할 수 있다.
- 관계 데이터를 포함한 복잡한 Comment 쿼리를 작성할 수 있다.

---

## 📋 구현할 기능

### 1. Comment 검색 기능
- 댓글 내용(content)으로 검색
- 작성자 이름으로 검색

### 2. Comment 페이지네이션
- 기본 10개씩 페이지 나누기
- page, limit 파라미터 지원

### 3. Comment 복잡한 쿼리
- 댓글 + 작성자 + 게시글 정보 함께 조회
- 특정 게시글의 최신 댓글 조회

---

## 📋 TODO 체크리스트

### 0단계: 환경 설정 및 시작 코드 확인

- [ ] **데이터베이스 초기화**

  **새로운 데이터베이스를 사용하는 경우 (마이그레이션 방식)**
  - [ ] `npx prisma migrate dev --name init`로 데이터베이스 스키마를 적용했나요?
  
  **기존 데이터베이스를 계속 사용하는 경우 (DB Push 방식)**
  - [ ] 스키마 상태를 확인했나요? `npx prisma validate`
  - [ ] 스키마를 데이터베이스에 적용했나요? `npx prisma db push`
  - [ ] Prisma Client를 업데이트했나요? `npx prisma generate`

- [ ] **기본 설정**
  - [ ] 기본 Comment CRUD 기능이 이미 구현되어 있는지 확인
  - [ ] `npm install` 및 `npm run seed` 실행

### 1단계: Comment Repository에 고급 쿼리 추가

- [ ] **`src/repository/comment.repository.js`에 고급 쿼리 함수 추가**
  - [ ] `searchComments(search)` - 댓글 내용이나 작성자 이름으로 검색
  - [ ] `getCommentsWithPagination(page, limit)` - 페이지네이션 적용
  - [ ] `getCommentsWithDetails(postId)` - 특정 게시글의 댓글 + 작성자 + 게시글 정보

### 2단계: Comment Router에 고급 쿼리 API 추가

- [ ] **`src/routes/comments.js`에 고급 쿼리 API 엔드포인트 추가**
  - [ ] `GET /comments/search?q=검색어` - 댓글 검색
  - [ ] 기존 `GET /comments`에 페이지네이션 파라미터 추가 (`?page=1&limit=10`)
  - [ ] `GET /comments/post/:postId/details` - 특정 게시글의 상세 댓글 정보

### 3단계: 테스트

- [ ] **새로 추가된 고급 쿼리 API 테스트**
  - [ ] 검색: `GET /comments/search?q=좋은`
  - [ ] 페이지네이션: `GET /comments?page=1&limit=5`
  - [ ] 상세 정보: `GET /comments/post/1/details`

---

## 💡 구현 가이드

### 1. Comment Repository 예시

```javascript
// src/repository/comment.repository.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 1. 간단한 검색 - 댓글 내용이나 작성자 이름으로 검색
async function searchComments(search) {
  return await prisma.comment.findMany({
    where: {
      OR: [
        { content: { contains: search } },
        { author: { name: { contains: search } } }
      ]
    },
    include: {
      author: { select: { id: true, name: true } }
    }
  });
}

// 2. 간단한 페이지네이션
async function getCommentsWithPagination(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
      skip,
      take: limit,
      include: { author: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.comment.count()
  ]);
  
  return {
    comments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

// 3. 복잡한 쿼리 - 댓글 + 작성자 + 게시글 정보
async function getCommentsWithDetails(postId) {
  return await prisma.comment.findMany({
    where: { postId: parseInt(postId) },
    include: {
      author: { select: { id: true, name: true } },
      post: { select: { id: true, title: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export const commentRepository = {
  // ... 기존 CRUD 함수들
  searchComments,
  getCommentsWithPagination,
  getCommentsWithDetails
};
```

### 2. Comment Router 예시

```javascript
// src/routes/comments.js
import express from 'express';
import { commentRepository } from '../repository/comment.repository.js';

const router = express.Router();

// 검색 API
router.get('/search', async (req, res) => {
  const { q } = req.query;
  const comments = await commentRepository.searchComments(q);
  res.json(comments);
});

// 페이지네이션 API
router.get('/', async (req, res) => {
  const { page, limit } = req.query;
  const result = await commentRepository.getCommentsWithPagination(
    parseInt(page) || 1,
    parseInt(limit) || 10
  );
  res.json(result);
});

// 상세 정보 API
router.get('/post/:postId/details', async (req, res) => {
  const { postId } = req.params;
  const comments = await commentRepository.getCommentsWithDetails(postId);
  res.json(comments);
});

export const commentsRouter = router;
```

### 3. 테스트 예시

```bash
# 검색 테스트
curl "http://localhost:3000/comments/search?q=좋은"

# 페이지네이션 테스트
curl "http://localhost:3000/comments?page=1&limit=5"

# 상세 정보 테스트
curl "http://localhost:3000/comments/post/1/details"
```
