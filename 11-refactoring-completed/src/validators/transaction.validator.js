import { z } from 'zod';

export const createPostWithCommentSchema = z.object({
  authorId: z.number().int('유효한 작성자 ID가 아닙니다.'),
  title: z.string().min(1, '게시글 제목을 입력해주세요.'),
  content: z.string().min(1, '게시글 내용을 입력해주세요.'),
  commentContent: z.string().min(1, '댓글 내용을 입력해주세요.'),
});
