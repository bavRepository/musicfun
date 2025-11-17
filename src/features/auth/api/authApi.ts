import { baseApi } from '@/app/api/baseApi.ts'
import type { LoginArgs, MeResponse } from '@/features/auth/api/authApit.types.ts'
import { AUTH_KEYS } from '@/common/constants'
import { withZodCatch } from '@/common/utils'
import { loginResponseSchema, meResponseSchema } from '@/features/auth/model/auth.schemas.ts'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
      ...withZodCatch(meResponseSchema),
      providesTags: ['Auth'],
    }),
    login: build.mutation({
      query: (payload: LoginArgs) => {
        return {
          method: 'post',
          url: 'auth/login',
          body: { ...payload, accessTokenTTL: '30m' },
        }
      },
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        const { data } = await queryFulfilled
        localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
        localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)

        // Следом пойдет ми запрос когда залогинюсь
        dispatch(baseApi.util.invalidateTags(['Auth']))
      },
      ...withZodCatch(loginResponseSchema),
    }),
    logout: build.mutation<void, void>({
      query: () => {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
        return {
          method: 'post',
          url: 'auth/logout',
          body: { refreshToken },
        }
      },
      onQueryStarted: async (_args, { dispatch, queryFulfilled }) => {
        await queryFulfilled
        localStorage.removeItem(AUTH_KEYS.accessToken)
        localStorage.removeItem(AUTH_KEYS.refreshToken)
        dispatch(baseApi.util.resetApiState())
      },
    }),
  }),
})

export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = authApi
