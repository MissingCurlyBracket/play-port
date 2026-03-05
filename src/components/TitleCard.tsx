import type { ReactElement } from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import convertType from '../helpers/convertType.ts';
import type { SearchResult } from '../api/SearchApi.ts';

interface TitleCardProps {
  title: SearchResult;
}

export default function TitleCard({
  title,
}: Readonly<TitleCardProps>): ReactElement {
  const navigate = useNavigate();
  return (
    <Card sx={{ width: '50vw', mb: 2 }}>
      <CardActionArea
        onClick={() =>
          navigate({ to: `/title/${title.media_type}/${title.id}` })
        }
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
              mb: 1,
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
              {title.title}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={convertType(title.media_type)}
                size="small"
                variant="outlined"
                color="primary"
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 'fit-content' }}
              >
                ({title.release_date})
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {title.overview}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
