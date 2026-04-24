import { type ReactElement, useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import type { SearchResult } from '../api/SearchApi.ts';
import type { Provider } from '../api/TitleApi.ts';
import type { Region } from '../api/RegionApi.ts';
import type { PopularTitle } from '../api/PopularApi.ts';
import { useDebounce } from 'use-debounce';
import SettingsIcon from '@mui/icons-material/Settings';
import BaseButton from '../components/atoms/BaseButton.tsx';
import BaseBox from '../components/atoms/BaseBox.tsx';
import BaseTypography from '../components/atoms/BaseTypography.tsx';
import TitleItem from '../components/molecules/TitleItem.tsx';
import SearchBar from '../components/molecules/SearchBar.tsx';
import SuggestionButtons from '../components/molecules/SuggestionButtons.tsx';
import PreferencesDialog from '../components/organisms/PreferencesDialog.tsx';
import MainPageTemplate from '../components/templates/MainPageTemplate.tsx';
import {
  getProvidersFromCookie,
  getRegionFromCookie,
} from '../utils/cookies.ts';

interface MainPageProps {
  searchFn: (title: string) => Promise<SearchResult[]>;
  getProviders: (params: { region: string }) => Promise<Provider[]>;
  getPopular: (params: {
    type: 'movie' | 'tv';
    region?: string;
    providers?: string;
  }) => Promise<PopularTitle[]>;
  regions: Region[];
  regionsLoading?: boolean;
  error: Error | null;
  backdropUrl?: string;
}

export default function MainPage({
  searchFn,
  getProviders,
  getPopular,
  regions,
  regionsLoading,
  error,
  backdropUrl,
}: Readonly<MainPageProps>): ReactElement {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [debouncedSearch] = useDebounce(searchTerm, 400);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [suggestLoading, setSuggestLoading] = useState<'movie' | 'tv' | null>(
    null,
  );
  const [suggestError, setSuggestError] = useState<Error | null>(null);
  const [hasSelectedProviders, setHasSelectedProviders] = useState<boolean>(
    () => {
      const p = getProvidersFromCookie();
      return !!p && p.length > 0;
    },
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRegion, setModalRegion] = useState<Region | null>(null);
  const [modalProviders, setModalProviders] = useState<Provider[]>([]);
  const [modalSelectedProviders, setModalSelectedProviders] = useState<
    Provider[]
  >([]);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )region=([^;]+)'));
    if (match) {
      const code = match[2];
      const found = regions.find((r) => r.code === code);
      if (found) setSelectedRegion(found);
    }
  }, [regions]);

  const handleOpenModal = async () => {
    setModalRegion(selectedRegion);
    setIsModalOpen(true);

    if (selectedRegion) {
      setModalLoading(true);
      try {
        const fetchedProviders = await getProviders({
          region: selectedRegion.code,
        });
        setModalProviders(fetchedProviders);

        const providerMatch = document.cookie.match(
          new RegExp('(^| )providers=([^;]+)'),
        );
        if (providerMatch) {
          const providerIds = providerMatch[2].split(',');
          const selected = fetchedProviders.filter((p) =>
            providerIds.includes(String(p.provider_id)),
          );
          setModalSelectedProviders(selected);
        } else {
          setModalSelectedProviders([]);
        }
      } catch (err) {
        console.error(err);
        setModalProviders([]);
        setModalSelectedProviders([]);
      } finally {
        setModalLoading(false);
      }
    } else {
      setModalProviders([]);
      setModalSelectedProviders([]);
    }
  };

  const handleModalRegionChange = async (newValue: Region | null) => {
    setModalRegion(newValue);
    setModalSelectedProviders([]);
    if (newValue) {
      setModalLoading(true);
      try {
        const fetched = await getProviders({ region: newValue.code });
        setModalProviders(fetched);
      } catch (err) {
        console.error(err);
        setModalProviders([]);
      } finally {
        setModalLoading(false);
      }
    } else {
      setModalProviders([]);
    }
  };

  const handleSaveSettings = () => {
    setSelectedRegion(modalRegion);

    if (modalRegion) {
      document.cookie = `region=${modalRegion.code}; path=/; max-age=31536000`;
    } else {
      document.cookie = `region=; path=/; max-age=0`;
    }

    if (modalSelectedProviders.length > 0) {
      const ids = modalSelectedProviders.map((p) => p.provider_id).join(',');
      document.cookie = `providers=${ids}; path=/; max-age=31536000`;
      setHasSelectedProviders(true);
    } else {
      document.cookie = `providers=; path=/; max-age=0`;
      setHasSelectedProviders(false);
    }

    setIsModalOpen(false);
  };

  const handleSuggest = async (type: 'movie' | 'tv') => {
    setSuggestError(null);
    setSuggestLoading(type);
    try {
      const region = getRegionFromCookie();
      const providers = getProvidersFromCookie();
      const results = await getPopular({ type, region, providers });
      const top10 = results.slice(0, 10);
      const pool = top10.length > 0 ? top10 : results;
      if (pool.length === 0) {
        setSuggestError(
          new Error(
            `No popular ${type === 'movie' ? 'movies' : 'TV shows'} available on your services right now. Try different providers.`,
          ),
        );
        return;
      }
      const picked = pool[Math.floor(Math.random() * pool.length)];
      navigate({
        to: '/title/$type/$id',
        params: { type, id: String(picked.id) },
      });
    } catch (e) {
      setSuggestError(e as Error);
    } finally {
      setSuggestLoading(null);
    }
  };

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const results = await searchFn(debouncedSearch.trim());
        setSearchResults(results);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch, searchFn]);

  return (
    <MainPageTemplate
      backdropUrl={backdropUrl}
      header={
        <BaseButton
          variant="outlined"
          color="primary"
          startIcon={<SettingsIcon />}
          onClick={handleOpenModal}
          sx={{
            backgroundColor: 'rgba(26, 20, 48, 0.6)',
            backdropFilter: 'blur(8px)',
            borderColor: 'rgba(169, 148, 222, 0.4)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.45)',
            transition:
              'border-color 160ms ease, box-shadow 160ms ease, color 160ms ease',
            '&:hover': {
              backgroundColor: 'rgba(26, 20, 48, 0.6)',
              borderColor: 'primary.main',
              boxShadow: '0 8px 36px rgba(140, 114, 208, 0.3)',
              color: 'primary.light',
            },
          }}
        >
          Preferences
        </BaseButton>
      }
      suggestionButtons={
        <SuggestionButtons
          onSuggest={handleSuggest}
          loadingType={suggestLoading}
          hasPreferences={!!selectedRegion && hasSelectedProviders}
        />
      }
      searchBar={
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          isLoading={isLoading}
          placeholder="Search for a movie or TV show..."
        />
      }
      preferencesDialog={
        <PreferencesDialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          regions={regions}
          regionsLoading={regionsLoading}
          modalRegion={modalRegion}
          onRegionChange={handleModalRegionChange}
          modalProviders={modalProviders}
          modalSelectedProviders={modalSelectedProviders}
          onProvidersChange={setModalSelectedProviders}
          modalLoading={modalLoading}
          onSave={handleSaveSettings}
        />
      }
      results={
        searchResults.length > 0 ? (
          <BaseBox
            sx={{
              width: '100%',
              maxWidth: 820,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'stretch',
              gap: 1.5,
            }}
          >
            {searchResults.map((title) => (
              <TitleItem key={title.id} title={title} />
            ))}
          </BaseBox>
        ) : (
          debouncedSearch &&
          !isLoading && (
            <BaseBox sx={{ textAlign: 'center', py: 4 }}>
              <BaseTypography variant="h6" color="text.secondary">
                No results found for "{searchTerm}"
              </BaseTypography>
            </BaseBox>
          )
        )
      }
      error={suggestError ?? error}
    />
  );
}
