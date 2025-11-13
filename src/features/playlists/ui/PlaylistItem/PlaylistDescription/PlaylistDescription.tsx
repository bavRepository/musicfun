import type { PlaylistAttributes } from '@/features/playlists/api/playlistsApi.types.ts'
import s from './PlaylistDescription.module.css'

type Props = { attributes: PlaylistAttributes }
export const PlaylistDescription = ({ attributes }: Props) => {
  return (
    <>
      <div>title: {attributes.title}</div>
      <div className={s.desc}>description: {attributes.description}</div>
      <div>userName: {attributes.user.name}</div>
    </>
  )
}
