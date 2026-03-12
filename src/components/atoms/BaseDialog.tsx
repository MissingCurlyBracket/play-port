import {
  Dialog,
  DialogActions,
  DialogContent,
  type DialogProps,
  DialogTitle,
} from '@mui/material';
import { type ReactNode } from 'react';

interface BaseDialogProps extends Omit<DialogProps, 'title' | 'content'> {
  title?: ReactNode;
  content?: ReactNode;
  actions?: ReactNode;
  onClose: () => void;
}

export default function BaseDialog({
  title,
  content,
  actions,
  onClose,
  open,
  children,
  ...props
}: Readonly<BaseDialogProps>) {
  return (
    <Dialog open={open} onClose={onClose} {...props}>
      {title && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>{content || children}</DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}
