import { type SubmitHandler, type UseFormHandleSubmit, type UseFormRegister } from 'react-hook-form'
import type { UpdatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types.ts'
import { useUpdatePlayListMutation } from '@/features/playlists/api/playListsApi.ts'

type Props = {
  editPlaylist: (playlist: null) => void
  playlistId: string
  setPlaylistId: (playlistId: null) => void
  register: UseFormRegister<UpdatePlaylistArgs>
  handleSubmit: UseFormHandleSubmit<UpdatePlaylistArgs>
}
export const EditPlayListForm = (props: Props) => {
  const { editPlaylist, playlistId, setPlaylistId, register, handleSubmit } = props

  const [updatePlayList] = useUpdatePlayListMutation()

  const onSubmit: SubmitHandler<UpdatePlaylistArgs> = (body) => {
    if (!playlistId) return
    updatePlayList({ playlistId: playlistId, body })
    setPlaylistId(null)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Edit playlist</h2>
      <div>
        <input {...register('title')} placeholder={'title'} />
      </div>
      <div>
        <input {...register('description')} placeholder={'description'} />
      </div>
      <button type={'submit'}>save</button>
      <button type={'button'} onClick={() => editPlaylist(null)}>
        cancel
      </button>
    </form>
  )
}
