import type { ReactElement } from 'react';
import type { Person } from '../api/SearchApi/SearchApi.ts';

interface PersonCardProps {
  person: Person;
}

export default function PersonCard({
  person,
}: Readonly<PersonCardProps>): ReactElement {
  return (
    <div className="person-card">
      <div className="person-card-content">
        <h3 className="person-name">{person.name}</h3>
        {person.main_profession && (
          <div className="person-profession">{person.main_profession}</div>
        )}
        <div className="person-ids">
          {person.imdb_id && (
            <a
              href={`https://www.imdb.com/name/${person.imdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              IMDb
            </a>
          )}
          {person.tmdb_id && (
            <a
              href={`https://www.themoviedb.org/person/${person.tmdb_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="external-link"
            >
              TMDB
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
