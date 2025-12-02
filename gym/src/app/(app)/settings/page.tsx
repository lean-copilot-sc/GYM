"use client";

import { Stack, Typography, Switch, FormControlLabel, Card, CardContent } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectCurrentTheme } from '@/features/ui/selectors';
import { toggleDarkMode } from '@/features/ui/uiSlice';

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectCurrentTheme);

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight={700}>
        Workspace Settings
      </Typography>
      <Card>
        <CardContent>
          <FormControlLabel
            control={
              <Switch
                checked={mode === 'dark'}
                onChange={() => dispatch(toggleDarkMode())}
              />
            }
            label="Enable dark mode"
          />
        </CardContent>
      </Card>
    </Stack>
  );
}
