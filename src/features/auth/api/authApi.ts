import { baseApi } from '@/app/api/BaseApi.ts'
import type { MeResponse } from '@/features/auth/api/authApit.types.ts'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
    }),
  }),
})

export const { useGetMeQuery } = authApi
