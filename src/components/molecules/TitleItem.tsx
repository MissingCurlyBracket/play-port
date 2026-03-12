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
}

export default function TitleItem({
  title,
}: Readonly<TitleItemProps>): ReactElement {
  const navigate = useNavigate();
  const overview = useMemo(() => {
    return (
      title.overview.split(' ').slice(0, 50).join(' ') +
      (title.overview.split(' ').length > 50 ? '...' : '')
    );
  }, [title]);

  return (
    <BaseCard
      sx={{ width: '50vw', mb: 2 }}
      onClick={() => navigate({ to: `/title/${title.media_type}/${title.id}` })}
      actionAreaProps={{
        sx: {
          '&:hover': {
            backgroundColor: 'action.selectedHover',
          },
        },
      }}
    >
      <BaseBox
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: 1,
        }}
      >
        {title.poster_url && (
          <BaseImage
            src={title.poster_url}
            alt={title.title}
            sx={{
              height: '4em',
              width: 'auto',
              objectFit: 'contain',
              mr: 2,
            }}
          />
        )}
        <BaseTypography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 600,
            flex: 1,
            mr: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {title.title}
        </BaseTypography>
        <BaseBox sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
              ({title.release_date})
            </BaseTypography>
          )}
        </BaseBox>
      </BaseBox>
      <BaseTypography variant="body2" color="text.secondary">
        {overview}
      </BaseTypography>
    </BaseCard>
  );
}
