# 실습: 08. 트랜잭션 챌린지 - 게시글 삭제

이번 챌린지에서는 08-transactions에서 학습한 **트랜잭션**을 활용하여 게시글과 관련 댓글을 안전하게 삭제하는 API를 구현해봅니다. **트랜잭션 Repository는 이미 완성되어 있으므로**, API 구현과 테스트에만 집중하면 됩니다.

## 🎯 학습 목표

- 게시글 삭제 시 관련 댓글도 함께 안전하게 삭제하는 트랜잭션을 구현할 수 있다.
- 트랜잭션 실패 시 롤백이 정상적으로 작동하는지 확인할 수 있다.
- 데이터 일관성을 보장하는 안전한 삭제 로직을 작성할 수 있다.

---

## 📋 구현할 기능

### 1. 트랜잭션 기반 게시글 삭제
- 댓글 먼저 삭제 후 게시글 삭제
- 실패 시 자동 롤백

### 2. 삭제 결과 통계
- 삭제된 댓글 개수
- 삭제된 게시글 정보

### 3. 에러 처리
- 존재하지 않는 게시글 처리
- 트랜잭션 실패 처리

---

## 📋 TODO 체크리스트

### 0단계: 환경 설정

- [ ] **데이터베이스 초기화**

  **새로운 데이터베이스를 사용하는 경우 (마이그레이션 방식)**
  - [ ] `npx prisma migrate dev --name init`로 데이터베이스 스키마를 적용했나요?
  
  **기존 데이터베이스를 계속 사용하는 경우 (DB Push 방식)**
  - [ ] 스키마 상태를 확인했나요? `npx prisma validate`
  - [ ] 스키마를 데이터베이스에 적용했나요? `npx prisma db push`
  - [ ] Prisma Client를 업데이트했나요? `npx prisma generate`

- [ ] **기본 환경**
  - [ ] `src/repository/transaction.repository.js`에 트랜잭션 함수들이 이미 구현되어 있는지 확인했나요?
  - [ ] `.env` 파일과 데이터베이스 연결이 정상적으로 되어 있나요?
  - [ ] `npm install` 및 `npm run seed` 실행했나요?

### 1단계: 완성된 트랜잭션 코드 분석

- [ ] **`src/repository/transaction.repository.js` 파일 확인**
  - [ ] `deletePostWithComments(postId)` 함수가 이미 구현되어 있는지 확인
  - [ ] `prisma.$transaction` 사용법과 삭제 순서를 분석
  - [ ] `createPostWithComment` 함수도 함께 분석

### 2단계: 새로운 트랜잭션 함수 구현 (Challenge)

- [ ] **`src/repository/transaction.repository.js`에 새 함수 추가**
  - [ ] `deleteUserWithPosts(userId)` 함수 구현
  - [ ] 사용자의 모든 댓글 → 게시글 → 사용자 순서로 삭제
  - [ ] 트랜잭션으로 안전하게 처리

### 3단계: 트랜잭션 API 구현

- [ ] **`src/routes/transactions.js` 파일 생성**
  - [ ] `DELETE /transactions/posts/:id` 엔드포인트 구현
  - [ ] `DELETE /transactions/users/:id` 엔드포인트 구현 (Challenge)
  - [ ] 에러 처리 및 적절한 응답 메시지 구현

### 4단계: 라우터 등록

- [ ] **`src/routes/index.js`에 트랜잭션 라우터 추가**
  - [ ] `/transactions` 경로로 라우터 등록

### 5단계: 테스트

- [ ] **트랜잭션 삭제 API 테스트**
  - [ ] `DELETE /transactions/posts/1` 호출 (기존 함수 활용)
  - [ ] `DELETE /transactions/users/1` 호출 (새로 구현한 함수)
  - [ ] 모든 관련 데이터가 안전하게 삭제되었는지 확인
  - [ ] 삭제 결과 통계가 올바르게 반환되는지 확인

