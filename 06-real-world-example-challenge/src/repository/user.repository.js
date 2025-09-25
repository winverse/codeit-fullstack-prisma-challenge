import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// 새 사용자 생성
async function createUser(data) {
  return await prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
    },
  });
}

// 모든 사용자 조회
async function findAllUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

// ID로 특정 사용자 조회
async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id: Number(id) },
  });
}

// 사용자와 게시글 함께 조회
async function findUserWithPosts(id) {
  return await prisma.user.findUnique({
    where: { id: Number(id) },
    include: {
      posts: true,
    },
  });
}

// 사용자 정보 수정
async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id: Number(id) },
    data: {
      email: data.email,
      name: data.name,
    },
  });
}

// 사용자 삭제
async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id: Number(id) },
  });
}

export const userRepository = {
  createUser,
  findAllUsers,
  findUserById,
  findUserWithPosts,
  updateUser,
  deleteUser,
};