import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해주세요.'),
  authorId: z.number().int('유효한 사용자 ID가 아닙니다.'),
  postId: z.number().int('유효한 게시글 ID가 아닙니다.'),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, '댓글 내용을 입력해주세요.').optional(),
});
