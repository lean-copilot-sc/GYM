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
  IconButton,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api/apiClient.js';
import { useAuth } from '../providers/AuthProvider.jsx';

const emptyExercise = {
  name: '',
  day: '',
  painScale: '',
  mobilityRange: '',
  instructions: '',
  do: '',
  dont: ''
};

export default function TherapyPlanPage() {
  const { memberId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({ title: '', notes: '', exercises: [emptyExercise] });

  useEffect(() => {
    const fetchPlan = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/therapy-plan/${memberId}`);
        if (data.plan) {
          setForm({
            title: data.plan.title || '',
            notes: data.plan.notes || '',
            exercises: (data.plan.exercises || []).map((exercise) => ({
              name: exercise.name || '',
              day: exercise.day || '',
              painScale: exercise.painScale ?? '',
              mobilityRange: exercise.mobilityRange || '',
              instructions: exercise.instructions || '',
              do: (exercise.do || []).join(', '),
              dont: (exercise.dont || []).join(', ')
            }))
          });
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setError(err.response?.data?.message || 'Unable to load plan');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'physio' || user?.role === 'admin') {
      fetchPlan();
    }
  }, [memberId, user]);

  const handleExerciseChange = (index, field, value) => {
    setForm((prev) => {
      const exercises = [...prev.exercises];
      exercises[index] = { ...exercises[index], [field]: value };
      return { ...prev, exercises };
    });
  };

  const handleAddExercise = () => {
    setForm((prev) => ({ ...prev, exercises: [...prev.exercises, emptyExercise] }));
  };

  const handleRemoveExercise = (index) => {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    try {
      const payload = {
        memberId,
        physioId: user.id,
        title: form.title,
        notes: form.notes,
        exercises: form.exercises.map((exercise) => ({
          name: exercise.name,
          day: exercise.day,
          painScale: exercise.painScale ? Number(exercise.painScale) : null,
          mobilityRange: exercise.mobilityRange || null,
          instructions: exercise.instructions || null,
          do: exercise.do ? exercise.do.split(',').map((item) => item.trim()).filter(Boolean) : [],
          dont: exercise.dont ? exercise.dont.split(',').map((item) => item.trim()).filter(Boolean) : []
        }))
      };
      await api.post('/therapy-plan', payload);
      setSuccess('Therapy plan saved');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save plan');
    }
  };

  if (user?.role !== 'physio' && user?.role !== 'admin') {
    return <Alert severity="info">Only physiotherapists or admins can manage therapy plans.</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Therapy Plan</Typography>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
            <TextField
              label="Notes"
              value={form.notes}
              onChange={(event) => setForm((prev) => ({ ...prev, notes: event.target.value }))}
              multiline
              minRows={3}
            />
            <Typography variant="h6">Exercises</Typography>
            {form.exercises.map((exercise, index) => (
              <Card key={index} variant="outlined">
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Exercise Name"
                        value={exercise.name}
                        onChange={(event) => handleExerciseChange(index, 'name', event.target.value)}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        label="Day"
                        value={exercise.day}
                        onChange={(event) => handleExerciseChange(index, 'day', event.target.value)}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                      <TextField
                        label="Pain Scale"
                        value={exercise.painScale}
                        onChange={(event) => handleExerciseChange(index, 'painScale', event.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                      <TextField
                        label="Mobility Range"
                        value={exercise.mobilityRange}
                        onChange={(event) => handleExerciseChange(index, 'mobilityRange', event.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Instructions"
                        value={exercise.instructions}
                        onChange={(event) => handleExerciseChange(index, 'instructions', event.target.value)}
                        fullWidth
                        multiline
                        minRows={2}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Do"
                        value={exercise.do}
                        onChange={(event) => handleExerciseChange(index, 'do', event.target.value)}
                        fullWidth
                        helperText="Comma separated"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Don't"
                        value={exercise.dont}
                        onChange={(event) => handleExerciseChange(index, 'dont', event.target.value)}
                        fullWidth
                        helperText="Comma separated"
                      />
                    </Grid>
                    <Grid item xs={12} md={1} display="flex" alignItems="center" justifyContent="flex-end">
                      <IconButton onClick={() => handleRemoveExercise(index)} disabled={form.exercises.length === 1}>
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            <Button variant="outlined" onClick={handleAddExercise}>
              Add Exercise
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Box>
        <Button type="submit" variant="contained">
          Save Plan
        </Button>
      </Box>
    </Stack>
  );
}
