import * as React from 'react';
import { type ReactElement, useState } from 'react';
import type { SearchResult } from '../api/SearchApi/SearchApi.ts';

interface MainPageProps {
  searchFn: (title: string) => Promise<SearchResult[]>;
}

export default function MainPage({
  searchFn,
}: Readonly<MainPageProps>): ReactElement {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchFn(searchTerm.trim());
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
        <button type="submit" className="search-button">
          Search
        </button>
      </form>
    </div>
  );
}
