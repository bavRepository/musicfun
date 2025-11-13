import { useFetchTracksInfiniteQuery } from '@/features/tracks/api/tracksApi.ts'
import { useInfiniteScroll } from '@/common/hooks'
import { TrackList } from '@/features/tracks/ui/TrackList/TrackList.tsx'
import { LoadingTrigger } from '@/features/tracks/ui/LoadingTrigger/LoadingTrigger.tsx'

export const TracksPage = () => {
  // const { data } = useFetchTracksInfiniteQuery({ paginationType: 'cursor', pageSize: 5 })

  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } = useFetchTracksInfiniteQuery()

  const { observerRef } = useInfiniteScroll({ fetchNextPage, hasNextPage, isFetching })

  const pages = data?.pages.flatMap((page) => page.data) || []

  return (
    <div>
      <h1>Tracks page</h1>
      <TrackList tracks={pages} />
      {hasNextPage && <LoadingTrigger observerRef={observerRef} isFetchingNextPage={isFetchingNextPage} />}

      {!hasNextPage && pages.length > 0 && <p>Nothing to load...</p>}
    </div>
  )
}
