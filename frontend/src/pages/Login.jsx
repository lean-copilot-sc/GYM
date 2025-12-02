import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../api/apiClient.js';
import { useAuth } from '../providers/AuthProvider.jsx';

const validationSchema = Yup.object({
  email: Yup.string().email('Enter a valid email').required('Email is required'),
  password: Yup.string().required('Password is required')
});

export default function LoginPage() {
  const navigate = useNavigate();
  const auth = useAuth();
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      setStatus(undefined);
      try {
        const { data } = await api.post('/auth/login', values);
        auth.login(data);
        navigate('/', { replace: true });
      } catch (err) {
        setStatus(err.response?.data?.message || 'Login failed');
      } finally {
        setSubmitting(false);
      }
    }
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 420, boxShadow: 6 }}>
        <CardContent>
          <Stack spacing={3} component="form" onSubmit={formik.handleSubmit}>
            <Box>
              <Typography variant="h5" gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Log in to manage physiotherapy and gym operations.
              </Typography>
            </Box>
            {formik.status && <Alert severity="error">{formik.status}</Alert>}
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              autoFocus
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button type="submit" variant="contained" disabled={formik.isSubmitting} size="large">
              {formik.isSubmitting ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
