import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistUpdatedEvent,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import { baseApi } from '@/app/api/baseApi.ts'
import { playlistCreateResponseSchema, playlistsResponseSchema } from '@/features/playlists/model/playlist.shemas.ts'
import { imagesSchema } from '@/common/shemas'
import { withZodCatch } from '@/common/utils'
import { io } from 'socket.io-client'
import { SOCKET_EVENTS } from '@/common/constants'
import { subscribeToEvent } from '@/common/socket'

export const playListsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
    // удалим типизацию так как у нас уже есть responseSchema и перенесем аргументы
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => {
        return {
          url: 'playlists',
          params,
        }
      },
      ...withZodCatch(playlistsResponseSchema),
      keepUnusedDataFor: 0,
      // Сразу попадем сюда по аналогии с query стартед
      onCacheEntryAdded: async (_arg, { cacheDataLoaded, updateCachedData, cacheEntryRemoved }) => {
        await cacheDataLoaded

        const unsubscribes = [
          subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, (msg) => {
            const newPlaylist = msg.payload.data
            updateCachedData((state) => {
              state.data.pop()
              state.data.unshift(newPlaylist)
              state.meta.totalCount = state.meta.totalCount + 1
              state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
            })
          }),
          subscribeToEvent<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, (msg) => {
            const newPlaylist = msg.payload.data
            updateCachedData((state) => {
              const index = state.data.findIndex((playlist) => playlist.id === newPlaylist.id)
              if (index !== -1) state.data[index] = { ...state.data[index], ...newPlaylist }
            })
          }),
        ]

        const socket = io(import.meta.env.VITE_SOCKET_URL, {
          path: '/api/1.0/ws/',

          transports: ['websocket'],
        })

        // Подписка на сокет
        socket.on('connect', () => {
          console.log('Connected to server')
        })

        // Вызовится когда подписка на кеэ будет не активна
        await cacheEntryRemoved
        // Отписка
        unsubscribes.forEach((unsubscribe) => unsubscribe())
        // Отписка от сокета ниже мы вынесли в функцию unsubscribe()
        // socket.on('disconnect', () => {
        //   console.log('Disconnected from server')
        // })
        // Только добавим ещё свойство  keepUnusedDataFor: 0, не глобально а именно запросу  наверх чтобы зачистить кэш сразу после размонтирования иначе придеться ждать 60 сек когда будет добавляться плейлист чтобы обновился кэш
      },
      // skipSchemaValidation: process.env.NODE_ENV === 'development',
      providesTags: ['Playlist'],
    }),
    createPlayList: build.mutation({
      query: (body: CreatePlaylistArgs) => ({
        method: 'post',
        url: `playlists`,
        body,
      }),
      ...withZodCatch(playlistCreateResponseSchema),
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
    uploadPlayListCover: build.mutation({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return { method: 'post', url: `playlists/${playlistId}/images/main`, body: formData }
      },
      ...withZodCatch(imagesSchema),
      responseSchema: imagesSchema,
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