---

## 💡 구현 가이드

### 1. 완성된 Transaction Repository 분석

```javascript
// src/repository/transaction.repository.js (이미 구현됨)
async function deletePostWithComments(postId) {
  return await prisma.$transaction(async (tx) => {
    // 댓글 수 확인
    const commentCount = await tx.comment.count({ where: { postId } });
    
    // 댓글 삭제
    await tx.comment.deleteMany({ where: { postId } });
    
    // 게시글 삭제 (작성자 정보 포함)
    const deletedPost = await tx.post.delete({
      where: { id: postId },
      include: { author: { select: { name: true } } },
    });

    return {
      deletedPost,
      deletedCommentsCount: commentCount,
    };
  });
}
```

**핵심 포인트:**
- `prisma.$transaction`으로 안전한 삭제 보장
- 댓글 먼저 삭제 후 게시글 삭제 (외래키 제약조건)
- 삭제 통계 정보 반환

### 2. 새로운 트랜잭션 함수 구현 (Challenge)

```javascript
// src/repository/transaction.repository.js에 추가
async function deleteUserWithPosts(userId) {
  return await prisma.$transaction(async (tx) => {
    // TODO: 1. 사용자가 작성한 댓글 삭제
    // TODO: 2. 사용자의 게시글에 달린 다른 댓글들 삭제
    // TODO: 3. 사용자의 게시글 삭제
    // TODO: 4. 사용자 삭제
    // TODO: 5. 삭제 통계 반환
  });
}
```

### 3. Transaction Router 구현

```javascript
// src/routes/transactions.js
import express from 'express';
import { transactionRepository } from '../repository/transaction.repository.js';

const router = express.Router();

// 게시글 삭제 (완성된 함수 활용)
router.delete('/posts/:id', async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const result = await transactionRepository.deletePostWithComments(postId);
    
    res.json({
      message: '게시글과 댓글이 안전하게 삭제되었습니다.',
      ...result
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
    res.status(500).json({ error: error.message });
  }
});

// 사용자 삭제 (Challenge - 직접 구현)
router.delete('/users/:id', async (req, res) => {
  // TODO: 구현하기
});

export const transactionsRouter = router;
```

### 4. 테스트 예시

```bash
# 게시글 삭제 테스트 (완성된 기능)
curl -X DELETE "http://localhost:3000/transactions/posts/1"

# 사용자 삭제 테스트 (Challenge 구현)
curl -X DELETE "http://localhost:3000/transactions/users/1"

# 삭제 확인
curl "http://localhost:3000/api/users/1"  # 404 에러가 나와야 함
curl "http://localhost:3000/api/posts"    # 해당 사용자 게시글 모두 삭제 확인
```

### 5. 구현 힌트

```javascript
// deleteUserWithPosts 구현 힌트
async function deleteUserWithPosts(userId) {
  return await prisma.$transaction(async (tx) => {
    // 1. 사용자 댓글 삭제
    const deletedUserComments = await tx.comment.deleteMany({
      where: { authorId: Number(userId) }
    });

    // 2. 사용자 게시글의 ID 조회
    const userPosts = await tx.post.findMany({
      where: { authorId: Number(userId) },
      select: { id: true }
    });

    // 3. 사용자 게시글에 달린 다른 사람 댓글 삭제
    const deletedOthersComments = await tx.comment.deleteMany({
      where: { postId: { in: userPosts.map(p => p.id) } }
    });

    // 4. 사용자 게시글 삭제
    const deletedPosts = await tx.post.deleteMany({
      where: { authorId: Number(userId) }
    });

    // 5. 사용자 삭제
    const deletedUser = await tx.user.delete({
      where: { id: Number(userId) }
    });

    return {
      deletedUser,
      deletedPostsCount: deletedPosts.count,
      deletedCommentsCount: deletedUserComments.count + deletedOthersComments.count
    };
  });
}
```
