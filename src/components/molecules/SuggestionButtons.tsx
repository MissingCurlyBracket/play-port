import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import BaseBox from '../atoms/BaseBox';
import BaseButton from '../atoms/BaseButton';
import BaseTypography from '../atoms/BaseTypography';
import LoadingSpinner from '../atoms/LoadingSpinner';

interface SuggestionButtonsProps {
  onSuggest: (type: 'movie' | 'tv') => void;
  loadingType: 'movie' | 'tv' | null;
  hasPreferences: boolean;
}

const buttonSx = {
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
};

export default function SuggestionButtons({
  onSuggest,
  loadingType,
  hasPreferences,
}: Readonly<SuggestionButtonsProps>) {
  const isMovieLoading = loadingType === 'movie';
  const isTvLoading = loadingType === 'tv';
  const anyLoading = loadingType !== null;

  return (
    <BaseBox
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <BaseBox
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <BaseButton
          variant="outlined"
          color="primary"
          startIcon={
            isMovieLoading ? <LoadingSpinner size={18} /> : <MovieIcon />
          }
          onClick={() => onSuggest('movie')}
          disabled={anyLoading}
          sx={buttonSx}
        >
          Suggest a movie
        </BaseButton>
        <BaseButton
          variant="outlined"
          color="primary"
          startIcon={isTvLoading ? <LoadingSpinner size={18} /> : <TvIcon />}
          onClick={() => onSuggest('tv')}
          disabled={anyLoading}
          sx={buttonSx}
        >
          Suggest a TV show
        </BaseButton>
      </BaseBox>
      {!hasPreferences && (
        <BaseTypography
          variant="caption"
          sx={{
            color: 'text.secondary',
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
          }}
        >
          Set your region and providers in Preferences for suggestions you can
          actually watch.
        </BaseTypography>
      )}
    </BaseBox>
  );
}
