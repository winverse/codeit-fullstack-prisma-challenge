import express from 'express';
import { userRepository } from '../repository/user.repository.js';

const router = express.Router();

/**
 * 기본 CRUD API (04-crud에서 학습한 내용)
 * 이미 구현되어 있습니다.
 */

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
      return res.status(404).json({ error: '존재하지 않는 사용자입니다.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /users/:id - 사용자 정보 수정
router.put('/:id', async (req, res) => {
  try {
    const updatedUser = await userRepository.updateUser(
      req.params.id,
      req.body,
    );
    res.json(updatedUser);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '존재하지 않는 사용자입니다.' });
    }
    res.status(400).json({ error: error.message });
  }
});

// DELETE /users/:id - 사용자 삭제
router.delete('/:id', async (req, res) => {
  try {
    await userRepository.deleteUser(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '존재하지 않는 사용자입니다.' });
    }
    res.status(400).json({ error: error.message });
  }
});

/**
 * 📋 TODO: 간단한 Relations API를 구현해보세요!
 *
 * 04-crud에서 학습한 기본 CRUD는 이미 구현되어 있습니다.
 * 이제 기본적인 Relations 엔드포인트만 구현하면 됩니다.
 */

// GET /users/:id/posts - 사용자와 작성한 게시글 함께 조회
router.get('/:id/posts', async (req, res) => {
  try {
    // TODO: userRepository.findUserWithPosts() 함수를 먼저 구현하세요!
    res.status(501).json({
      error: 'GET /users/:id/posts 엔드포인트를 구현해주세요!',
      hint: '1. user.repository.js에서 findUserWithPosts 함수를 구현하세요',
      example: 'include: { posts: true } 사용',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const usersRouter = router;

/**
 * 🎯 간단한 Relations API 체크리스트:
 *
 * 기본 CRUD (이미 완료):
 * ✅ POST /users: 새 사용자 생성
 * ✅ GET /users: 모든 사용자 조회
 * ✅ GET /users/:id: 특정 사용자 조회
 * ✅ PUT /users/:id: 사용자 정보 수정
 * ✅ DELETE /users/:id: 사용자 삭제
 *
 * Relations 기능 (구현 필요):
 * □ user.repository.js에서 findUserWithPosts 함수 구현
 * □ GET /users/:id/posts: 사용자와 작성한 게시글 함께 조회
 *
 * 💡 핵심 개념:
 * - include: 관련 데이터를 함께 조회하기
 * - 한 번의 쿼리로 필요한 모든 데이터 가져오기
 */
