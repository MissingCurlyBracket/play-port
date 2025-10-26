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
import type { AutocompleteResult } from '../api/SearchApi/SearchApi.ts';

interface TitleCardProps {
  title: AutocompleteResult;
}

export default function TitleCard({
  title,
}: Readonly<TitleCardProps>): ReactElement {
  const navigate = useNavigate();
  return (
    <Card sx={{ width: '50vw', mb: 2 }}>
      <CardActionArea
        onClick={() => navigate({ to: `/title/${title.id}` })}
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
            <Box
              component="img"
              src={title.image_url}
              alt={title.name}
              sx={{
                height: '4em',
                width: 'auto',
                objectFit: 'contain',
                mr: 2,
              }}
            />
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
              {title.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip
                label={convertType(title.type)}
                size="small"
                variant="outlined"
                color="primary"
              />
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ minWidth: 'fit-content' }}
              >
                ({title.year})
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
