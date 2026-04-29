import type { ReactNode } from 'react';
import BaseBox from '../atoms/BaseBox';
import BaseTypography from '../atoms/BaseTypography';
import BaseAlert from '../atoms/BaseAlert';
import BackdropHero from '../molecules/BackdropHero';

interface MainPageTemplateProps {
  header: ReactNode;
  suggestionButtons?: ReactNode;
  searchBar: ReactNode;
  results: ReactNode;
  preferencesDialog: ReactNode;
  error?: Error | null;
  backdropUrl?: string;
}

export default function MainPageTemplate({
  header,
  suggestionButtons,
  searchBar,
  results,
  preferencesDialog,
  error,
  backdropUrl,
}: Readonly<MainPageTemplateProps>) {
  return (
    <BaseBox sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <BackdropHero
        backdropUrl={backdropUrl}
        gradientDirection="to-bottom"
        blur={16}
        height="100vh"
        fixed
      >
        <BaseBox
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 2,
          }}
        >
          {header}
        </BaseBox>

        <BaseBox
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            px: 2,
            pt: { xs: 12, md: 14 },
            pb: 6,
            textAlign: 'center',
          }}
        >
          <BaseTypography
            variant="overline"
            sx={{
              color: 'primary.light',
              letterSpacing: '0.25em',
              mb: 1,
              fontSize: '0.85rem',
            }}
          >
            play-port
          </BaseTypography>
          <BaseTypography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 1,
              textShadow: '0 4px 24px rgba(0,0,0,0.8)',
              fontSize: { xs: '2.25rem', md: '3.5rem' },
            }}
          >
            Where to watch?
          </BaseTypography>
          <BaseTypography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 400,
              maxWidth: 560,
              mb: 3,
              textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            }}
          >
            Find where to stream any movie or TV show, in your region, on your
            services.
          </BaseTypography>
          {suggestionButtons && (
            <BaseBox sx={{ width: '100%', maxWidth: 640, mb: 2 }}>
              {suggestionButtons}
            </BaseBox>
          )}
          <BaseBox
            sx={{
              width: '100%',
              maxWidth: 640,
            }}
          >
            {searchBar}
          </BaseBox>

          <BaseBox
            sx={{
              width: '100%',
              maxWidth: 820,
              mt: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'left',
            }}
          >
            {error && (
              <BaseAlert
                severity="error"
                sx={{ mb: 2, width: '100%' }}
              >
                {error.message}
              </BaseAlert>
            )}
            {results}
          </BaseBox>
        </BaseBox>
      </BackdropHero>

      {preferencesDialog}
    </BaseBox>
  );
}
