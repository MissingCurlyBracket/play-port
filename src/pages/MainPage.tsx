import { type ReactElement, useEffect, useState } from 'react';
import type { SearchResult } from '../api/SearchApi.ts';
import type { Provider } from '../api/TitleApi.ts';
import TitleCard from '../components/TitleCard.tsx';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { useDebounce } from 'use-debounce';
import type { Region } from '../api/RegionApi.ts';
import SettingsIcon from '@mui/icons-material/Settings';

interface MainPageProps {
  searchFn: (title: string) => Promise<SearchResult[]>;
  getProviders: (params: { region: string }) => Promise<Provider[]>;
  regions: Region[];
  regionsLoading?: boolean;
  error: Error | null;
}

export default function MainPage({
  searchFn,
  getProviders,
  regions,
  regionsLoading,
  error,
}: Readonly<MainPageProps>): ReactElement {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [debouncedSearch] = useDebounce(searchTerm, 400);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Modal State
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

  const handleModalRegionChange = async (
    _event: unknown,
    newValue: Region | null,
  ) => {
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
    } else {
      document.cookie = `providers=; path=/; max-age=0`;
    }

    setIsModalOpen(false);
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
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={handleOpenModal}
          >
            Preferences
          </Button>
        </Box>

        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>Preferences</DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}
            >
              <Autocomplete
                options={regions}
                loading={regionsLoading}
                getOptionLabel={(option) => option.name}
                value={modalRegion}
                onChange={handleModalRegionChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Region"
                    variant="outlined"
                  />
                )}
              />
              <Autocomplete
                multiple
                disabled={!modalRegion}
                loading={modalLoading}
                options={modalProviders}
                getOptionLabel={(option) => option.provider_name}
                value={modalSelectedProviders}
                onChange={(_e, newValue) => setModalSelectedProviders(newValue)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Providers"
                    variant="outlined"
                    placeholder="Providers"
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveSettings} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

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
