import { Paper, type PaperProps } from '@mui/material';

export default function BasePaper(props: Readonly<PaperProps>) {
  return <Paper {...props} />;
}
