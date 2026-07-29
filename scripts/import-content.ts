import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { getAdminClient, type ContentFile } from './shared';

const filePath = resolve(process.argv[2] || 'data/content.example.json');
const supabase = getAdminClient();

const raw = await readFile(filePath, 'utf8');
const content = JSON.parse(raw) as ContentFile;

for (const song of content.songs) {
  const { lyrics_lines: lines = [], ...songFields } = song;
  const { data: upsertedSong, error: songError } = await supabase
    .from('songs')
    .upsert(
      {
        ...songFields,
        cover_url: songFields.cover_url || null,
        youtube_music_url: songFields.youtube_music_url || null,
        spotify_url: songFields.spotify_url || null,
        apple_music_url: songFields.apple_music_url || null,
        soundcloud_url: songFields.soundcloud_url || null,
      },
      { onConflict: 'slug' },
    )
    .select('id')
    .single();

  if (songError) throw new Error(songError.message);

  for (const line of lines) {
    const { annotations = [], ...lineFields } = line;
    const { data: upsertedLine, error: lineError } = await supabase
      .from('lyrics_lines')
      .upsert(
        {
          ...lineFields,
          song_id: upsertedSong.id,
        },
        { onConflict: 'song_id,line_number' },
      )
      .select('id')
      .single();

    if (lineError) throw new Error(lineError.message);

    const { error: deleteError } = await supabase.from('annotations').delete().eq('line_id', upsertedLine.id);
    if (deleteError) throw new Error(deleteError.message);

    if (annotations.length > 0) {
      const { error: annotationError } = await supabase.from('annotations').insert(
        annotations.map((annotation) => ({
          ...annotation,
          line_id: upsertedLine.id,
        })),
      );
      if (annotationError) throw new Error(annotationError.message);
    }
  }
}

console.log(`Imported ${content.songs.length} song(s) from ${filePath}`);
