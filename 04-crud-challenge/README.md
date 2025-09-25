# 실습: 04. CRUD API 구현 및 확장

이번 실습에서는 `User`에 대한 CRUD API를 구현하며 배운 내용을 복습하고, 추가적으로 `Post`에 대한 CRUD API를 직접 구현하여 실습을 확장합니다.

## 🎯 학습 목표

- Repository 패턴을 사용하여 데이터 접근 로직을 분리할 수 있다.
- Express Router를 활용하여 RESTful API를 설계하고 구현할 수 있다.
- Prisma Client를 사용한 기본 CRUD 연산을 마스터할 수 있다.
- 기존 코드베이스를 확장하여 새로운 모델의 API를 구현할 수 있다.

---

## 📋 TODO 체크리스트

### 0단계: 프로젝트 설정 및 데이터베이스 연결

- [ ] **환경 설정**
  - [ ] `.env` 파일을 프로젝트 루트에 생성했나요?
  - [ ] `DATABASE_URL`을 본인의 PostgreSQL 데이터베이스 URL로 설정했나요?

    ```bash
    # 비밀번호가 있는 경우
    DATABASE_URL="postgresql://username:password@localhost:5432/database_name"

    # 비밀번호가 없는 경우
    DATABASE_URL="postgresql://username:@localhost:5432/database_name"
    ```

  - [ ] `npm install`로 의존성 패키지를 설치했나요?

- [ ] **데이터베이스 초기화**
  
  **새로운 데이터베이스를 사용하는 경우 (마이그레이션 방식)**
  - [ ] `npx prisma migrate dev --name init`로 데이터베이스 테이블을 생성했나요?
  
  **기존 데이터베이스를 계속 사용하는 경우 (DB Push 방식)**
  - [ ] 스키마 상태를 확인했나요? `npx prisma validate`
  - [ ] 스키마를 데이터베이스에 적용했나요? `npx prisma db push`
  - [ ] Prisma Client를 업데이트했나요? `npx prisma generate`
  
  **공통 작업**
  - [ ] `npm run seed`로 초기 데이터를 삽입했나요?
  - [ ] DBeaver에서 User, Post, Comment 데이터가 모두 생성되었는지 확인했나요? (또는 `npx prisma studio` 사용 가능)

### 1단계: 강의 내용 복습하기

- [ ] **`User` Repository 구현**
  - [ ] `src/repository/user.repository.js` 파일에서 다음 5가지 CRUD 함수를 모두 구현했나요?
    - `createUser(data)` - 새 사용자 생성
    - `findAllUsers()` - 모든 사용자 조회
    - `findUserById(id)` - ID로 특정 사용자 조회
    - `updateUser(id, data)` - 사용자 정보 수정
    - `deleteUser(id)` - 사용자 삭제

- [ ] **`User` Router 구현**
  - [ ] `src/routes/users.js` 파일에서 `userRepository`를 import하여 다음 5가지 엔드포인트를 구현했나요?
    - `POST /users` - 새 사용자 생성
    - `GET /users` - 모든 사용자 조회
    - `GET /users/:id` - 특정 사용자 조회
    - `PUT /users/:id` - 사용자 정보 수정
    - `DELETE /users/:id` - 사용자 삭제

- [ ] **라우터 통합 및 서버 설정**
  - [ ] `src/routes/index.js` 파일에서 `users.js` 라우터를 `/users` 경로에 등록했나요?
  - [ ] `src/server.js`에 `apiRouter`를 등록했나요?
  - [ ] API 테스트 도구(Postman, Insomnia 등)로 모든 `User` API가 정상 동작하는지 확인했나요?

### 2단계: Post API 구현 (Challenge)

이제 `User` API를 구현한 경험을 바탕으로, `Post` 모델에 대한 완전한 CRUD API를 스스로 구현해보세요.

