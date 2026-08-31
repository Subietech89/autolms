import { useEffect, useState } from 'react';
import { pb } from '../lib/pocketbase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Play, CheckCircle, FileText, Search, Download } from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const progressRecords = await pb.collection('progress').getFullList({
          filter: `user_id = "${user.id}"`,
          expand: 'course_id',
        });
        setCourses(progressRecords);

        const resourceRecords = await pb.collection('resources').getFullList({
          sort: '-created',
        });
        setResources(resourceRecords);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [user.id]);

  const filteredResources = resources.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-12">
      
      {/* XP & Badges Bar */}
      <section className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h2 className="text-lg font-medium text-gray-500 dark:text-gray-400 mb-1">Total Experience</h2>
          <div className="text-5xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">{user.xp_total} <span className="text-2xl text-blue-400/80">XP</span></div>
        </div>
        <div className="flex space-x-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center text-3xl shadow-inner border border-yellow-200 dark:border-yellow-800/50">🏅</div>
            <span className="text-xs font-medium mt-2 text-gray-600 dark:text-gray-400">Beginner</span>
          </div>
          {user.xp_total > 500 && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-3xl shadow-inner border border-purple-200 dark:border-purple-800/50">🚀</div>
              <span className="text-xs font-medium mt-2 text-gray-600 dark:text-gray-400">Advanced</span>
            </div>
          )}
        </div>
      </section>

      {/* Training Courses */}
      <section>
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Training Modules</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((record) => (
            <div key={record.id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white line-clamp-2">{record.expand?.course_id?.title || 'Unknown Course'}</h3>
              <div className="flex-grow">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mb-6 ${
                  record.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {record.status === 'completed' ? 'Completed' : 'In Progress'}
                </span>
              </div>
              <Link 
                to={`/student/course/${record.course_id}`}
                className="mt-auto flex items-center justify-center space-x-2 w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-xl font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
              >
                {record.status === 'completed' ? (
                  <><CheckCircle size={18} /><span>Review Module</span></>
                ) : (
                  <><Play size={18} fill="currentColor" /><span>{record.saved_state && Object.keys(record.saved_state).length > 0 ? 'Resume Module' : 'Start Module'}</span></>
                )}
              </Link>
            </div>
          ))}
          {courses.length === 0 && (
            <div className="col-span-full p-8 text-center bg-gray-50 dark:bg-gray-900/50 rounded-3xl border border-dashed border-gray-300 dark:border-gray-700 text-gray-500">
              No training modules currently assigned.
            </div>
          )}
        </div>
      </section>

      {/* PDF Resource Library */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Resource Library</h2>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search diagrams, manuals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 dark:bg-gray-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <div key={resource.id} className="group flex items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
              <div className="flex items-center space-x-4 min-w-0">
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl shrink-0">
                  <FileText size={24} />
                </div>
                <div className="min-w-0 truncate">
                  <h4 className="font-semibold text-gray-900 dark:text-white truncate">{resource.title}</h4>
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{resource.category}</span>
                </div>
              </div>
              <a 
                href={pb.files.getUrl(resource, resource.document)}
                download
                target="_blank"
                rel="noreferrer"
                className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors shrink-0 opacity-0 group-hover:opacity-100 focus:opacity-100"
                aria-label="Download resource"
              >
                <Download size={20} />
              </a>
            </div>
          ))}
          {filteredResources.length === 0 && <p className="text-gray-500 col-span-full">No resources match your search.</p>}
        </div>
      </section>
    </div>
  );
};

