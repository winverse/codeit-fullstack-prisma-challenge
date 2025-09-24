# 실습: 01. 프로젝트 초기 설정

Express와 Prisma를 사용하기 위한 기본 환경 설정을 단계별로 진행하며, Node.js 백엔드 프로젝트의 기본 구조를 학습합니다.

## 🎯 학습 목표

- Express 프로젝트의 기본 구조를 이해하고 설정할 수 있다.
- `npm`을 사용하여 의존성 패키지를 관리할 수 있다.
- `nodemon`을 이용해 개발 생산성을 향상시킬 수 있다.
- ESLint, Prettier를 사용한 코드 포맷팅 및 린팅 환경을 구성할 수 있다.
- Prisma를 프로젝트에 추가하고 초기화할 수 있다.

---

## 📋 TODO 체크리스트

### 1단계: 프로젝트 초기화 및 Express 설치

- [ ] `npm` 프로젝트를 초기화하세요.
  ```bash
  npm init -y
  ```
- [ ] `package.json`에 ES 모듈을 사용하기 위한 `"type": "module"`을 추가하세요.
- [ ] Express를 설치하세요.
  ```bash
  npm install express
  ```

### 2단계: 기본 서버 파일 작성

- [ ] `src` 폴더를 생성하고, 그 안에 `server.js` 파일을 만드세요.
- [ ] `src/server.js`에 아래 코드를 작성하여 기본 서버를 구현하세요.

  ```javascript
  import express from "express";

  const app = express();
  const PORT = 3000;

  app.get("/", (req, res) => {
    res.send("Hello, World!");
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
  ```

### 3단계: 개발 환경 개선

- [ ] `nodemon`을 개발 의존성(`-D`)으로 설치하세요.
  ```bash
  npm install -D nodemon
  ```
- [ ] `package.json`의 `scripts`에 `dev` 스크립트를 추가하세요.
  ```json
  "scripts": {
    "dev": "nodemon src/server.js"
  }
  ```

### 4단계: Prisma 설정

- [ ] Prisma CLI와 Client를 설치하세요.
  ```bash
  npm install -D prisma
  npm install @prisma/client
  ```
- [ ] Prisma 프로젝트를 초기화하세요.
  ```bash
  npx prisma init
  ```

### 5단계: 코드 스타일 도구 설정

- [ ] ESLint와 Prettier를 개발 의존성으로 설치하세요.
  ```bash
  npm install -D eslint prettier @eslint/js
  ```
- [ ] 프로젝트 루트에 `.prettierrc` 파일을 생성하고 규칙을 작성하세요.
  ```json
  {
    "printWidth": 80,
    "bracketSpacing": true,
    "trailingComma": "all",
    "semi": true,
    "singleQuote": true
  }
  ```
- [ ] `eslint.config.js` 파일을 생성하고 규칙을 작성하세요.

  ```javascript
  import js from "@eslint/js";

  export default [
    js.configs.recommended,
    {
      languageOptions: {
        ecmaVersion: 2024,
        sourceType: "module",
        globals: { console: "readonly", process: "readonly" },
      },
      rules: {
        "no-unused-vars": "warn",
        "no-console": "off",
        "prefer-const": "error",
        "no-var": "error",
        semi: ["error", "always"],
        quotes: ["error", "single"],
      },
    },
  ];
  ```

- [ ] `package.json`의 `scripts`에 `format` 스크립트를 추가하세요.
  ```json
  "scripts": {
    "dev": "nodemon src/server.js",
    "format": "prettier --write ."
  }
  ```

### 6단계: `.gitignore` 설정

- [ ] `.gitignore` 파일을 생성하고, Git 추적에서 제외할 폴더와 파일을 추가하세요.
  ```
  node_modules
  .env
  ```

---

## 📚 개념 정리

- **`npm`**: Node.js의 패키지 매니저로, 프로젝트에 필요한 라이브러리(패키지)를 설치, 관리, 삭제하는 도구입니다.
- **`express`**: Node.js를 위한 가장 인기 있는 웹 프레임워크 중 하나로, 웹 서버와 API를 쉽게 만들 수 있도록 도와줍니다.
- **`nodemon`**: 개발 중에 소스 코드가 변경될 때마다 자동으로 서버를 재시작해주는 도구로, 개발 생산성을 크게 향상시킵니다.
- **`prisma`**: 차세대 ORM(Object-Relational Mapper)으로, 데이터베이스 작업을 JavaScript/TypeScript 코드로 직관적으로 할 수 있게 해줍니다.
- **ESLint & Prettier**: 코드의 잠재적 오류를 찾아주고(Linter), 정해진 규칙에 따라 코드를 자동으로 예쁘게 정렬해주는(Formatter) 도구입니다. 협업 시 코드 일관성을 유지하는 데 필수적입니다.

---

## ✅ 완료 확인사항

- [ ] `npm run dev` 실행 시 "🚀 Server running..." 메시지가 콘솔에 출력되나요?
- [ ] 브라우저에서 `http://localhost:3000` 접속 시 "Hello, World!"가 보이나요?
- [ ] `npm run format` 실행 시 코드가 자동으로 정렬되나요?
- [ ] 프로젝트 구조가 가이드라인과 같이 잘 생성되었나요?

---

## 🚀 다음 단계

기본 설정이 완료되었으니, 이제 Prisma 스키마를 설계하여 실제 데이터베이스 모델을 정의하는 다음 단계로 넘어갈 준비가 되었습니다!
