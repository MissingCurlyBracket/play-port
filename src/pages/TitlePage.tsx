import type { Source } from '../api/TitleApi/TitleApi.ts';

export interface TitlePageProps {
  sources?: Source[];
}

export default function TitlePage({ sources }: TitlePageProps) {
  return (
    <div>
      {sources?.map((source) => (
        <div key={source.source_id}>
          <h2>{source.name}</h2>
          <p>Type: {source.type}</p>
          <p>Region: {source.region}</p>
          <p>Format: {source.format}</p>
          {source.price && <p>Price: ${source.price.toFixed(2)}</p>}
          {source.seasons && <p>Seasons: {source.seasons}</p>}
          {source.episodes && <p>Episodes: {source.episodes}</p>}
          <a href={source.web_url} target="_blank" rel="noopener noreferrer">
            Watch Now
          </a>
        </div>
      ))}
    </div>
  );
}
