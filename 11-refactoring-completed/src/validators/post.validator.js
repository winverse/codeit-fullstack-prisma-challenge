import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.'),
  content: z.string().min(1, '내용을 입력해주세요.'),
  authorId: z.number().int('유효한 사용자 ID가 아닙니다.'),
});

export const updatePostSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').optional(),
  content: z.string().min(1, '내용을 입력해주세요.').optional(),
});
