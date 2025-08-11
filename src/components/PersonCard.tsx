import type { ReactElement } from 'react';
import type { Person } from '../api/SearchApi/SearchApi.ts';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Typography,
} from '@mui/material';

interface PersonCardProps {
  person: Person;
}

export default function PersonCard({
  person,
}: Readonly<PersonCardProps>): ReactElement {
  return (
    <Card sx={{ width: '50vw', mb: 2 }}>
      <CardActionArea
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
              {person.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              {person.main_profession && (
                <Chip
                  label={person.main_profession}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              )}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
