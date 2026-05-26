import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import TeacherOverview from './teacher/TeacherOverview';
import DailyAttendance from './teacher/DailyAttendance';
import DailyProgress from './teacher/DailyProgress';
import AbsenceRequest from './teacher/AbsenceRequest';

const TeacherDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<TeacherOverview />} />
        <Route path="attendance" element={<DailyAttendance />} />
        <Route path="progress" element={<DailyProgress />} />
        <Route path="absence" element={<AbsenceRequest />} />
      </Routes>
    </Layout>
  );
};

export default TeacherDashboard;
