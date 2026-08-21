import type { SongSummary } from '../model/types';
import { SongListItem } from './song-list-item';

export function SongList({ songs }: { songs: SongSummary[] }) {
  return (
    <ol className="divide-y divide-stroke-neutral-muted bg-bg-layer-default">
      {songs.map(song => <SongListItem key={song.songHash} song={song} />)}
    </ol>
  );
}
