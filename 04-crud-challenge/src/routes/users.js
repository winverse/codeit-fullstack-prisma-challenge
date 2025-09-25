import express from 'express';
// TODO: user.repository.js에서 userRepository 객체를 import 하세요
// import { userRepository } from '../repository/user.repository.js';

export const usersRouter = express.Router();

/**
 * 📋 TODO: User API 엔드포인트들을 구현해주세요!
 * 
 * 아래 5가지 RESTful API 엔드포인트를 하나씩 구현해보세요.
 * user.repository.js의 함수들을 먼저 구현한 후 이 파일을 작성하세요.
 */

// POST /users - 새 사용자 생성
usersRouter.post('/', async (req, res) => {
  try {
    // TODO: 1. req.body에서 사용자 데이터를 받아오세요
    // TODO: 2. userRepository.createUser()를 호출하여 사용자를 생성하세요
    // TODO: 3. 201 상태코드와 함께 생성된 사용자 정보를 반환하세요
    
    res.status(501).json({ 
      error: 'POST /users 엔드포인트를 구현해주세요!',
      hint: 'userRepository.createUser(req.body)를 사용하세요'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /users - 모든 사용자 조회
usersRouter.get('/', async (req, res) => {
  try {
    // TODO: 1. userRepository.findAllUsers()를 호출하여 모든 사용자를 조회하세요
    // TODO: 2. 200 상태코드와 함께 사용자 목록을 반환하세요
    
    res.status(501).json({ 
      error: 'GET /users 엔드포인트를 구현해주세요!',
      hint: 'userRepository.findAllUsers()를 사용하세요'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /users/:id - 특정 사용자 조회
usersRouter.get('/:id', async (req, res) => {
  try {
    // TODO: 1. req.params.id에서 사용자 ID를 받아오세요
    // TODO: 2. userRepository.findUserById()를 호출하여 사용자를 조회하세요
    // TODO: 3. 사용자가 없으면 404, 있으면 200과 사용자 정보를 반환하세요
    
    res.status(501).json({ 
      error: 'GET /users/:id 엔드포인트를 구현해주세요!',
      hint: 'userRepository.findUserById(req.params.id)를 사용하세요'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /users/:id - 사용자 정보 수정
usersRouter.put('/:id', async (req, res) => {
  try {
    // TODO: 1. req.params.id에서 사용자 ID를 받아오세요
    // TODO: 2. req.body에서 수정할 데이터를 받아오세요
    // TODO: 3. userRepository.updateUser()를 호출하여 사용자 정보를 수정하세요
    // TODO: 4. 200 상태코드와 함께 수정된 사용자 정보를 반환하세요
    
    res.status(501).json({ 
      error: 'PUT /users/:id 엔드포인트를 구현해주세요!',
      hint: 'userRepository.updateUser(req.params.id, req.body)를 사용하세요'
    });
  } catch (error) {
    // Prisma 에러 처리: 존재하지 않는 레코드
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '존재하지 않는 사용자입니다.' });
    }
    res.status(400).json({ error: error.message });
  }
});

// DELETE /users/:id - 사용자 삭제
usersRouter.delete('/:id', async (req, res) => {
  try {
    // TODO: 1. req.params.id에서 사용자 ID를 받아오세요
    // TODO: 2. userRepository.deleteUser()를 호출하여 사용자를 삭제하세요
    // TODO: 3. 200 상태코드와 함께 삭제 완료 메시지를 반환하세요
    
    res.status(501).json({ 
      error: 'DELETE /users/:id 엔드포인트를 구현해주세요!',
      hint: 'userRepository.deleteUser(req.params.id)를 사용하세요'
    });
  } catch (error) {
    // Prisma 에러 처리: 존재하지 않는 레코드
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '존재하지 않는 사용자입니다.' });
    }
    res.status(400).json({ error: error.message });
  }
});

/**
 * 🎯 구현 완료 후 체크리스트:
 * 
 * □ POST /users: 새 사용자 생성 (201 Created)
 * □ GET /users: 모든 사용자 조회 (200 OK)
 * □ GET /users/:id: 특정 사용자 조회 (200 OK | 404 Not Found)
 * □ PUT /users/:id: 사용자 정보 수정 (200 OK | 404 Not Found)
 * □ DELETE /users/:id: 사용자 삭제 (200 OK | 404 Not Found)
 * 
 * 💡 테스트 방법:
 * 1. Postman이나 다른 API 테스트 도구를 사용하세요
 * 2. 각 엔드포인트를 순서대로 테스트해보세요
 * 3. 에러 상황(존재하지 않는 ID 등)도 테스트해보세요
 * 
 * 🔗 다음 단계:
 * 구현이 완료되면 routes/index.js에서 이 라우터를 등록하세요!
 */