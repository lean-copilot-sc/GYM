"use client";

import { Stack, Typography, List, ListItem, ListItemText, Card, CardContent } from '@mui/material';

export default function DocsPage() {
  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight={700}>
        Documentation
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Implementation notes
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="React Hook Form + Zod"
                secondary="Reusable AppForm wrapper keeps validation logic aligned with Able Pro patterns."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Redux Toolkit"
                secondary="UI, analytics, and forms slices scaffold async flows with predictable state."
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Material UI"
                secondary="Dark theme tuned with Able Pro inspired gradients, typography, and cards."
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
}
