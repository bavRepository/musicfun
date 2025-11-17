import { type SubmitHandler, useForm } from 'react-hook-form'
import type { CreatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types.ts'
import { useCreatePlayListMutation } from '@/features/playlists/api/playListsApi.ts'

type CreatePlaylistFormType = {
  setCurrentPage?: (page: number) => void
}

export const CreatePlaylistForm = ({ setCurrentPage }: CreatePlaylistFormType) => {
  const { register, handleSubmit, reset } = useForm<CreatePlaylistArgs>()

  const [createPlayList] = useCreatePlayListMutation()

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = (data) => {
    createPlayList(data)
      .unwrap()
      .then(() => {
        setCurrentPage?.(1)
        reset()
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create new playlist</h2>
      <div>
        <input {...register('title')} placeholder={'title'} />
      </div>
      <div>
        <input {...register('description')} placeholder={'description'} />
      </div>
      <button>create playlist</button>
    </form>
  )
}
