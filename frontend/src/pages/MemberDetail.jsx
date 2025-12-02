import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import api from '../api/apiClient.js';

export default function MemberDetailPage() {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get('/members');
        const found = (data.members || []).find((m) => m._id === memberId);
        setMember(found);
        setForm({
          membershipType: found?.membershipType || '',
          assignedTrainer: found?.assignedTrainer?._id || '',
          assignedPhysio: found?.assignedPhysio?._id || '',
          medicalConditions: (found?.medicalConditions || []).join(', '),
          renewalDate: found?.renewalDate ? found.renewalDate.substring(0, 10) : '',
          notes: found?.notes || ''
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load member');
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [memberId]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const payload = {
        membershipType: form.membershipType,
        assignedTrainer: form.assignedTrainer || null,
        assignedPhysio: form.assignedPhysio || null,
        medicalConditions: form.medicalConditions
          ? form.medicalConditions.split(',').map((item) => item.trim())
          : [],
        renewalDate: form.renewalDate || null,
        notes: form.notes
      };
      await api.put(`/members/${memberId}`, payload);
      setSuccess('Member updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update member');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (!member) {
    return <Alert severity="error">Member not found.</Alert>;
  }

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Member Details</Typography>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField label="Name" value={member.userId?.name || ''} fullWidth disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField label="Email" value={member.userId?.email || ''} fullWidth disabled />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="membershipType"
                label="Membership Type"
                value={form.membershipType}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="renewalDate"
                label="Renewal Date"
                type="date"
                value={form.renewalDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="assignedTrainer"
                label="Trainer User ID"
                value={form.assignedTrainer}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="assignedPhysio"
                label="Physio User ID"
                value={form.assignedPhysio}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="medicalConditions"
                label="Medical Conditions"
                value={form.medicalConditions}
                onChange={handleChange}
                fullWidth
                helperText="Comma separated"
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
                minRows={3}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Box>
        <Button type="submit" variant="contained" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </Box>
    </Stack>
  );
}
