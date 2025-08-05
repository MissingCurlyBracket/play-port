import * as React from 'react';
import { type ReactElement, useState } from 'react';
import type { SearchResult } from '../api/SearchApi/SearchApi.ts';
import TitleCard from '../components/TitleCard.tsx';
import PersonCard from '../components/PersonCard.tsx';

interface MainPageProps {
  searchFn: (title: string) => Promise<SearchResult>;
}

export default function MainPage({
  searchFn,
}: Readonly<MainPageProps>): ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        const results = await searchFn(searchTerm.trim());
        setSearchResults(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="main-page">
      <h1>Search Movies & TV Shows</h1>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter movie or TV show title..."
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <div className="error-message">Error: {error}</div>}

      {searchResults && (
        <div className="search-results">
          {searchResults.title_results.length > 0 && (
            <section className="titles-section">
              <h2>Titles ({searchResults.title_results.length})</h2>
              <ul className="results-list">
                {searchResults.title_results.map((title) => (
                  <TitleCard key={title.id} title={title} />
                ))}
              </ul>
            </section>
          )}

          {searchResults.people_results.length > 0 && (
            <section className="people-section">
              <h2>People ({searchResults.people_results.length})</h2>
              <ul className="results-list">
                {searchResults.people_results.map((person) => (
                  <PersonCard key={person.id} person={person} />
                ))}
              </ul>
            </section>
          )}

          {searchResults.title_results.length === 0 &&
            searchResults.people_results.length === 0 && (
              <div className="no-results">
                No results found for "{searchTerm}"
              </div>
            )}
        </div>
      )}
    </div>
  );
}
