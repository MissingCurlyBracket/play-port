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
      sx={{ width: '50vw', mb: 2 }}
      onClick={url ? () => window.open(url, '_blank') : undefined}
      actionAreaProps={{
        disabled: !url,
        sx: {
          '&:hover': {
            backgroundColor: url ? 'action.selectedHover' : 'inherit',
            cursor: url ? 'pointer' : 'default',
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
        }}
      >
        <BaseBox
          sx={{
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            mr: 2,
            overflow: 'hidden',
          }}
        >
          {logo && (
            <BaseImage
              src={logo}
              alt={name}
              sx={{
                width: 40,
                height: 40,
                objectFit: 'contain',
                mr: 2,
                borderRadius: 1,
              }}
            />
          )}
          <BaseTypography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </BaseTypography>
        </BaseBox>
        <BaseBox sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {format && (
            <BaseChip
              label={format}
              size="small"
              variant="outlined"
              color="primary"
            />
          )}
          {nrOfSeasons && (
            <BaseTypography
              variant="body2"
              color="text.secondary"
              sx={{ minWidth: 'fit-content' }}
            >
              {nrOfSeasons} Season(s)
            </BaseTypography>
          )}
        </BaseBox>
      </BaseBox>
    </BaseCard>
  );
}
