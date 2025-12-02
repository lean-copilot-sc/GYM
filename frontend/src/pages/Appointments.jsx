import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
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

const initialForm = {
  memberId: '',
  start: '',
  end: '',
  notes: ''
};

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/appointments');
      setAppointments(data.appointments || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    try {
      const payload = {
        memberId: form.memberId,
        staffId: user.id,
        staffRole: user.role,
        start: form.start,
        end: form.end || null,
        notes: form.notes
      };
      await api.post('/appointments', payload);
      setOpen(false);
      setForm(initialForm);
      await loadAppointments();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create appointment');
    } finally {
      setSaving(false);
    }
  };

  const canCreate = user?.role === 'admin' || user?.role === 'trainer' || user?.role === 'physio';

  return (
    <Stack spacing={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Appointments</Typography>
        {canCreate && (
          <Button variant="contained" onClick={() => setOpen(true)}>
            Schedule Appointment
          </Button>
        )}
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <CircularProgress />
      ) : (
        <Card>
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>{appointment.memberId?.userId || appointment.memberId}</TableCell>
                    <TableCell>{format(new Date(appointment.start), 'PPpp')}</TableCell>
                    <TableCell>
                      {appointment.end ? format(new Date(appointment.end), 'PPpp') : '-'}
                    </TableCell>
                    <TableCell>{appointment.status}</TableCell>
                    <TableCell>{appointment.notes || '-'}</TableCell>
                  </TableRow>
                ))}
                {!appointments.length && (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography variant="body2" color="text.secondary">
                        No appointments scheduled.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Schedule Appointment</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="memberId"
                  label="Member ID"
                  value={form.memberId}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="start"
                  label="Start"
                  type="datetime-local"
                  value={form.start}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="end"
                  label="End"
                  type="datetime-local"
                  value={form.end}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Notes"
                  value={form.notes}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
}
