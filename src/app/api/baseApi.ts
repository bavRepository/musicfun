import { createApi } from '@reduxjs/toolkit/query/react'
import { baseQueryWithReauth } from '@/app/api/baseQueryWithReauth.ts'

export const baseApi = createApi({
  reducerPath: 'baseApi',
  tagTypes: ['Playlist', 'Auth'],
  baseQuery: baseQueryWithReauth,
  refetchOnFocus: false,
  endpoints: () => ({}),
  // skipSchemaValidation: process.env.NODE_ENV === 'development',
})
console.log(process.env.NODE_ENV)
