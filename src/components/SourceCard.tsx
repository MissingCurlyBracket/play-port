import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';

interface SourceCardProps {
  name: string;
  url: string;
  nrOfSeasons: number | null;
  format: string;
}

export default function SourceCard({
  name,
  url,
  nrOfSeasons,
  format,
}: Readonly<SourceCardProps>) {
  return (
    <Card sx={{ width: '50vw', mb: 2 }}>
      <CardActionArea
        onClick={() => window.open(url, '_blank')}
        sx={{
          '&:hover': {
            backgroundColor: 'action.selectedHover',
          },
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <Typography
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
              {name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={format}
                size="small"
                variant="outlined"
                color="primary"
              />
              {nrOfSeasons && nrOfSeasons !== 0 && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: 'fit-content' }}
                >
                  {nrOfSeasons} Season(s)
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
