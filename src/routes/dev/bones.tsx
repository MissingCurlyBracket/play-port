import { createFileRoute } from '@tanstack/react-router';
import { Skeleton } from 'boneyard-js/react';
import BaseBox from '../../components/atoms/BaseBox.tsx';
import TitleItem from '../../components/molecules/TitleItem.tsx';
import SourceItem from '../../components/molecules/SourceItem.tsx';
import type { SearchResult } from '../../api/SearchApi.ts';

export const Route = createFileRoute('/dev/bones')({
  component: BonesCaptureRoute,
});

const fixtureTitle: SearchResult = {
  id: 1,
  title: 'The Shape of Skeleton Cards',
  overview:
    'A long enough description to fill the three-line clamp so boneyard captures the full text rectangle and predicts where the overview will sit while data is loading from the network.',
  release_date: '2013',
  media_type: 'movie',
  poster_url:
    'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg',
};

const fixtureProvider = {
  name: 'Streaming Service',
};

export function BonesCaptureRoute() {
  return (
    <BaseBox
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        alignItems: 'flex-start',
      }}
    >
      <BaseBox
        sx={{
          width: '100%',
          maxWidth: 820,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          '& .MuiCardContent-root:last-child': { paddingBottom: 2 },
        }}
      >
        <Skeleton name="title-item" loading={false}>
          <TitleItem title={fixtureTitle} interactive={false} />
        </Skeleton>
      </BaseBox>

      <BaseBox
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: 2,
          width: '100%',
          maxWidth: 1152,
        }}
      >
        <Skeleton name="source-item" loading={false}>
          <SourceItem name={fixtureProvider.name} />
        </Skeleton>
      </BaseBox>
    </BaseBox>
  );
}
