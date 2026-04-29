import { type ReactElement, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import convertType from '../../helpers/convertType';
import type { SearchResult } from '../../api/SearchApi';
import BaseCard from '../atoms/BaseCard';
import BaseBox from '../atoms/BaseBox';
import BaseImage from '../atoms/BaseImage';
import BaseTypography from '../atoms/BaseTypography';
import BaseChip from '../atoms/BaseChip';

interface TitleItemProps {
  title: SearchResult;
  interactive?: boolean;
}

export default function TitleItem({
  title,
  interactive = true,
}: Readonly<TitleItemProps>): ReactElement {
  const navigate = useNavigate();
  const overview = useMemo(() => {
    const words = title.overview.split(' ');
    return (
      words.slice(0, 40).join(' ') + (words.length > 40 ? '…' : '')
    );
  }, [title]);

  return (
    <BaseCard
      sx={{
        width: '100%',
        '&:hover': {
          borderColor: 'primary.main',
          transform: 'translateY(-2px)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        },
      }}
      onClick={
        interactive
          ? () => navigate({ to: `/title/${title.media_type}/${title.id}` })
          : undefined
      }
      actionAreaProps={{
        sx: {
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      }}
    >
      <BaseBox
        sx={{
          display: 'flex',
          gap: 2,
          alignItems: 'stretch',
        }}
      >
        {title.poster_url ? (
          <BaseImage
            src={title.poster_url}
            alt={title.title}
            sx={{
              width: 72,
              height: 108,
              objectFit: 'cover',
              borderRadius: 1.5,
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          />
        ) : (
          <BaseBox
            sx={{
              width: 72,
              height: 108,
              borderRadius: 1.5,
              flexShrink: 0,
              backgroundColor: 'rgba(169, 148, 222, 0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'text.secondary',
              fontSize: '0.75rem',
            }}
          >
            No image
          </BaseBox>
        )}
        <BaseBox
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
          }}
        >
          <BaseBox
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 1,
              mb: 0.5,
            }}
          >
            <BaseTypography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {title.title}
            </BaseTypography>
            <BaseBox
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <BaseChip
                label={convertType(title.media_type)}
                size="small"
                variant="outlined"
                color="primary"
              />
              {title.release_date && (
                <BaseTypography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 'fit-content' }}
                >
                  {title.release_date}
                </BaseTypography>
              )}
            </BaseBox>
          </BaseBox>
          <BaseTypography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.5,
            }}
          >
            {overview}
          </BaseTypography>
        </BaseBox>
      </BaseBox>
    </BaseCard>
  );
}
