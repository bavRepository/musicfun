import { useGetMeQuery } from '@/features/auth/api/authApi.ts'
import { useFetchPlaylistsQuery } from '@/features/playlists/api/playListsApi.ts'
import { PlaylistList } from '@/features/playlists/ui/PlaylistList/PlaylistList.tsx'
import { CreatePlaylistForm } from '@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx'
import s from './profilePage.module.css'
import { Navigate } from 'react-router'
import { Path } from '@/common/routing'

export const ProfilePage = () => {
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery()

  const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery(
    {
      userId: meResponse?.userId,
    },
    { skip: !meResponse?.userId },
  )
  if (isLoading || isMeLoading) return <h1>Skeleton loader . . .</h1>
  if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />
  return (
    <div>
      <h1>{meResponse?.login} page</h1>
      <div className={s.container}>
        <CreatePlaylistForm />
        <PlaylistList isPlaylistsLoading={isLoading} playlists={playlistsResponse?.data || []} />
      </div>
    </div>
  )
}
