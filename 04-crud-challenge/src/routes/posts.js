import express from 'express';
// TODO: post.repository.js에서 postRepository 객체를 import 하세요
// import { postRepository } from '../repository/post.repository.js';

const postsRouter = express.Router();

/**
 * 📋 TODO: Post API 엔드포인트들을 구현해주세요!
 *
 * 아래 5가지 RESTful API 엔드포인트를 하나씩 구현해보세요.
 * post.repository.js의 함수들을 먼저 구현한 후 이 파일을 작성하세요.
 */

// POST /posts - 새 게시글 생성
postsRouter.post('/', async (req, res) => {
  try {
    // TODO: 1. req.body에서 게시글 데이터를 받아오세요
    // TODO: 2. postRepository.createPost()를 호출하여 게시글을 생성하세요
    // TODO: 3. 201 상태코드와 함께 생성된 게시글 정보를 반환하세요

    res.status(501).json({
      error: 'POST /posts 엔드포인트를 구현해주세요!',
      hint: 'postRepository.createPost(req.body)를 사용하세요',
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /posts - 모든 게시글 조회
postsRouter.get('/', async (req, res) => {
  try {
    // TODO: 1. postRepository.findAllPosts()를 호출하여 모든 게시글을 조회하세요
    // TODO: 2. 200 상태코드와 함께 게시글 목록을 반환하세요

    res.status(501).json({
      error: 'GET /posts 엔드포인트를 구현해주세요!',
      hint: 'postRepository.findAllPosts()를 사용하세요',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /posts/:id - 특정 게시글 조회
postsRouter.get('/:id', async (req, res) => {
  try {
    // TODO: 1. req.params.id에서 게시글 ID를 받아오세요
    // TODO: 2. postRepository.findPostById()를 호출하여 게시글을 조회하세요
    // TODO: 3. 게시글이 없으면 404, 있으면 200과 게시글 정보를 반환하세요

    res.status(501).json({
      error: 'GET /posts/:id 엔드포인트를 구현해주세요!',
      hint: 'postRepository.findPostById(req.params.id)를 사용하세요',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /posts/:id - 게시글 수정
postsRouter.put('/:id', async (req, res) => {
  try {
    // TODO: 1. req.params.id에서 게시글 ID를 받아오세요
    // TODO: 2. req.body에서 수정할 데이터를 받아오세요
    // TODO: 3. postRepository.updatePost()를 호출하여 게시글을 수정하세요
    // TODO: 4. 200 상태코드와 함께 수정된 게시글 정보를 반환하세요

    res.status(501).json({
      error: 'PUT /posts/:id 엔드포인트를 구현해주세요!',
      hint: 'postRepository.updatePost(req.params.id, req.body)를 사용하세요',
    });
  } catch (error) {
    // Prisma 에러 처리: 존재하지 않는 레코드
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '존재하지 않는 게시글입니다.' });
    }
    res.status(400).json({ error: error.message });
  }
});

// DELETE /posts/:id - 게시글 삭제
postsRouter.delete('/:id', async (req, res) => {
  try {
    // TODO: 1. req.params.id에서 게시글 ID를 받아오세요
    // TODO: 2. postRepository.deletePost()를 호출하여 게시글을 삭제하세요
    // TODO: 3. 204 상태코드를 반환하세요

    res.status(501).json({
      error: 'DELETE /posts/:id 엔드포인트를 구현해주세요!',
      hint: 'postRepository.deletePost(req.params.id)를 사용하세요',
    });
  } catch (error) {
    // Prisma 에러 처리: 존재하지 않는 레코드
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '존재하지 않는 게시글입니다.' });
    }
    res.status(400).json({ error: error.message });
  }
});

/**
 * 🎯 구현 완료 후 체크리스트:
 *
 * □ POST /posts: 새 게시글 생성 (201 Created)
 * □ GET /posts: 모든 게시글 조회 (200 OK)
 * □ GET /posts/:id: 특정 게시글 조회 (200 OK | 404 Not Found)
 * □ PUT /posts/:id: 게시글 수정 (200 OK | 404 Not Found)
 * □ DELETE /posts/:id: 게시글 삭제 (204 No Content | 404 Not Found)
 *
 * 💡 테스트 방법:
 * 1. Postman이나 다른 API 테스트 도구를 사용하세요
 * 2. 각 엔드포인트를 순서대로 테스트해보세요
 * 3. 에러 상황(존재하지 않는 ID 등)도 테스트해보세요
 */
