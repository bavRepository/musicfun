import { EditPlayListForm } from '@/features/playlists/ui/EditPlaylistForm/EditPlayListForm.tsx'
import { PlaylistItem } from '@/features/playlists/ui/PlaylistItem/PlaylistItem.tsx'
import { useState } from 'react'
import type { PlaylistData, UpdatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types.ts'
import { useDeletePlayListMutation } from '@/features/playlists/api/playListsApi.ts'
import { useForm } from 'react-hook-form'
import s from './playlistList.module.css'

type Props = {
  isPlaylistsLoading: boolean
  playlists: PlaylistData[]
  search?: string
}
export const PlaylistList = ({ playlists, isPlaylistsLoading, search }: Props) => {
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const [deletePlayList] = useDeletePlayListMutation()
  const { reset, handleSubmit, register } = useForm<UpdatePlaylistArgs>()

  const deletePlayListHandler = (playlistId: string) => {
    if (confirm('Are you sure you want to delete this playlist?')) {
      deletePlayList({ playlistId })
    }
  }

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id)
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map((tag) => tag.id),
      })
    } else {
      setPlaylistId(null)
    }
  }

  return (
    <div className={s.items}>
      {!playlists.length && !isPlaylistsLoading && <h2>No playlists found by {search} search😒</h2>}
      {playlists.map((playlist) => {
        const isEditing = playlist.id === playlistId

        return (
          <div className={s.item} key={playlist.id}>
            {isEditing ? (
              <EditPlayListForm
                editPlaylist={editPlaylistHandler}
                playlistId={playlistId}
                setPlaylistId={setPlaylistId}
                handleSubmit={handleSubmit}
                register={register}
              />
            ) : (
              <PlaylistItem
                playlist={playlist}
                editPlaylist={editPlaylistHandler}
                deletePlayList={deletePlayListHandler}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
