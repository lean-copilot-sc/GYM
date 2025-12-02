import { useCallback, useEffect, useState } from 'react';
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
import { useFormik } from 'formik';
import * as Yup from 'yup';

const numericField = Yup.number()
  .transform((value, originalValue) => (originalValue === '' || originalValue === null ? null : Number(originalValue)))
  .nullable()
  .typeError('Enter a valid number')
  .min(0, 'Must be positive');

const validationSchema = Yup.object({
  memberId: Yup.string().required('Member is required'),
  type: Yup.string().oneOf(['gym', 'physio']).required('Type is required'),
  weight: numericField,
  bodyFat: numericField,
  painScale: Yup.number()
    .transform((value, originalValue) => (originalValue === '' || originalValue === null ? null : Number(originalValue)))
    .nullable()
    .typeError('Enter a valid number')
    .min(0, 'Min 0')
    .max(10, 'Max 10'),
  mobility: Yup.number()
    .transform((value, originalValue) => (originalValue === '' || originalValue === null ? null : Number(originalValue)))
    .nullable()
    .typeError('Enter a valid number')
    .min(0, 'Min 0')
    .max(10, 'Max 10'),
  strengthScore: numericField,
  notes: Yup.string().nullable()
});

export default function ProgressPage() {
  const { user, member } = useAuth();
  const [memberId, setMemberId] = useState(member?.id || '');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [memberOptions, setMemberOptions] = useState([]);

  const loadEntries = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/progress/${id}`);
      setEntries(data.records || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load progress records');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (memberId) {
      loadEntries(memberId);
    }
  }, [memberId, loadEntries]);

  useEffect(() => {
    const normalized = member?.id ? member.id.toString() : '';
    if (user?.role === 'member' && normalized && memberId !== normalized) {
      setMemberId(normalized);
    }
  }, [user?.role, member?.id, memberId]);

  useEffect(() => {
    if (user?.role === 'member') return;

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
  }, [user?.role]);

  const formik = useFormik({
    initialValues: {
      memberId: '',
      type: 'gym',
      weight: '',
      bodyFat: '',
      painScale: '',
      mobility: '',
      strengthScore: '',
      notes: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      setSaving(true);
      setStatus(undefined);
      try {
        const selectedMemberId = values.memberId || memberId;
        if (!selectedMemberId) {
          setStatus('Select a member before recording progress');
          return;
        }

        const payload = {
          memberId: selectedMemberId,
          type: values.type,
          metrics: {
            weight: values.weight === '' ? null : Number(values.weight),
            bodyFat: values.bodyFat === '' ? null : Number(values.bodyFat),
            painScale: values.painScale === '' ? null : Number(values.painScale),
            mobility: values.mobility === '' ? null : Number(values.mobility),
            strengthScore: values.strengthScore === '' ? null : Number(values.strengthScore),
            notes: values.notes
          }
        };

        await api.post('/progress', payload);
        resetForm();
        setOpen(false);
        await loadEntries(selectedMemberId);
      } catch (err) {
        setStatus(err.response?.data?.message || 'Unable to record progress');
      } finally {
        setSaving(false);
        setSubmitting(false);
      }
    }
  });

  useEffect(() => {
    if (memberId) {
      formik.setFieldValue('memberId', memberId, false);
    }
  }, [memberId]);

  const handleOpenDialog = () => {
    formik.resetForm({ values: { ...formik.initialValues, memberId: memberId || '' } });
    formik.setStatus(undefined);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    formik.resetForm({ values: { ...formik.initialValues, memberId: memberId || '' } });
    formik.setStatus(undefined);
  };
  const canCreate = Boolean(user) && (user.role !== 'member' || Boolean(memberId));

  return (
    <Stack spacing={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Progress Tracking</Typography>
        <Button variant="contained" onClick={handleOpenDialog} disabled={!canCreate}>
          Record Progress
        </Button>
      </Box>
      {user?.role !== 'member' && (
        <Card>
          <CardContent>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
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
              <Button variant="outlined" onClick={() => loadEntries(memberId)} disabled={!memberId}>
                Load Records
              </Button>
            </Stack>
          </CardContent>
        </Card>
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
                  <TableCell>Type</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Body Fat</TableCell>
                  <TableCell>Pain</TableCell>
                  <TableCell>Mobility</TableCell>
                  <TableCell>Strength</TableCell>
                  <TableCell>Notes</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {entries.map((entry) => (
                  <TableRow key={entry._id}>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell>{entry.metrics?.weight ?? '-'}</TableCell>
                    <TableCell>{entry.metrics?.bodyFat ?? '-'}</TableCell>
                    <TableCell>{entry.metrics?.painScale ?? '-'}</TableCell>
                    <TableCell>{entry.metrics?.mobility ?? '-'}</TableCell>
                    <TableCell>{entry.metrics?.strengthScore ?? '-'}</TableCell>
                    <TableCell>{entry.metrics?.notes || '-'}</TableCell>
                    <TableCell>{format(new Date(entry.recordedAt || entry.createdAt), 'PPpp')}</TableCell>
                  </TableRow>
                ))}
                {!entries.length && (
                  <TableRow>
                    <TableCell colSpan={8}>
                      <Typography variant="body2" color="text.secondary">
                        No progress recorded yet.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>Record Progress</DialogTitle>
        {formik.status && <Alert severity="error" sx={{ mx: 3 }}>{formik.status}</Alert>}
        <Box component="form" onSubmit={formik.handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="memberId"
                  label="Member"
                  value={formik.values.memberId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  fullWidth
                  select
                  disabled={user?.role === 'member'}
                  error={formik.touched.memberId && Boolean(formik.errors.memberId)}
                  helperText={formik.touched.memberId && formik.errors.memberId}
                >
                  {user?.role !== 'member'
                    ? memberOptions.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.userId?.name || option.userId?.email || option._id}
                        </MenuItem>
                      ))
                    : (
                        <MenuItem value={memberId}>{member?.name || user?.name}</MenuItem>
                      )}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="type"
                  label="Type"
                  value={formik.values.type}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  select
                  fullWidth
                  error={formik.touched.type && Boolean(formik.errors.type)}
                  helperText={formik.touched.type && formik.errors.type}
                >
                  <MenuItem value="gym">Gym</MenuItem>
                  <MenuItem value="physio">Physio</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="weight"
                  label="Weight"
                  value={formik.values.weight}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  helperText={formik.touched.weight && formik.errors.weight}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="bodyFat"
                  label="Body Fat %"
                  value={formik.values.bodyFat}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  helperText={formik.touched.bodyFat && formik.errors.bodyFat}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="painScale"
                  label="Pain Scale"
                  value={formik.values.painScale}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  helperText={formik.touched.painScale && formik.errors.painScale}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="mobility"
                  label="Mobility"
                  value={formik.values.mobility}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  helperText={formik.touched.mobility && formik.errors.mobility}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="strengthScore"
                  label="Strength Score"
                  value={formik.values.strengthScore}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  helperText={formik.touched.strengthScore && formik.errors.strengthScore}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="notes"
                  label="Notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  multiline
                  minRows={2}
                  helperText={formik.touched.notes && formik.errors.notes}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={formik.isSubmitting || saving}>
              {formik.isSubmitting || saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
}