- [ ] **`Post` Repository 구현**
  - [ ] `src/repository/post.repository.js` 파일을 새로 생성했나요?
  - [ ] 다음 5가지 CRUD 함수를 모두 구현했나요?
    - `createPost(data)` - 새 게시글 생성 (제목, 내용, 작성자ID 포함)
    - `findAllPosts()` - 모든 게시글 조회
    - `findPostById(id)` - ID로 특정 게시글 조회
    - `updatePost(id, data)` - 게시글 정보 수정
    - `deletePost(id)` - 게시글 삭제

- [ ] **`Post` Router 구현**
  - [ ] `src/routes/posts.js` 파일을 새로 생성했나요?
  - [ ] `postRepository`를 import하여 다음 5가지 엔드포인트를 구현했나요?
    - `POST /posts` - 새 게시글 생성
    - `GET /posts` - 모든 게시글 조회
    - `GET /posts/:id` - 특정 게시글 조회
    - `PUT /posts/:id` - 게시글 정보 수정
    - `DELETE /posts/:id` - 게시글 삭제

- [ ] **라우터 통합**
  - [ ] `src/routes/index.js` 파일을 수정하여, `posts.js` 라우터를 import했나요?
  - [ ] `postsRouter`를 `/posts` 경로에 등록했나요?

### 3단계: API 테스트 및 검증

- [ ] **POST API 테스트**
  - [ ] 새 게시글 생성: `POST /posts`
  - [ ] headers에서 `Content-Type: application/json`을 설정했나요?
    ```json
    {
      "title": "첫 번째 게시글",
      "content": "게시글 내용입니다.",
      "authorId": 1
    }
    ```
  - [ ] 응답이 201 상태코드와 함께 생성된 게시글 정보를 반환하나요?

- [ ] **GET API 테스트**
  - [ ] 모든 게시글 조회: `GET /posts`
  - [ ] 특정 게시글 조회: `GET /posts/1`
  - [ ] 존재하지 않는 게시글 조회 시 적절한 에러 처리가 되나요?

- [ ] **PUT API 테스트**
  - [ ] 게시글 수정: `PUT /posts/1`
  - [ ] headers에서 `Content-Type: application/json`을 설정했나요?
    ```json
    {
      "title": "수정된 제목",
      "content": "수정된 내용"
    }
    ```

- [ ] **DELETE API 테스트**
  - [ ] 게시글 삭제: `DELETE /posts/1`
  - [ ] 삭제 후 해당 게시글 조회 시 404 에러가 반환되나요?

---

## 💡 구현 힌트

### `user.repository.js` 예시

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 새 사용자 생성
async function createUser(data) {
  return await prisma.user.create({ data });
}

// ID로 특정 사용자 조회
async function findUserById(id) {
  return await prisma.user.findUnique({ where: { id: Number(id) } });
}

// 모든 사용자 조회
async function findAllUsers() {
  return await prisma.user.findMany();
}

// 사용자 수정
async function updateUser(id, data) {
  return await prisma.user.update({ where: { id: Number(id) }, data });
}

// 사용자 삭제
async function deleteUser(id) {
  return await prisma.user.delete({ where: { id: Number(id) } });
}

// 객체로 묶어서 export
export const userRepository = {
  createUser,
  findUserById,
  findAllUsers,
  updateUser,
  deleteUser,
};
```

### `users.js` 라우터 예시

```javascript
import express from 'express';
import { userRepository } from '../repository/user.repository.js';

export const usersRouter = express.Router();

