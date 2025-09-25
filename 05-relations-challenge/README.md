# 실습: 05. 관계 쿼리 확장 및 적용

이번 실습에서는 `05-relations`에서 배운 `include`와 N+1 문제 해결 방법을 활용하여, User, Post, Comment 간의 다양한 관계 쿼리를 구현해봅니다. 기본 CRUD는 이미 완성되어 있으므로, **Relations 기능**에만 집중하여 실습할 수 있습니다.

---

## 📋 TODO 체크리스트

### 0단계: 환경 설정

- [ ] **데이터베이스 연결**

  - [ ] `.env` 파일을 프로젝트 루트에 생성했나요?
  - [ ] `DATABASE_URL`을 본인의 PostgreSQL 데이터베이스 URL로 설정했나요?

    ```bash
    # 비밀번호가 있는 경우
    DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

    # 비밀번호가 없는 경우
    DATABASE_URL="postgresql://username:@localhost:5432/database_name"
    ```

  - [ ] `npm install`로 의존성 패키지를 설치했나요?

### 1단계: 데이터베이스 초기화 및 시딩

**새로운 데이터베이스를 사용하는 경우 (마이그레이션 방식)**

- [ ] `npx prisma migrate dev --name init` 명령어를 실행하여 데이터베이스 스키마를 적용했나요?

**기존 데이터베이스를 계속 사용하는 경우 (DB Push 방식)**

- [ ] 스키마 상태를 확인했나요? `npx prisma validate`
- [ ] 스키마를 데이터베이스에 적용했나요? `npx prisma db push`
- [ ] Prisma Client를 업데이트했나요? `npx prisma generate`

**공통 작업**

- [ ] `npm run seed` 명령어를 실행하여 `User`, `Post`, `Comment` 테스트 데이터를 생성했나요?

### 2단계: Relations 기능 구현 (Challenge)

**기본 CRUD는 이미 완성되어 있습니다! 간단한 Relations 기능만 구현하면 됩니다.**

- [ ] **`post.repository.js`에서 핵심 Relations 함수 구현**

  - [ ] `findPostWithAuthor(id)` 함수를 구현했나요? `include`를 사용하여 게시글과 작성자 정보를 함께 조회해야 합니다.
  - [ ] `findPostWithComments(id)` 함수를 구현했나요? 게시글과 댓글을 함께 조회해야 합니다.

- [ ] **`user.repository.js`에서 핵심 Relations 함수 구현**

  - [ ] `findUserWithPosts(id)` 함수를 구현했나요? 사용자와 작성한 게시글을 함께 조회해야 합니다.

- [ ] **간단한 Relations API 엔드포인트 구현**
  - [ ] `GET /posts/:id/with-author` 엔드포인트를 구현했나요?
  - [ ] `GET /posts/:id/with-comments` 엔드포인트를 구현했나요?
  - [ ] `GET /users/:id/posts` 엔드포인트를 구현했나요?

### 3단계: 테스트 및 확인

- [ ] **API 테스트**
  - [ ] `GET /posts/:id/with-author`를 요청했을 때, 게시글과 작성자 정보가 함께 반환되나요?
  - [ ] `GET /posts/:id/with-comments`를 요청했을 때, 게시글과 댓글이 함께 반환되나요?
  - [ ] `GET /users/:id/posts`를 요청했을 때, 사용자와 작성한 게시글이 함께 반환되나요?

---

## 💡 Relations 구현 힌트

### 1. 기본 `include` 사용법

```javascript
// 게시글과 작성자 정보 함께 조회
async function findPostWithAuthor(id) {
  return await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      author: true, // User 정보 포함
    },
  });
}
```

### 2. 댓글과 함께 조회하기

```javascript
// 게시글과 댓글 함께 조회
async function findPostWithComments(id) {
  return await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      comments: true, // 댓글 목록 포함
    },
  });
}
```

### 3. 사용자의 게시글 조회하기

```javascript
// 사용자와 작성한 게시글 함께 조회
async function findUserWithPosts(id) {
  return await prisma.user.findUnique({
    where: { id },
    include: { posts: true },
  });
}
```

### � 핵심 포인트

- `include: { 관계필드명: true }`로 관련 데이터를 함께 가져올 수 있습니다
- 한 번의 쿼리로 필요한 모든 데이터를 가져오는 것이 효율적입니다
- 기본적인 `include` 사용법만 익혀도 대부분의 상황에서 충분합니다!
