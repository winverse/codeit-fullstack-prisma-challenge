import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 시딩 시작...');

  // TODO: 여기에 시딩 코드를 작성하세요
  // 1. User 데이터 생성 (3-5명)
  // 2. Post 데이터 생성 (각 유저가 1-3개)
  // 3. Comment 데이터 생성 (각 포스트마다 0-5개)

  console.log('✅ 데이터 시딩 완료');
}

main()
  .catch((e) => {
    console.error('❌ 시딩 에러:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
