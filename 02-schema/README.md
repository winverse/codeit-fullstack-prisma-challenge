# 실습: 02. 스키마 설계 및 확장

`02-schema`에서 배운 내용을 바탕으로 `User`와 `Post` 모델을 직접 만들어보고, 추가로 `Comment` 모델을 설계하여 스키마를 확장하는 챌린지를 수행합니다.

## 🎯 학습 목표

- Prisma 스키마 문법을 사용하여 모델과 관계를 정의할 수 있다.
- 1:N 관계를 이해하고, 외래 키(Foreign Key)를 사용하여 관계를 설정할 수 있다.
- 기존 스키마에 새로운 모델을 추가하고, 다른 모델들과 관계를 맺어 확장할 수 있다.

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

### 1단계: 강의 내용 복습하기

- [ ] `prisma/schema.prisma` 파일에 `User`와 `Post` 모델을 추가하고, 두 모델 간의 1:N 관계를 설정하세요. (name 필드는 제외)

  ```prisma
  // prisma/schema.prisma

  // User 모델 (name 필드 없음)
  model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    posts     Post[]
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }

  // Post 모델
  model Post {
    id        Int      @id @default(autoincrement())
    title     String
    content   String?
    author    User     @relation(fields: [authorId], references: [id])
    authorId  Int
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
  }
  ```

### 2단계: 초기 마이그레이션 생성

- [ ] **초기 마이그레이션**: `npx prisma migrate dev --name init` 명령어를 실행하여 첫 번째 마이그레이션을 생성하세요.
- [ ] **마이그레이션 확인**: `prisma/migrations/` 폴더에 생성된 마이그레이션 파일을 확인해보세요.
- [ ] **결과 확인**: DBeaver에서 생성된 테이블들을 확인해보세요. (또는 `npx prisma studio` 사용 가능)

### 3단계: 마이그레이션 실습 (Challenge)

- [ ] **name 필드 추가**: `User` 모델에 `name String?` 필드를 추가하세요.
- [ ] **마이그레이션 생성**: `npx prisma migrate dev --name add-user-name` 명령어를 실행하여 마이그레이션 파일을 생성하세요.
- [ ] **마이그레이션 확인**: `prisma/migrations/` 폴더에 생성된 마이그레이션 파일을 확인해보세요.
- [ ] **결과 확인**: DBeaver에서 데이터베이스에 name 필드가 추가되었는지 확인해보세요. (또는 `npx prisma studio` 사용 가능)

### 4단계: 스키마 확장하기 (추가 Challenge)

- [ ] **`Comment` 모델 정의**: `id`, `content`, `createdAt`, `updatedAt` 필드를 포함하는 `Comment` 모델을 스키마에 추가하세요.
- [ ] **`Post`와 `Comment` 관계 설정**: 어떤 게시글(`Post`)에 달린 댓글인지 알아야 합니다. `Comment`가 `Post`에 종속되는 1:N 관계를 설정하세요.
- [ ] **`User`와 `Comment` 관계 설정**: 어떤 사용자(`User`)가 작성한 댓글인지 알아야 합니다. `Comment`를 작성한 `User`를 알 수 있도록 1:N 관계를 설정하세요.
- [ ] **관계 필드 추가**: `User` 모델에는 자신이 작성한 `Comment` 목록을, `Post` 모델에는 자신에게 달린 `Comment` 목록을 배열 형태로 추가하여 양방향 관계를 완성하세요.
- [ ] **마이그레이션으로 적용**: `npx prisma migrate dev --name add_comment_model` 명령어로 Comment 모델을 마이그레이션으로 적용하세요.

---

## 📚 개념 정리

- **마이그레이션 (Migration)**: 데이터베이스 스키마의 변경 사항을 체계적으로 관리하는 방법입니다. 각 변경 사항은 SQL 파일로 저장되어 버전 관리되며, 팀원들과 공유할 수 있습니다.
- **외래 키 (Foreign Key)**: 관계형 데이터베이스에서 한 테이블의 필드를 다른 테이블의 기본 키(Primary Key)와 연결하여, 두 테이블 간의 관계를 만드는 키입니다. Prisma에서는 `@relation` 속성의 `fields`에 외래 키 필드(예: `authorId`)를, `references`에 상대방의 기본 키(예: `id`)를 명시하여 관계를 정의합니다.
- **양방향 관계 (Bidirectional Relation)**: 관계를 맺는 양쪽 모델에서 모두 서로를 참조할 수 있는 관계입니다. 예를 들어, `User`에서 `posts`를 통해 자신이 쓴 글 목록을 볼 수 있고, `Post`에서 `author`를 통해 작성자 정보를 볼 수 있는 것이 양방향 관계입니다.

---

## ✅ 완료 확인사항

### 기본 실습
- [ ] `prisma/schema.prisma` 파일에 `User`, `Post` 모델이 정의되어 있나요?
- [ ] `npx prisma migrate dev --name init` 명령어로 초기 마이그레이션을 생성했나요?
- [ ] `User` 모델에 `name` 필드를 추가했나요?
- [ ] `npx prisma migrate dev --name add-user-name` 명령어를 실행했나요?
- [ ] `prisma/migrations/` 폴더에 두 개의 마이그레이션 파일이 생성되었나요?
- [ ] DBeaver에서 name 필드가 추가된 것을 확인했나요?

### 도전 (Comment 모델)
- [ ] `Comment` 모델을 스키마에 추가했나요?
- [ ] `Comment` 모델에 `postId`와 `authorId` 외래 키 필드가 모두 포함되어 있나요?
- [ ] `User` 모델에 `posts: Post[]`와 `comments: Comment[]` 필드가 모두 있나요?
- [ ] `Post` 모델에 `author: User`와 `comments: Comment[]` 필드가 모두 있나요?
- [ ] `npx prisma migrate dev --name add-comment-model` 명령어로 Comment 모델을 적용했나요?

---

## 💡 팁

챌린지가 어렵다면 아래 완성 코드를 참고하세요.

<details>
<summary><b>👉 완성된 Comment 모델 코드 보기</b></summary>

```prisma
model Comment {
  id        Int      @id @default(autoincrement())
  content   String

  // Post와의 관계 (어떤 게시글에 달린 댓글인가?)
  post      Post     @relation(fields: [postId], references: [id])
  postId    Int

  // User와의 관계 (누가 작성한 댓글인가?)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

</details>