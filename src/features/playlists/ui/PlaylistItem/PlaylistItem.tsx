import type { PlaylistData } from '@/features/playlists/api/playlistsApi.types.ts'
import { PlaylistCover } from '@/features/playlists/ui/PlaylistItem/PlaylistCover/PlaylistCover.tsx'
import { PlaylistDescription } from '@/features/playlists/ui/PlaylistItem/PlaylistDescription/PlaylistDescription.tsx'

type Props = {
  playlist: PlaylistData
  editPlaylist: (playlist: PlaylistData) => void
  deletePlayList: (playlistId: string) => void
}
export const PlaylistItem = (props: Props) => {
  const { playlist, editPlaylist, deletePlayList } = props

  return (
    <div>
      <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images} />
      <PlaylistDescription attributes={playlist.attributes} />
      <button onClick={() => editPlaylist(playlist)}>UPDATE</button>
      <button onClick={() => deletePlayList(playlist.id)}>DELETE</button>
    </div>
  )
}
