import type { Source } from '../api/TitleApi/TitleApi.ts';
import SourceCard from '../components/SourceCard.tsx';

export interface TitlePageProps {
  sources?: Source[];
}

export default function TitlePage({ sources }: TitlePageProps) {
  return (
    <div className={'source-card ml-15'}>
      {sources
        ?.sort((a, b) => (b.seasons ?? 0) - (a.seasons ?? 0))
        .map((source) => (
          <SourceCard
            name={source.name}
            url={source.web_url}
            nrOfSeasons={source.seasons}
            format={source.format}
          />
        ))}
    </div>
  );
}
