"use client";

import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Stack,
  Typography,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppSelector } from '@/hooks/redux';
import { formatDate } from '@/utils/formatters';

const statusTone: Record<string, 'success' | 'warning' | 'error'> = {
  approved: 'success',
  pending: 'warning',
  rejected: 'error'
};

export default function TablesPage() {
  const submissions = useAppSelector((state) => state.forms.submissions);

  return (
    <Stack spacing={4}>
      <Typography variant="h4" fontWeight={700}>
        Validation Submissions
      </Typography>
      <Card>
        <CardHeader
          title="Recent requests"
          subheader="Manage approvals generated from Able Pro Inspired forms."
          action={
            <Button variant="contained" startIcon={<AddIcon />}>New submission</Button>
          }
        />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Submission</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Submitted</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id} hover>
                  <TableCell>
                    <Stack>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {submission.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {submission.id}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={submission.status}
                      color={statusTone[submission.status] ?? 'warning'}
                      sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(submission.submittedAt)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Stack>
  );
}
