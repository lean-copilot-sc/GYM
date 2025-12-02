"use client";

import { useMemo, useState } from 'react';
import { Button, Stack, Typography } from '@mui/material';
import { AppTable } from '@/components/tables/AppTable';
import { AppDialog } from '@/components/forms/AppDialog';
import { useAppSelector } from '@/hooks/reduxHooks';
import { useRouter } from 'next/navigation';
import type { MemberSummary } from '@/features/members/membersSlice';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

export default function MembersPage() {
  const members = useAppSelector((state) => state.members.list);
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<MemberSummary | null>(null);

  const columns = useMemo<GridColDef[]>(
    () => [
      { field: 'name', headerName: 'Name', flex: 1 },
      { field: 'membershipType', headerName: 'Plan', width: 150 },
      { field: 'status', headerName: 'Status', width: 140 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 140,
        sortable: false,
        filterable: false,
        renderCell: (params: GridRenderCellParams<MemberSummary>) => (
          <Button
            size="small"
            onClick={() => {
              setSelectedMember(params.row);
              setDialogOpen(true);
            }}
          >
            View
          </Button>
        )
      }
    ],
    []
  );

  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          Members
        </Typography>
        <Button variant="contained" onClick={() => router.push('/members/add')}>
          Add Member
        </Button>
      </Stack>

      <AppTable columns={columns} rows={members} />

      <AppDialog
        open={dialogOpen}
        title={selectedMember?.name ?? 'Member Details'}
        onClose={() => setDialogOpen(false)}
        actions={
          <Button onClick={() => setDialogOpen(false)} variant="contained">
            Close
          </Button>
        }
      >
        <Typography variant="body2" color="text.secondary">
          Membership: {selectedMember?.membershipType}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Status: {selectedMember?.status}
        </Typography>
      </AppDialog>
    </Stack>
  );
}
