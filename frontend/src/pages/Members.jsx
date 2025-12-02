import { useEffect, useMemo, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/apiClient.js';
import { useAuth } from '../providers/AuthProvider.jsx';

const validationSchema = Yup.object({
  name: Yup.string().min(2, 'Name is too short').required('Name is required'),
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().min(6, 'Minimum 6 characters').required('Temporary password is required'),
  membershipType: Yup.string().required('Membership type is required'),
  assignedTrainer: Yup.string().nullable(),
  assignedPhysio: Yup.string().nullable(),
  medicalConditions: Yup.string().nullable()
});

export default function MembersPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const loadMembers = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/members');
      setMembers(data.members || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'trainer' || user?.role === 'physio') {
      loadMembers();
    }
  }, [user]);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      membershipType: '',
      assignedTrainer: '',
      assignedPhysio: '',
      medicalConditions: ''
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      setSaving(true);
      setStatus(undefined);
      try {
        const payload = {
          ...values,
          medicalConditions: values.medicalConditions
            ? values.medicalConditions.split(',').map((item) => item.trim()).filter(Boolean)
            : []
        };
        if (!payload.assignedTrainer) delete payload.assignedTrainer;
        if (!payload.assignedPhysio) delete payload.assignedPhysio;
        await api.post('/members', payload);
        resetForm();
        setOpenDialog(false);
        await loadMembers();
      } catch (err) {
        const message = err.response?.data?.message || 'Unable to create member';
        setStatus(message);
      } finally {
        setSubmitting(false);
        setSaving(false);
      }
    }
  });

  const dialogContent = useMemo(
    () => (
      <Box component="form" onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                required
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email"
                type="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                required
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="password"
                label="Temporary Password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                required
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="membershipType"
                label="Membership Type"
                value={formik.values.membershipType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                required
                error={formik.touched.membershipType && Boolean(formik.errors.membershipType)}
                helperText={formik.touched.membershipType && formik.errors.membershipType}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="assignedTrainer"
                label="Trainer User ID"
                value={formik.values.assignedTrainer}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                helperText={formik.touched.assignedTrainer && formik.errors.assignedTrainer}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                name="assignedPhysio"
                label="Physio User ID"
                value={formik.values.assignedPhysio}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                helperText={formik.touched.assignedPhysio && formik.errors.assignedPhysio}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="medicalConditions"
                label="Medical Conditions"
                value={formik.values.medicalConditions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                fullWidth
                helperText={
                  formik.touched.medicalConditions && formik.errors.medicalConditions
                    ? formik.errors.medicalConditions
                    : 'Comma separated'
                }
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              formik.resetForm();
              formik.setStatus(undefined);
            }}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={formik.isSubmitting || saving}>
            {formik.isSubmitting || saving ? 'Saving…' : 'Save'}
          </Button>
        </DialogActions>
      </Box>
    ),
    [formik, saving]
  );

  if (user?.role !== 'admin' && user?.role !== 'trainer' && user?.role !== 'physio') {
    return <Alert severity="info">Only staff members can view member listings.</Alert>;
  }

  return (
    <Stack spacing={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={2}
      >
        <Typography variant="h4" sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}>
          Members
        </Typography>
        <Button
          variant="contained"
          onClick={() => {
            formik.resetForm();
            formik.setStatus(undefined);
            setOpenDialog(true);
          }}
        >
          New Member
        </Button>
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
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Membership</TableCell>
                  <TableCell>Trainer</TableCell>
                  <TableCell>Physio</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>{member.userId?.name}</TableCell>
                    <TableCell>{member.userId?.email}</TableCell>
                    <TableCell>{member.membershipType}</TableCell>
                    <TableCell>{member.assignedTrainer?.name || '-'}</TableCell>
                    <TableCell>{member.assignedPhysio?.name || '-'}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" onClick={() => navigate(`/members/${member._id}`)}>
                          View
                        </Button>
                        <Button size="small" onClick={() => navigate(`/plans/workout/${member._id}`)}>
                          Workout Plan
                        </Button>
                        <Button size="small" onClick={() => navigate(`/plans/therapy/${member._id}`)}>
                          Therapy Plan
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {!members.length && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Typography variant="body2" color="text.secondary">
                        No members found.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          formik.resetForm();
          formik.setStatus(undefined);
        }}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>New Member</DialogTitle>
        {formik.status && <Alert severity="error" sx={{ mx: 3 }}>{formik.status}</Alert>}
        {dialogContent}
      </Dialog>
    </Stack>
  );
}
