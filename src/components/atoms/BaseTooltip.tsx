import { Tooltip, type TooltipProps } from '@mui/material';

export default function BaseTooltip(props: Readonly<TooltipProps>) {
  return <Tooltip {...props} />;
}
