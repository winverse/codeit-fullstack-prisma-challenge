# 💡 06-real-world-example-challenge 완전 정답 예시

> **주의**: 이 파일은 챌린지를 완료한 후 참고용으로 사용하세요. 먼저 스스로 구현해보고 막힐 때만 참고하는 것을 권장합니다.

## 🗂️ 완성된 파일 구조

```
src/
├── repository/
│   ├── user.repository.js      # 기존
│   ├── post.repository.js      # 기존  
│   └── comment.repository.js   # 새로 생성 ✨
├── routes/
│   ├── index.js               # 수정됨 ✨
│   ├── users.js               # 기존
│   ├── posts.js               # 기존
│   └── comments.js            # 새로 생성 ✨
└── server.js                  # 기존
```

---

## 📄 완전한 정답 코드

### 1. `src/repository/comment.repository.js`

```javascript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createComment(data) {
  return await prisma.comment.create({
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      post: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });
}

async function findCommentById(id) {
  return await prisma.comment.findUnique({
    where: { id: Number(id) },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      post: {
        select: {
          id: true,
          title: true
        }
      }
    }
  });
}

async function findAllComments() {
  return await prisma.comment.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      post: {
        select: {
          id: true,
          title: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}

async function findCommentsByPostId(postId) {
  return await prisma.comment.findMany({
    where: { postId: Number(postId) },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });
}

async function updateComment(id, data) {
  return await prisma.comment.update({
    where: { id: Number(id) },
    data,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
}

async function deleteComment(id) {
  return await prisma.comment.delete({
    where: { id: Number(id) }
  });
}

export const commentRepository = {
  createComment,
  findCommentById,
  findAllComments,
  findCommentsByPostId,
  updateComment,
  deleteComment,
};
```

### 2. `src/routes/comments.js`

```javascript
import express from 'express';
import { commentRepository } from '../repository/comment.repository.js';

const router = express.Router();

// 모든 댓글 조회 (작성자 및 게시글 정보 포함)
router.get('/', async (req, res) => {
  try {
    const comments = await commentRepository.findAllComments();
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 게시글의 댓글 목록 조회
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await commentRepository.findCommentsByPostId(req.params.postId);
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 특정 댓글 조회
router.get('/:id', async (req, res) => {
  try {
    const comment = await commentRepository.findCommentById(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 새 댓글 생성
router.post('/', async (req, res) => {
  try {
    const { content, authorId, postId } = req.body;
    
    if (!content || !authorId || !postId) {
      return res.status(400).json({ 
        error: 'content, authorId, and postId are required' 
      });
    }

    const newComment = await commentRepository.createComment({
      content,
      authorId: Number(authorId),
      postId: Number(postId)
    });
    
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 댓글 수정
router.put('/:id', async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ error: 'content is required' });
    }

    const updatedComment = await commentRepository.updateComment(req.params.id, { content });
    res.json(updatedComment);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

// 댓글 삭제
router.delete('/:id', async (req, res) => {
  try {
    await commentRepository.deleteComment(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(500).json({ error: error.message });
  }
});

export const commentsRouter = router;
```

### 3. `src/routes/index.js` (수정된 부분)

```javascript
import express from 'express';
import { usersRouter } from './users.js';
import { postsRouter } from './posts.js';
import { commentsRouter } from './comments.js'; // 👈 추가

const router = express.Router();

router.use('/users', usersRouter);
router.use('/posts', postsRouter);
router.use('/comments', commentsRouter); // 👈 추가

export const indexRouter = router;
```

---

## 🧪 완전한 테스트 시나리오

### 1. 환경 설정 확인
```bash
# 의존성 설치
npm install

# 데이터베이스 마이그레이션
npx prisma migrate dev

# 시딩 실행
npm run seed

# 서버 실행
npm run dev
```

### 2. API 테스트 (전체 시나리오)

#### Step 1: 댓글 생성
```bash
curl -X POST http://localhost:3000/comments \
  -H "Content-Type: application/json" \
  -d '{
    "content": "정말 좋은 글이네요!",
    "authorId": 1,
    "postId": 1
  }'
```

**예상 응답**:
```json
{
  "id": 1,
  "content": "정말 좋은 글이네요!",
  "authorId": 1,
  "postId": 1,
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z",
  "author": {
    "id": 1,
    "name": "홍길동",
    "email": "hong@example.com"
  },
  "post": {
    "id": 1,
    "title": "첫 번째 게시글"
  }
}
```

#### Step 2: 모든 댓글 조회
```bash
curl http://localhost:3000/comments
```

#### Step 3: 특정 게시글의 댓글 조회
```bash
curl http://localhost:3000/comments/post/1
```

#### Step 4: 특정 댓글 조회
```bash
curl http://localhost:3000/comments/1
```

#### Step 5: 댓글 수정
```bash
curl -X PUT http://localhost:3000/comments/1 \
  -H "Content-Type: application/json" \
  -d '{"content": "수정된 댓글 내용입니다."}'
```

#### Step 6: 댓글 삭제
```bash
curl -X DELETE http://localhost:3000/comments/1
```

**예상 응답**: `204 No Content` (응답 본문 없음)

### 3. 에러 케이스 테스트

#### 존재하지 않는 댓글 조회
```bash
curl http://localhost:3000/comments/999
```
**예상 응답**: `404 Not Found`
```json
{"error": "Comment not found"}
```

#### 필수 필드 누락으로 댓글 생성
```bash
curl -X POST http://localhost:3000/comments \
  -H "Content-Type: application/json" \
  -d '{"content": "내용만 있는 댓글"}'
```
**예상 응답**: `400 Bad Request`
```json
{"error": "content, authorId, and postId are required"}
```

---

## 🎯 핵심 학습 포인트 정리

### 1. Repository 패턴
- **목적**: 데이터 접근 로직을 한 곳에 모아서 관리
- **장점**: 재사용성, 테스트 용이성, 유지보수성 향상
- **패턴**: 모든 함수에서 일관된 `include` 구조 사용

### 2. Prisma 관계 쿼리
- **include**: 관련된 테이블의 데이터도 함께 조회
- **select**: 필요한 필드만 선택적으로 조회 (성능 최적화)
- **orderBy**: 결과 정렬 (댓글은 보통 시간순)

### 3. RESTful API 설계
- **GET /comments**: 전체 리스트 조회
- **GET /comments/:id**: 특정 리소스 조회
- **POST /comments**: 새 리소스 생성
- **PUT /comments/:id**: 기존 리소스 수정
- **DELETE /comments/:id**: 리소스 삭제

### 4. 에러 처리 패턴
- **400 Bad Request**: 클라이언트 입력 오류
- **404 Not Found**: 리소스를 찾을 수 없음
- **500 Internal Server Error**: 서버 내부 오류

---

## 🚀 다음 단계 도전 과제

기본 구현을 완료했다면, 다음과 같은 고급 기능들도 도전해보세요:

### 1. 댓글 통계 API
```javascript
// GET /posts/:id/comments/stats
{
  "totalComments": 5,
  "commentsToday": 2,
  "topCommenter": {
    "name": "홍길동",
    "commentCount": 3
  }
}
```

### 2. 댓글 페이지네이션
```javascript
// GET /comments?page=1&limit=5
{
  "comments": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalComments": 15,
    "hasNextPage": true
  }
}
```

### 3. 댓글 검색 기능
```javascript
// GET /comments?search=keyword
```

이런 기능들을 구현하면서 더 고급 Prisma 쿼리와 API 설계를 경험해보세요! 🎓