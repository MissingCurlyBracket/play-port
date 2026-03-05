import { type ReactElement, useEffect, useState } from 'react';
import type { SearchResult } from '../api/SearchApi.ts';
import TitleCard from '../components/TitleCard.tsx';
import {
  Alert,
  Autocomplete,
  Box,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useDebounce } from 'use-debounce';
import type { Region } from '../api/RegionsApi.ts';

interface MainPageProps {
  searchFn: (title: string) => Promise<SearchResult[]>;
  regions: Region[];
  regionsLoading?: boolean;
  error: Error | null;
}

export default function MainPage({
  searchFn,
  regions,
  regionsLoading,
  error,
}: Readonly<MainPageProps>): ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [debouncedSearch] = useDebounce(searchTerm, 400);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )region=([^;]+)'));
    if (match) {
      const code = match[2];
      const found = regions.find((r) => r.code === code);
      if (found) setSelectedRegion(found);
    }
  }, [regions]);

  const handleRegionChange = (_event: unknown, newValue: Region | null) => {
    setSelectedRegion(newValue);
    if (newValue) {
      document.cookie = `region=${newValue.code}; path=/; max-age=31536000`;
    } else {
      document.cookie = `region=; path=/; max-age=0`;
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
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          top: 0,
          left: 0,
          zIndex: 10,
          background: 'inherit',
          pt: 3,
          pb: 2,
        }}
      >
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Search Movies & TV Shows
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600,
            px: 2,
            mb: 2,
          }}
        >
          <Autocomplete
            options={regions}
            loading={regionsLoading}
            getOptionLabel={(option) => option.name}
            value={selectedRegion}
            onChange={handleRegionChange}
            sx={{ width: '100%' }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Region"
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'white',
                  },
                }}
              />
            )}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600,
            px: 2,
          }}
        >
          <Paper
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              boxShadow: 3,
            }}
          >
            <TextField
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter movie or TV show title..."
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    border: 'none',
                  },
                },
              }}
            />
            {isLoading && <CircularProgress />}
          </Paper>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 4 }}>
        <Box
          sx={{
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, width: '100%', maxWidth: 600 }}
            >
              {error.message}
            </Alert>
          )}

          {searchResults.length > 0 ? (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {searchResults.map((title) => (
                <TitleCard key={title.id} title={title} />
              ))}
            </Box>
          ) : (
            debouncedSearch &&
            !isLoading && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No results found for "{searchTerm}"
                </Typography>
              </Box>
            )
          )}
        </Box>
      </Container>
    </>
  );
}
