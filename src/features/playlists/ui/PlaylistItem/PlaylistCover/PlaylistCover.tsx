import s from './PlaylistCover.module.css'
import type { ChangeEvent } from 'react'
import {
  useDeletePlayListCoverMutation,
  useUploadPlayListCoverMutation,
} from '@/features/playlists/api/playListsApi.ts'
import type { Images } from '@/common/types'
import defaultCover from '@/assets/images/default-playlist-cover.png'
import { errorToast } from '@/common/utils'

type Props = { playlistId: string; images: Images | undefined }
export const PlaylistCover = ({ playlistId, images }: Props) => {
  const [uploadPlayListCover] = useUploadPlayListCoverMutation()
  const [deletePlayListCover] = useDeletePlayListCoverMutation()

  const originalCover = images?.main?.find((img) => img.type === 'original')
  const src = originalCover ? originalCover?.url : defaultCover

  const uploadCoverHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif']
    const maxSize = 1024 * 1024 // 1 MB

    const file = e.target.files?.length && e.target.files[0]
    if (!file) return

    if (!allowedTypes.includes(file.type)) {
      errorToast('Invalid file type. Only JPEG, PNG or GIF images are allowed')
      return
    }

    if (file.size > maxSize) {
      errorToast(`The file is too large. Max size is ${Math.round(maxSize / 1024)} KB`)
      return
    }

    uploadPlayListCover({
      playlistId,
      file,
    })
  }

  const deleteCoverHandler = () => {
    deletePlayListCover({ playlistId })
  }

  return (
    <>
      <img src={src} alt={'cover'} width={'240px'} className={s.cover} />
      <input type='file' onChange={uploadCoverHandler} accept={'image/jpeg,image/png,image/gif'} />
      {originalCover && <button onClick={deleteCoverHandler}>Delete cover</button>}
    </>
  )
}
