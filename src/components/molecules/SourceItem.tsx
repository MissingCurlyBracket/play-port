import { type ReactElement } from 'react';
import BaseCard from '../atoms/BaseCard';
import BaseBox from '../atoms/BaseBox';
import BaseImage from '../atoms/BaseImage';
import BaseTypography from '../atoms/BaseTypography';
import BaseChip from '../atoms/BaseChip';

interface SourceItemProps {
  name: string;
  url?: string;
  nrOfSeasons?: number | null;
  format?: string;
  logo?: string;
}

export default function SourceItem({
  name,
  url,
  nrOfSeasons,
  format,
  logo,
}: Readonly<SourceItemProps>): ReactElement {
  return (
    <BaseCard
      sx={{
        width: '100%',
        transition:
          'transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
        '&:hover': {
          borderColor: 'primary.main',
          transform: url ? 'translateY(-2px)' : 'none',
          boxShadow: url ? '0 10px 28px rgba(0,0,0,0.5)' : undefined,
        },
      }}
      onClick={url ? () => window.open(url, '_blank') : undefined}
      actionAreaProps={{
        disabled: !url,
        sx: {
          '&:hover': {
            backgroundColor: 'transparent',
            cursor: url ? 'pointer' : 'default',
          },
        },
      }}
    >
      <BaseBox
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1.5,
          py: 1,
        }}
      >
        {logo ? (
          <BaseImage
            src={logo}
            alt={name}
            sx={{
              width: 64,
              height: 64,
              objectFit: 'cover',
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
            }}
          />
        ) : (
          <BaseBox
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              backgroundColor: 'rgba(169, 148, 222, 0.08)',
            }}
          />
        )}
        <BaseTypography
          variant="subtitle2"
          component="div"
          sx={{
            fontWeight: 600,
            textAlign: 'center',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            width: '100%',
          }}
        >
          {name}
        </BaseTypography>
        {(format || nrOfSeasons) && (
          <BaseBox
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {format && (
              <BaseChip
                label={format}
                size="small"
                variant="outlined"
                color="primary"
              />
            )}
            {nrOfSeasons && (
              <BaseTypography variant="caption" color="text.secondary">
                {nrOfSeasons} Season{nrOfSeasons === 1 ? '' : 's'}
              </BaseTypography>
            )}
          </BaseBox>
        )}
      </BaseBox>
    </BaseCard>
  );
}
