import SkeletonCard from '../components/atoms/SkeletonCard.tsx';
import type { Provider, TitleDetails } from '../api/TitleApi.ts';
import SourceItem from '../components/molecules/SourceItem.tsx';
import BaseBox from '../components/atoms/BaseBox.tsx';
import BaseTypography from '../components/atoms/BaseTypography.tsx';
import BaseChip from '../components/atoms/BaseChip.tsx';
import BaseContainer from '../components/atoms/BaseContainer.tsx';
import BackdropHero from '../components/molecules/BackdropHero.tsx';
import convertType from '../helpers/convertType.ts';

export interface TitlePageProps {
  title?: TitleDetails;
  providers?: Provider[];
  providersLoading?: boolean;
}

export default function TitlePage({
  title,
  providers,
  providersLoading,
}: Readonly<TitlePageProps>) {
  return (
    <BaseBox sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <BackdropHero
        backdropUrl={title?.backdrop_url}
        gradientDirection="to-bottom"
        height="70vh"
      >
        <BaseBox
          sx={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'flex-end',
            px: { xs: 3, md: 8 },
            pb: { xs: 4, md: 8 },
            pt: 10,
          }}
        >
          <BaseBox
            sx={{
              maxWidth: { xs: '100%', md: '55%' },
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {title && (
              <>
                <BaseBox
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    flexWrap: 'wrap',
                  }}
                >
                  <BaseChip
                    label={convertType(title.media_type)}
                    size="small"
                    variant="outlined"
                    color="primary"
                    sx={{
                      backgroundColor: 'rgba(26, 20, 48, 0.6)',
                      backdropFilter: 'blur(8px)',
                    }}
                  />
                  {title.release_date && (
                    <BaseTypography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                      }}
                    >
                      {title.release_date}
                    </BaseTypography>
                  )}
                </BaseBox>
                <BaseTypography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2rem', md: '3.25rem' },
                    lineHeight: 1.05,
                    textShadow: '0 4px 24px rgba(0,0,0,0.85)',
                  }}
                >
                  {title.title}
                </BaseTypography>
                {title.overview && (
                  <BaseTypography
                    variant="body1"
                    sx={{
                      color: 'text.secondary',
                      maxWidth: 640,
                      lineHeight: 1.65,
                      textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {title.overview}
                  </BaseTypography>
                )}
              </>
            )}
          </BaseBox>
        </BaseBox>
      </BackdropHero>

      <BaseContainer maxWidth="lg" sx={{ pt: 2, pb: 8 }}>
        <BaseBox sx={{ mb: 3, px: { xs: 1, md: 0 } }}>
          <BaseTypography
            variant="overline"
            sx={{
              color: 'primary.light',
              letterSpacing: '0.22em',
              fontSize: '0.8rem',
            }}
          >
            Available on
          </BaseTypography>
        </BaseBox>
        {providersLoading ? (
          <BaseBox
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(auto-fill, minmax(140px, 1fr))',
                md: 'repeat(auto-fill, minmax(180px, 1fr))',
              },
              gap: 2,
              px: { xs: 1, md: 0 },
            }}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonCard
                key={`source-skeleton-${i}`}
                name="source-item"
                loading
              >
                <SourceItem name="Loading provider" />
              </SkeletonCard>
            ))}
          </BaseBox>
        ) : providers && providers.length > 0 ? (
          <BaseBox
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(auto-fill, minmax(140px, 1fr))',
                md: 'repeat(auto-fill, minmax(180px, 1fr))',
              },
              gap: 2,
              px: { xs: 1, md: 0 },
            }}
          >
            {providers.map((provider) => (
              <SourceItem
                key={provider.provider_id}
                name={provider.provider_name}
                logo={provider.logo_url}
              />
            ))}
          </BaseBox>
        ) : (
          <BaseBox
            sx={{
              textAlign: 'center',
              py: 6,
              px: 2,
              borderRadius: 3,
              backgroundColor: 'rgba(26, 20, 48, 0.5)',
              border: '1px solid rgba(169, 148, 222, 0.12)',
            }}
          >
            <BaseTypography
              variant="h6"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              No streaming options found
            </BaseTypography>
            <BaseTypography variant="body2" color="text.secondary">
              Try adjusting your region or provider preferences from the home
              page.
            </BaseTypography>
          </BaseBox>
        )}
      </BaseContainer>
    </BaseBox>
  );
}
