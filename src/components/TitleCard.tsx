import type { ReactElement } from 'react';
import type { Title } from '../api/TitleApi/TitleApi.ts';

interface TitleCardProps {
  title: Title;
}

export default function TitleCard({
  title,
}: Readonly<TitleCardProps>): ReactElement {
  return (
    <li className="title-card">
      <div className="title-card-content">
        <h3 className="title-name">{title.name}</h3>
        <div className="title-details">
          <span className="title-type">{title.type}</span>
          <span className="title-year">({title.year})</span>
        </div>
        <div className="title-ids">
          {title.imdb_id && (
            <a
              href={`https://www.imdb.com/title/${title.imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              IMDb
            </a>
          )}
          {title.tmdb_id && (
            <a
              href={`https://www.themoviedb.org/${title.tmdb_type}/${title.tmdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              TMDB
            </a>
          )}
        </div>
      </div>
    </li>
  );
}
