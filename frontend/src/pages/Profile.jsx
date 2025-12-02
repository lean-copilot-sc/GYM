import { useMemo } from 'react';
import { Card, CardContent, Stack, Typography } from '@mui/material';
import { useAuth } from '../providers/AuthProvider.jsx';

export default function ProfilePage() {
  const { user, member } = useAuth();

  const items = useMemo(() => {
    const list = [
      { label: 'Name', value: user?.name },
      { label: 'Email', value: user?.email },
      { label: 'Role', value: user?.role },
      { label: 'Phone', value: user?.phone || '-' }
    ];

    if (member) {
      list.push({ label: 'Membership Type', value: member.membershipType });
      list.push({ label: 'Status', value: member.status });
    }

    return list;
  }, [user, member]);

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Profile</Typography>
      <Card>
        <CardContent>
          <Stack spacing={1}>
            {items.map((item) => (
              <Stack key={item.label} direction="row" justifyContent="space-between">
                <Typography color="text.secondary">{item.label}</Typography>
                <Typography>{item.value || '-'}</Typography>
              </Stack>
            ))}
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}
