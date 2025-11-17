import * as z from 'zod'

export const meResponseSchema = z.object({
  userId: z.string(),
  login: z.string(),
})

export const meRequestSchema = z.void()

export const loginResponseSchema = z.object({
  refreshToken: z.jwt(),
  accessToken: z.jwt(),
})
