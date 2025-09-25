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

// 모든 게시글 조회 (작성자 정보 포함)
async function findAllPosts() {
  return await prisma.post.findMany({
    include: {
      author: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

// ID로 특정 게시글 조회 (작성자와 댓글 포함)
async function findPostById(id) {
  return await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      author: true,
      comments: {
        include: {
          author: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
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

export const postRepository = {
  createPost,
  findAllPosts,
  findPostById,
  updatePost,
  deletePost,
};