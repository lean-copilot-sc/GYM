"use client";

import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, Stack } from '@mui/material';
import { ReactNode } from 'react';

export type AppDialogProps = DialogProps & {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function AppDialog({ title, actions, children, ...props }: AppDialogProps) {
  return (
    <Dialog fullWidth maxWidth="md" {...props}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>{children}</Stack>
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}
