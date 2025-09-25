import { prisma } from './index.js';

// 기본 CRUD 함수들 (04-crud에서 학습한 내용)
async function createPost(data) {
  return await prisma.post.create({ data });
}

async function findPostById(id) {
  return await prisma.post.findUnique({ where: { id } });
}

async function findAllPosts() {
  return await prisma.post.findMany();
}

async function updatePost(id, data) {
  return await prisma.post.update({ where: { id }, data });
}

async function deletePost(id) {
  return await prisma.post.delete({ where: { id } });
}

/**
 * 📋 TODO: 간단한 Relations 기능을 구현해보세요!
 */

// TODO: 게시글 조회 (작성자 정보 포함)
async function findPostWithAuthor(id) {
  // TODO: include를 사용하여 게시글과 작성자 정보를 함께 조회하세요
  // 힌트: include: { author: true }
  throw new Error('findPostWithAuthor 함수를 구현해주세요!');
}

// TODO: 게시글 조회 (댓글 목록 포함)
async function findPostWithComments(id) {
  // TODO: include를 사용하여 게시글과 댓글 목록을 함께 조회하세요
  // 힌트: include: { comments: true }
  throw new Error('findPostWithComments 함수를 구현해주세요!');
}

export const postRepository = {
  createPost,
  findPostById,
  findAllPosts,
  updatePost,
  deletePost,

  // Relations 기능 (05-relations에서 학습) - 간단한 것들만!
  findPostWithAuthor,
  findPostWithComments,
};

/**
 * 🎯 Relations 연습 포인트:
 *
 * 1. 단순 include:
 *    - { include: { author: true } }
 *
 * 2. 선택적 include:
 *    - { include: { author: { select: { id: true, email: true } } } }
 *
 * 3. Nested include:
 *    - { include: { comments: { include: { author: true } } } }
 *
 * 4. 조건부 필터링:
 *    - { where: { authorId: userId, published: true } }
 *
 * 💡 참고: schema.prisma의 관계 정의를 확인하세요!
 */
