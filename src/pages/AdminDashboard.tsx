import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import AdminOverview from './admin/AdminOverview';
import TeacherManagement from './admin/TeacherManagement';
import StudentManagement from './admin/StudentManagement';
import FinancialManagement from './admin/FinancialManagement';
import AnnouncementBroadcaster from './admin/AnnouncementBroadcaster';

const AdminDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<AdminOverview />} />
        <Route path="teachers" element={<TeacherManagement />} />
        <Route path="students" element={<StudentManagement />} />
        <Route path="finance" element={<FinancialManagement />} />
        <Route path="announcements" element={<AnnouncementBroadcaster />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;
