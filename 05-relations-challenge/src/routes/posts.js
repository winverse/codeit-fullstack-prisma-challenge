import express from 'express';
import { postRepository } from '../repository/post.repository.js';

const router = express.Router();

/**
 * 기본 CRUD API (04-crud에서 학습한 내용)
 * 이미 구현되어 있습니다.
 */

// POST /posts - 새 게시글 생성
router.post('/', async (req, res) => {
  try {
    const newPost = await postRepository.createPost(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET /posts - 모든 게시글 조회
router.get('/', async (req, res) => {
  try {
    const posts = await postRepository.findAllPosts();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /posts/:id - 특정 게시글 조회
router.get('/:id', async (req, res) => {
  try {
    const post = await postRepository.findPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: '존재하지 않는 게시글입니다.' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /posts/:id - 게시글 수정
router.put('/:id', async (req, res) => {
  try {
    const updatedPost = await postRepository.updatePost(
      req.params.id,
      req.body,
    );
    res.json(updatedPost);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '존재하지 않는 게시글입니다.' });
    }
    res.status(400).json({ error: error.message });
  }
});

// DELETE /posts/:id - 게시글 삭제
router.delete('/:id', async (req, res) => {
  try {
    await postRepository.deletePost(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '존재하지 않는 게시글입니다.' });
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

// GET /posts/:id/with-author - 게시글과 작성자 정보 함께 조회
router.get('/:id/with-author', async (req, res) => {
  try {
    // TODO: postRepository.findPostWithAuthor()를 사용하여 구현하세요

    res.status(501).json({
      error: 'GET /posts/:id/with-author 엔드포인트를 구현해주세요!',
      hint: 'postRepository.findPostWithAuthor(req.params.id)를 사용하세요',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /posts/:id/with-comments - 게시글과 댓글 정보 함께 조회
router.get('/:id/with-comments', async (req, res) => {
  try {
    // TODO: postRepository.findPostWithComments()를 사용하여 구현하세요

    res.status(501).json({
      error: 'GET /posts/:id/with-comments 엔드포인트를 구현해주세요!',
      hint: 'postRepository.findPostWithComments(req.params.id)를 사용하세요',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export const postsRouter = router;

/**
 * 🎯 간단한 Relations API 체크리스트:
 *
 * 기본 CRUD (이미 완료):
 * ✅ POST /posts: 새 게시글 생성
 * ✅ GET /posts: 모든 게시글 조회
 * ✅ GET /posts/:id: 특정 게시글 조회
 * ✅ PUT /posts/:id: 게시글 수정
 * ✅ DELETE /posts/:id: 게시글 삭제
 *
 * Relations 기능 (구현 필요):
 * □ GET /posts/:id/with-author: 게시글 + 작성자 정보
 * □ GET /posts/:id/with-comments: 게시글 + 댓글 목록
 *
 * 💡 핵심 개념:
 * - include: 관련 데이터를 함께 조회하기
 * - 한 번의 쿼리로 필요한 모든 데이터 가져오기
 */
