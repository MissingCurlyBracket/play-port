import { type ReactElement, useEffect, useState } from 'react';
import type { AutocompleteResult } from '../api/SearchApi/SearchApi.ts';
import TitleCard from '../components/TitleCard.tsx';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useDebounce } from 'use-debounce';

interface MainPageProps {
  autocompleteFn: (title: string) => Promise<AutocompleteResult[]>;
  error: Error | null;
}

export default function MainPage({
  autocompleteFn,
  error,
}: Readonly<MainPageProps>): ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<
    AutocompleteResult[] | null
  >(null);
  const [debouncedSearch] = useDebounce(searchTerm, 400);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setSearchResults(null);
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      try {
        const results = await autocompleteFn(debouncedSearch.trim());
        setSearchResults(results);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedSearch, autocompleteFn]);

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

          {searchResults && (
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              {searchResults
                .sort((a, b) => b.year - a.year)
                .map((title) => (
                  <TitleCard key={title.id} title={title} />
                ))}

              {searchResults.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    No results found for "{searchTerm}"
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
}