// POST /users - 새 사용자 생성
router.post('/', async (req, res) => {
  try {
    const newUser = await userRepository.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /users - 모든 사용자 조회
router.get('/', async (req, res) => {
  try {
    const users = await userRepository.findAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /users/:id - 특정 사용자 조회
router.get('/:id', async (req, res) => {
  try {
    const user = await userRepository.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /users/:id - 사용자 수정
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await userRepository.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /users/:id - 사용자 삭제
router.delete('/:id', async (req, res) => {
  try {
    await userRepository.deleteUser(req.params.id);
    res.json({ message: '사용자가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

```

### `post.repository.js` 예시

```javascript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 새 게시글 생성
async function createPost(data) {
  return await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      authorId: data.authorId,
    },
  });
}

// 모든 게시글 조회
async function findAllPosts() {
  return await prisma.post.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// ID로 특정 게시글 조회
async function findPostById(id) {
  return await prisma.post.findUnique({
    where: { id: Number(id) },
  });
}

// 게시글 수정
async function updatePost(id, data) {
  return await prisma.post.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      content: data.content,
    },
  });
}

// 게시글 삭제
async function deletePost(id) {
  return await prisma.post.delete({
    where: { id: Number(id) },
  });
}

// 객체로 묶어서 export
export const postRepository = {
  createPost,
  findPostById,
  findAllPosts,
  updatePost,
  deletePost,
};
```

### `posts.js` 라우터 예시

```javascript
import express from 'express';
import { postRepository } from '../repository/post.repository.js';

export const postsRouter = express.Router();

// POST /posts - 새 게시글 생성
postsRouter.post('/', async (req, res) => {
  try {
    const newPost = await postRepository.createPost(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /posts - 모든 게시글 조회
postsRouter.get('/', async (req, res) => {
  try {
    const posts = await postRepository.findAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /posts/:id - 특정 게시글 조회
postsRouter.get('/:id', async (req, res) => {
  try {
    const post = await postRepository.findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /posts/:id - 게시글 수정
postsRouter.put('/:id', async (req, res) => {
  try {
    const updatedPost = await postRepository.updatePost(
      req.params.id,
      req.body,
    );
    res.json(updatedPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /posts/:id - 게시글 삭제
postsRouter.delete('/:id', async (req, res) => {
  try {
    await postRepository.deletePost(req.params.id);
    res.json({ message: '게시글이 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

---

## 📚 개념 정리

### Repository 패턴의 장점

- **관심사 분리**: 데이터 접근 로직과 비즈니스 로직을 분리
- **테스트 용이성**: Repository를 모킹하여 단위 테스트 작성 가능
- **유지보수성**: 데이터베이스 변경 시 Repository만 수정하면 됨
- **재사용성**: 여러 라우터에서 동일한 Repository 함수 사용 가능

### RESTful API 설계 원칙

| HTTP 메서드 | 엔드포인트   | 목적             | 응답 상태코드         |
| ----------- | ------------ | ---------------- | --------------------- |
| POST        | `/posts`     | 리소스 생성      | 201 Created           |
| GET         | `/posts`     | 리소스 목록 조회 | 200 OK                |
| GET         | `/posts/:id` | 특정 리소스 조회 | 200 OK, 404 Not Found |
| PUT         | `/posts/:id` | 리소스 수정      | 200 OK                |
| DELETE      | `/posts/:id` | 리소스 삭제      | 200 OK                |

---

## ✅ 완료 확인사항

- [ ] `User`와 `Post` 두 모델 모두에 대한 완전한 CRUD API가 구현되었나요?
- [ ] 모든 API 엔드포인트가 적절한 HTTP 상태코드를 반환하나요?
- [ ] 에러 상황(존재하지 않는 리소스 등)이 적절히 처리되나요?
- [ ] Repository 패턴을 통해 데이터 접근 로직이 분리되었나요?
- [ ] API 테스트를 통해 모든 기능이 정상 동작함을 확인했나요?
  - [ ] 테스트 중에 `'req.body' as it is undefined`에러가 나오면 Headers에서 `Content-Type: application/json`를 확인하세요.

---

## 🚀 다음 단계

CRUD API 구현을 완료했다면, 이제 관계 쿼리(`include`)를 활용하여 연관된 데이터를 함께 조회하는 고급 기능을 학습해보세요!
