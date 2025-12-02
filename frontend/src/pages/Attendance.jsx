import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { format } from 'date-fns';
import api from '../api/apiClient.js';
import { useAuth } from '../providers/AuthProvider.jsx';

export default function AttendancePage() {
  const { user, member } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [error, setError] = useState('');
  const [memberId, setMemberId] = useState(member?.id || '');
  const [memberOptions, setMemberOptions] = useState([]);

  const canManageSelf = user?.role === 'member';

  const loadRecords = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/attendance/${id}`);
      setRecords(data.records || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load attendance');
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (memberId) {
      loadRecords(memberId);
    }
  }, [memberId, loadRecords]);

  useEffect(() => {
    const normalizedMemberId = member?.id ? member.id.toString() : '';
    if (canManageSelf && normalizedMemberId && memberId !== normalizedMemberId) {
      setMemberId(normalizedMemberId);
    }
  }, [canManageSelf, member?.id, memberId]);

  useEffect(() => {
    if (canManageSelf) return;

    let cancelled = false;

    const fetchMembers = async () => {
      setMembersLoading(true);
      try {
        const { data } = await api.get('/members');
        if (cancelled) return;
        const options = data.members || [];
        setMemberOptions(options);
        setMemberId((current) => {
          if (current) return current;
          return options.length ? options[0]._id : '';
        });
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Unable to load members');
        }
      } finally {
        if (!cancelled) {
          setMembersLoading(false);
        }
      }
    };

    fetchMembers();

    return () => {
      cancelled = true;
    };
  }, [canManageSelf]);

  const handleAction = async (action) => {
    if (!memberId) return;
    setLoading(true);
    setError('');
    try {
      const payload = { memberId };
      await api.post(`/attendance/${action}`, payload);
      await loadRecords(memberId);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update attendance');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Attendance</Typography>
      {!canManageSelf && (
        <Card>
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                label="Member"
                value={memberId}
                onChange={(event) => setMemberId(event.target.value)}
                select
                size="small"
                sx={{ minWidth: 220 }}
                helperText={!memberOptions.length ? 'No members available' : ''}
              >
                {memberOptions.map((option) => (
                  <MenuItem key={option._id} value={option._id}>
                    {option.userId?.name || option.userId?.email || option._id}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                onClick={() => loadRecords(memberId)}
                disabled={!memberId}
              >
                Load Records
              </Button>
            </Stack>
          </CardContent>
        </Card>
      )}
      {canManageSelf && (
        <Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" onClick={() => handleAction('checkin')} disabled={loading}>
              Check In
            </Button>
            <Button variant="outlined" onClick={() => handleAction('checkout')} disabled={loading}>
              Check Out
            </Button>
          </Stack>
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {loading || membersLoading ? (
        <CircularProgress />
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Action</TableCell>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{record.action}</TableCell>
                    <TableCell>{format(new Date(record.timestamp), 'PPpp')}</TableCell>
                    <TableCell>{record.location || '-'}</TableCell>
                  </TableRow>
                ))}
                {!records.length && (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Typography variant="body2" color="text.secondary">
                        No attendance records yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}
