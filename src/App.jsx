import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navigation } from './components/Navigation';

import { Login } from './pages/Login';
import { StudentDashboard } from './pages/StudentDashboard';
import { CourseViewer } from './pages/CourseViewer';
import { TeacherDashboard } from './pages/TeacherDashboard';
import { CourseBuilder } from './pages/CourseBuilder';

import { AdminDashboard } from './pages/AdminDashboard';

const RoleBasedRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'admin') return <Navigate to="/admin" replace />;
  if (user.role === 'teacher') return <Navigate to="/teacher" replace />;
  return <Navigate to="/student" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200 flex flex-col w-full">
          <Navigation />
          <div className="flex-grow">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<RoleBasedRedirect />} />

              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student" element={<StudentDashboard />} />
                <Route path="/student/course/:id" element={<CourseViewer />} />
              </Route>

              {/* Teacher Routes */}
              <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
                <Route path="/teacher" element={<TeacherDashboard />} />
                <Route path="/teacher/course/:id/edit" element={<CourseBuilder />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
