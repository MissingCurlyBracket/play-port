import type { ReactNode } from 'react';
import BaseBox from '../atoms/BaseBox';
import BaseTypography from '../atoms/BaseTypography';
import BaseContainer from '../atoms/BaseContainer';
import BaseAlert from '../atoms/BaseAlert';

interface MainPageTemplateProps {
  header: ReactNode;
  searchBar: ReactNode;
  results: ReactNode;
  preferencesDialog: ReactNode;
  error?: Error | null;
}

export default function MainPageTemplate({
  header,
  searchBar,
  results,
  preferencesDialog,
  error,
}: Readonly<MainPageTemplateProps>) {
  return (
    <>
      <BaseBox
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
        <BaseTypography variant="h3" component="h1" align="center" gutterBottom>
          Search Movies & TV Shows
        </BaseTypography>
        <BaseBox
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
          {header}
        </BaseBox>

        <BaseBox
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            maxWidth: 600,
            px: 2,
          }}
        >
          {searchBar}
        </BaseBox>
      </BaseBox>

      {preferencesDialog}

      <BaseContainer maxWidth="lg" sx={{ pt: 4 }}>
        <BaseBox
          sx={{
            py: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {error && (
            <BaseAlert
              severity="error"
              sx={{ mb: 3, width: '100%', maxWidth: 600 }}
            >
              {error.message}
            </BaseAlert>
          )}
          {results}
        </BaseBox>
      </BaseContainer>
    </>
  );
}
