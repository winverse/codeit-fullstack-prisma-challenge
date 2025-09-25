import express from 'express';
import { userRepository } from '../repository/user.repository.js';

export const usersRouter = express.Router();

// POST /users - 새 사용자 생성
usersRouter.post('/', async (req, res) => {
  try {
    const newUser = await userRepository.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /users - 모든 사용자 조회
usersRouter.get('/', async (req, res) => {
  try {
    const users = await userRepository.findAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /users/:id - 특정 사용자 조회
usersRouter.get('/:id', async (req, res) => {
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

// GET /users/:id/posts - 사용자의 게시글 목록 조회
usersRouter.get('/:id/posts', async (req, res) => {
  try {
    const userWithPosts = await userRepository.findUserWithPosts(req.params.id);
    if (!userWithPosts) {
      return res.status(404).json({ error: '사용자를 찾을 수 없습니다.' });
    }
    res.json(userWithPosts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /users/:id - 사용자 정보 수정
usersRouter.put('/:id', async (req, res) => {
  try {
    const updatedUser = await userRepository.updateUser(req.params.id, req.body);
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE /users/:id - 사용자 삭제
usersRouter.delete('/:id', async (req, res) => {
  try {
    await userRepository.deleteUser(req.params.id);
    res.json({ message: '사용자가 성공적으로 삭제되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});