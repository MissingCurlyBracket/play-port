import { Card, CardContent, type CardProps } from '@mui/material';
import { type ReactNode } from 'react';

import { CardActionArea as BaseCardActionArea } from '@mui/material';

interface BaseCardProps extends CardProps {
  children: ReactNode;
  onClick?: () => void;
  actionAreaProps?: React.ComponentProps<typeof BaseCardActionArea>;
}

export default function BaseCard({
  children,
  onClick,
  actionAreaProps,
  ...props
}: Readonly<BaseCardProps>) {
  return (
    <Card {...props}>
      {onClick ? (
        <BaseCardActionArea onClick={onClick} {...actionAreaProps}>
          <CardContent>{children}</CardContent>
        </BaseCardActionArea>
      ) : (
        <CardContent>{children}</CardContent>
      )}
    </Card>
  );
}
