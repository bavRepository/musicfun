import { baseApi } from '@/app/api/baseApi.ts'
import type { FetchTracksResponse } from '@/features/tracks/api/tracksApi.types.ts'
import { fetchTracksResponseSchema } from '@/features/tracks/model/tracks.schemas.ts'
import { withZodCatch } from '@/common/utils'

// export const tracksApi = baseApi.injectEndpoints({
//   endpoints: (build) => ({
//     fetchTracks: build.infiniteQuery<FetchTracksResponse, void, string | undefined>({
//       infiniteQueryOptions: {
//         initialPageParam: undefined,
//         getNextPageParam: (lastPage) => {
//           return lastPage.meta.nextCursor || undefined
//         },
//       },gePa
//       query: ({ param }) => {
//         return {
//           url: 'playlists/tracks',
//           params: { cursor: pageParam, pageSize: 5, paginationType: 'cursor' },
//         }
//       },
//     }),
//   }),
// })

export const tracksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchTracks: build.infiniteQuery<FetchTracksResponse, void, number>({
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
          return lastPageParam < (lastPage.meta as { pagesCount: number }).pagesCount ? lastPageParam + 1 : undefined
        },
      },
      query: ({ pageParam }) => {
        return {
          url: 'playlists/tracks',
          params: { pageNumber: pageParam, pageSize: 5, paginationType: 'offset' },
        }
      },
      ...withZodCatch(fetchTracksResponseSchema),
    }),
  }),
})
export const { useFetchTracksInfiniteQuery } = tracksApi
