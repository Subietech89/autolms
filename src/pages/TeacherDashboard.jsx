import { useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Edit3 } from 'lucide-react';

export const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [progressMetrics, setProgressMetrics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherCourses = await pb.collection('courses').getFullList({
          filter: `teacher_id = "${pb.authStore.model.id}"`,
          sort: '-created'
        });
        setCourses(teacherCourses);

        const courseIds = teacherCourses.map(c => c.id).map(id => `course_id = "${id}"`).join(' || ');
        if (courseIds) {
          const metrics = await pb.collection('progress').getFullList({
            filter: courseIds,
            expand: 'user_id,course_id'
          });
          setProgressMetrics(metrics);
        }
      } catch (err) {
        console.error("Error fetching teacher data", err);
      }
    };
    fetchData();
  }, []);

  const getCompletionRate = (courseId) => {
    const related = progressMetrics.filter(p => p.course_id === courseId);
    if (related.length === 0) return 0;
    const completed = related.filter(p => p.status === 'completed').length;
    return Math.round((completed / related.length) * 100);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Instructor Dashboard</h1>
        <p className="text-gray-500 mt-2 text-lg">Manage your training modules and monitor technician progress.</p>
      </header>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center space-x-3 text-gray-900 dark:text-white">
            <BookOpen size={28} className="text-blue-500" />
            <span>Your Authored Courses</span>
          </h2>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-sm">
            + New Course
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {courses.map((course) => {
            const isLocked = new Date() > new Date(course.edit_until);
            return (
              <div key={course.id} className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{course.title}</h3>
                  {isLocked && (
                    <span className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-xs font-black px-3 py-1.5 rounded-lg tracking-wide shrink-0 ml-4">
                      EDIT LOCKED
                    </span>
                  )}
                </div>
                
                <div className="mb-8 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="text-sm font-medium text-gray-500 mb-2">Completion Rate</div>
                    <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">{getCompletionRate(course.id)}%</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="text-sm font-medium text-gray-500 mb-2">Enrolled Techs</div>
                    <div className="text-3xl font-extrabold text-gray-900 dark:text-white">
                      {progressMetrics.filter(p => p.course_id === course.id).length}
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex justify-end">
                  <Link 
                    to={`/teacher/course/${course.id}/edit`}
                    className={`flex items-center space-x-2 px-8 py-3.5 rounded-xl font-bold transition-all ${
                      isLocked 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed dark:bg-gray-800 dark:text-gray-500 border border-transparent' 
                        : 'bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 shadow-sm'
                    }`}
                    onClick={(e) => isLocked && e.preventDefault()}
                  >
                    <Edit3 size={18} />
                    <span>{isLocked ? 'Locked (48h Expired)' : 'Edit Course'}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Technician Roster Overview */}
      <section>
        <h2 className="text-2xl font-bold mb-6 flex items-center space-x-3 text-gray-900 dark:text-white">
          <Users size={28} className="text-green-500" />
          <span>Technician Progress Overview</span>
        </h2>
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th className="p-6 font-bold text-gray-500 uppercase text-xs tracking-wider">Technician</th>
                  <th className="p-6 font-bold text-gray-500 uppercase text-xs tracking-wider">Course</th>
                  <th className="p-6 font-bold text-gray-500 uppercase text-xs tracking-wider">Status</th>
                  <th className="p-6 font-bold text-gray-500 uppercase text-xs tracking-wider">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {progressMetrics.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="p-6 font-medium text-gray-900 dark:text-white">{p.expand?.user_id?.email || 'Unknown'}</td>
                    <td className="p-6 text-gray-600 dark:text-gray-300 font-medium">{p.expand?.course_id?.title}</td>
                    <td className="p-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        p.status === 'completed' 
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-6 text-sm text-gray-500 font-medium">
                      {p.saved_state?.lastUpdated ? new Date(p.saved_state.lastUpdated).toLocaleDateString() : 'Never'}
                    </td>
                  </tr>
                ))}
                {progressMetrics.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-12 text-center text-gray-500 font-medium">No enrollment data available for your courses.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

