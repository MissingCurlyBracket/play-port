import * as React from 'react';
import { type ReactElement, useState } from 'react';
import type { SearchResult } from '../api/SearchApi/SearchApi.ts';
import TitleCard from '../components/TitleCard.tsx';
import PersonCard from '../components/PersonCard.tsx';
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  IconButton,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

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
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'fixed',
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
          component="form"
          onSubmit={handleSubmit}
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
            <IconButton
              type="submit"
              disabled={isLoading}
              sx={{ p: 2, borderRadius: 0 }}
            >
              {isLoading ? <CircularProgress size={24} /> : <SearchIcon />}
            </IconButton>
          </Paper>
        </Box>
      </Box>

      <Container maxWidth="lg" sx={{ pt: 20 }}>
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
              {error}
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
              {searchResults.title_results.length > 0 && (
                <Box
                  sx={{
                    mb: 4,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    align="center"
                  >
                    Titles ({searchResults.title_results.length})
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {searchResults.title_results.map((title) => (
                      <TitleCard key={title.id} title={title} />
                    ))}
                  </Box>
                </Box>
              )}

              {searchResults.people_results.length > 0 && (
                <Box
                  sx={{
                    mb: 4,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    align="center"
                  >
                    People ({searchResults.people_results.length})
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    {searchResults.people_results.map((person) => (
                      <PersonCard key={person.id} person={person} />
                    ))}
                  </Box>
                </Box>
              )}

              {searchResults.title_results.length === 0 &&
                searchResults.people_results.length === 0 && (
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
