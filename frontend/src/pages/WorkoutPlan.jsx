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

const emptyExercise = { name: '', sets: '', reps: '', weight: '', rest: '', day: '' };

export default function WorkoutPlanPage() {
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
        const { data } = await api.get(`/workout-plan/${memberId}`);
        if (data.plan) {
          setForm({
            title: data.plan.title || '',
            notes: data.plan.notes || '',
            exercises: (data.plan.exercises || []).map((exercise) => ({
              name: exercise.name || '',
              sets: exercise.sets ?? '',
              reps: exercise.reps ?? '',
              weight: exercise.weight ?? '',
              rest: exercise.rest ?? '',
              day: exercise.day || ''
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

    if (user?.role === 'trainer' || user?.role === 'admin') {
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
        trainerId: user.id,
        title: form.title,
        notes: form.notes,
        exercises: form.exercises.map((exercise) => ({
          ...exercise,
          sets: exercise.sets ? Number(exercise.sets) : null,
          reps: exercise.reps ? Number(exercise.reps) : null,
          weight: exercise.weight ? Number(exercise.weight) : null,
          rest: exercise.rest ? Number(exercise.rest) : null
        }))
      };
      await api.post('/workout-plan', payload);
      setSuccess('Workout plan saved');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save plan');
    }
  };

  if (user?.role !== 'trainer' && user?.role !== 'admin') {
    return <Alert severity="info">Only trainers or admins can manage workout plans.</Alert>;
  }

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Stack spacing={3} component="form" onSubmit={handleSubmit}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Workout Plan</Typography>
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
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        label="Exercise Name"
                        value={exercise.name}
                        onChange={(event) => handleExerciseChange(index, 'name', event.target.value)}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <TextField
                        label="Day"
                        value={exercise.day}
                        onChange={(event) => handleExerciseChange(index, 'day', event.target.value)}
                        required
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <TextField
                        label="Sets"
                        value={exercise.sets}
                        onChange={(event) => handleExerciseChange(index, 'sets', event.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <TextField
                        label="Reps"
                        value={exercise.reps}
                        onChange={(event) => handleExerciseChange(index, 'reps', event.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <TextField
                        label="Weight"
                        value={exercise.weight}
                        onChange={(event) => handleExerciseChange(index, 'weight', event.target.value)}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6} sm={3} md={2}>
                      <TextField
                        label="Rest (sec)"
                        value={exercise.rest}
                        onChange={(event) => handleExerciseChange(index, 'rest', event.target.value)}
                        fullWidth
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
