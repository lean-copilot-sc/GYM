import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import LoginPage from './pages/Login.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import AttendancePage from './pages/Attendance.jsx';
import MembersPage from './pages/Members.jsx';
import MemberDetailPage from './pages/MemberDetail.jsx';
import WorkoutPlanPage from './pages/WorkoutPlan.jsx';
import TherapyPlanPage from './pages/TherapyPlan.jsx';
import AppointmentsPage from './pages/Appointments.jsx';
import PaymentsPage from './pages/Payments.jsx';
import ProgressPage from './pages/Progress.jsx';
import ProfilePage from './pages/Profile.jsx';
import { useAuth } from './providers/AuthProvider.jsx';

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        )}
      >
        <Route index element={<DashboardPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="members" element={<MembersPage />} />
        <Route path="members/:memberId" element={<MemberDetailPage />} />
        <Route path="plans/workout/:memberId" element={<WorkoutPlanPage />} />
        <Route path="plans/therapy/:memberId" element={<TherapyPlanPage />} />
        <Route path="appointments" element={<AppointmentsPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="progress" element={<ProgressPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? '/' : '/login'} replace />}
      />
    </Routes>
  );
}
