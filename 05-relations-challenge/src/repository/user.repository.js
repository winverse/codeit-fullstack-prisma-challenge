import { prisma } from './index.js';

async function createUser(data) {
  return await prisma.user.create({ data });
}

async function findUserById(id) {
  return await prisma.user.findUnique({ where: { id } });
}

async function findAllUsers() {
  return await prisma.user.findMany();
}

async function updateUser(id, data) {
  return await prisma.user.update({ where: { id }, data });
}

async function deleteUser(id) {
  return await prisma.user.delete({ where: { id } });
}

/**
 * 📋 TODO: 간단한 Relations 기능을 구현해보세요!
 */

async function findUserWithPosts(id) {}

export const userRepository = {
  createUser,
  findUserById,
  findAllUsers,
  updateUser,
  deleteUser,
  findUserWithPosts,
};
