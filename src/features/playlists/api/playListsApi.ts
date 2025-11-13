import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import { baseApi } from '@/app/api/BaseApi'
import type { Images } from '@/common/types'

export const playListsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query: (params) => {
        return {
          url: 'playlists',
          params,
        }
      },
      providesTags: ['Playlist'],
    }),
    createPlayList: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({
        method: 'post',
        url: `playlists`,
        body,
      }),
      invalidatesTags: ['Playlist'],
    }),
    deletePlayList: build.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({
        method: 'delete',
        url: `playlists/${playlistId}`,
      }),
      invalidatesTags: ['Playlist'],
    }),
    updatePlayList: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({
        method: 'put',
        url: `playlists/${playlistId}`,
        body,
      }),
      async onQueryStarted({ playlistId, body }, { dispatch, queryFulfilled, getState }) {
        const args = playListsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

        const patchResults: any[] = []

        args.forEach((arg) => {
          patchResults.push(
            dispatch(
              playListsApi.util.updateQueryData(
                // название эндпоинта, в котором нужно обновить кэш
                'fetchPlaylists',
                // аргументы для эндпоинта
                { pageNumber: arg.pageNumber, pageSize: arg.pageSize, search: arg.search },
                // `updateRecipe` - коллбэк для обновления закэшированного стейта мутабельным образом
                (state) => {
                  const index = state.data.findIndex((playlist) => playlist.id === playlistId)
                  if (index !== -1) {
                    state.data[index].attributes = { ...state.data[index].attributes, ...body }
                  }
                },
              ),
            ),
          )
        })

        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((pathResult) => {
            pathResult.undo()
          })
        }
      },
      invalidatesTags: ['Playlist'],
    }),
    uploadPlayListCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return { method: 'post', url: `playlists/${playlistId}/images/main`, body: formData }
      },
      invalidatesTags: ['Playlist'],
    }),
    deletePlayListCover: build.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => {
        return { method: 'delete', url: `playlists/${playlistId}/images/main` }
      },
      invalidatesTags: ['Playlist'],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlayListMutation,
  useDeletePlayListMutation,
  useUpdatePlayListMutation,
  useUploadPlayListCoverMutation,
  useDeletePlayListCoverMutation,
} = playListsApi
