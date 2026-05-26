import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentPortal from './pages/ParentPortal';
import { AuthProvider, useAuth } from './context/AuthContext';

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}`} />} />
      <Route path="/admin/*" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
      <Route path="/teacher/*" element={user?.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/login" />} />
      <Route path="/parent/*" element={user?.role === 'parent' ? <ParentPortal /> : <Navigate to="/login" />} />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-background text-white font-cairo" dir="rtl">
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
