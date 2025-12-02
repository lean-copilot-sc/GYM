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
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/apiClient.js';
import { useAuth } from '../providers/AuthProvider.jsx';

const validationSchema = Yup.object({
  memberId: Yup.string().required('Member is required'),
  amount: Yup.number()
    .transform((value, originalValue) => (originalValue === '' || originalValue === null ? null : Number(originalValue)))
    .typeError('Enter a valid amount')
    .positive('Amount must be positive')
    .required('Amount is required'),
  currency: Yup.string().required('Currency is required'),
  description: Yup.string().nullable(),
  dueDate: Yup.date()
    .transform((value, originalValue) => (originalValue ? new Date(originalValue) : null))
    .nullable()
    .typeError('Enter a valid date'),
  status: Yup.string().oneOf(['paid', 'pending', 'overdue']).required('Status is required'),
  method: Yup.string().oneOf(['card', 'cash', 'bank', 'online']).required('Method is required')
});

export default function PaymentsPage() {
  const { user, member } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [memberId, setMemberId] = useState(member?.id || '');
  const [memberOptions, setMemberOptions] = useState([]);

  const canCreate = user?.role === 'admin';

  const loadPayments = useCallback(async (id) => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(`/payments/${id}`);
      setPayments(data.payments || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load payments');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (memberId) {
      loadPayments(memberId);
    }
  }, [memberId, loadPayments]);

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
      amount: '',
      currency: 'USD',
      description: '',
      dueDate: '',
      status: 'paid',
      method: 'card'
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      setSaving(true);
      setStatus(undefined);
      try {
        const selectedMemberId = values.memberId || memberId;
        if (!selectedMemberId) {
          setStatus('Select a member before recording a payment');
          return;
        }

        const payload = {
          memberId: selectedMemberId,
          amount: Number(values.amount),
          currency: values.currency,
          description: values.description,
          dueDate: values.dueDate ? values.dueDate : null,
          status: values.status,
          method: values.method
        };

        await api.post('/payments', payload);
        resetForm();
        setOpen(false);
        await loadPayments(selectedMemberId);
      } catch (err) {
        setStatus(err.response?.data?.message || 'Unable to create payment');
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

  return (
    <Stack spacing={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Payments</Typography>
        {canCreate && (
          <Button variant="contained" onClick={handleOpenDialog}>
            Record Payment
          </Button>
        )}
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
              <Button variant="outlined" onClick={() => loadPayments(memberId)} disabled={!memberId}>
                Load Payments
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
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Method</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Created</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment._id}>
                    <TableCell>
                      {payment.currency} {payment.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{payment.status}</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{payment.description || '-'}</TableCell>
                    <TableCell>
                      {payment.dueDate ? format(new Date(payment.dueDate), 'PP') : '-'}
                    </TableCell>
                    <TableCell>{format(new Date(payment.createdAt), 'PP')}</TableCell>
                  </TableRow>
                ))}
                {!payments.length && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary">
                        No payments recorded.
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
        <DialogTitle>Record Payment</DialogTitle>
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
                        <MenuItem value={memberId}>{user?.name}</MenuItem>
                      )}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="amount"
                  label="Amount"
                  value={formik.values.amount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                  fullWidth
                  helperText={formik.touched.amount && formik.errors.amount}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="currency"
                  label="Currency"
                  value={formik.values.currency}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  helperText={formik.touched.currency && formik.errors.currency}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  helperText={formik.touched.description && formik.errors.description}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="dueDate"
                  label="Due Date"
                  type="date"
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  helperText={formik.touched.dueDate && formik.errors.dueDate}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="status"
                  label="Status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  select
                  helperText={formik.touched.status && formik.errors.status}
                >
                  {['paid', 'pending', 'overdue'].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="method"
                  label="Method"
                  value={formik.values.method}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  fullWidth
                  select
                  helperText={formik.touched.method && formik.errors.method}
                >
                  {['card', 'cash', 'bank', 'online'].map((methodOption) => (
                    <MenuItem key={methodOption} value={methodOption}>
                      {methodOption}
                    </MenuItem>
                  ))}
                </TextField>
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
