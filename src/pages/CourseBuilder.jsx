import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pb } from '../lib/pocketbase';
import { ArrowLeft, Save, AlertTriangle } from 'lucide-react';

export const CourseBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [contentJson, setContentJson] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await pb.collection('courses').getOne(id);
        setCourse(data);
        setContentJson(JSON.stringify(data.content_json, null, 2));
        
        if (new Date() > new Date(data.edit_until)) {
          setIsLocked(true);
        }
      } catch (err) {
        console.error("Failed to load course", err);
      }
    };
    fetchCourse();
  }, [id]);

  const handleSave = async () => {
    if (isLocked) return;
    try {
      setSaving(true);
      const parsedContent = JSON.parse(contentJson);
      await pb.collection('courses').update(id, {
        content_json: parsedContent
      });
      alert('Course saved successfully.');
    } catch (err) {
      alert('Invalid JSON or save failed. Please check format.');
    } finally {
      setSaving(false);
    }
  };

  if (!course) return <div className="p-8 text-center text-gray-500">Loading builder...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <header className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate('/teacher')} className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="font-extrabold text-2xl text-gray-900 dark:text-white">{course.title} <span className="font-medium text-gray-400">/ Builder</span></h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Edit Window Closes: {new Date(course.edit_until).toLocaleString()}</p>
          </div>
        </div>
        
        {!isLocked && (
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all disabled:opacity-50 shadow-sm active:scale-95"
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : 'Save Content'}</span>
          </button>
        )}
      </header>

      {isLocked && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 p-6 rounded-3xl flex items-start space-x-5 shadow-sm">
          <AlertTriangle className="text-red-600 dark:text-red-500 shrink-0 mt-0.5" size={28} />
          <div>
            <h3 className="text-red-800 dark:text-red-400 font-bold text-xl mb-1">Editing Locked</h3>
            <p className="text-red-700 dark:text-red-300 font-medium">
              The 48-hour editing window for this course has expired. Modifications are disabled to preserve training compliance and record integrity.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 flex flex-col">
        <label className="block text-sm font-bold mb-4 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
          Native Course Content (JSON Payload)
        </label>
        <textarea 
          value={contentJson}
          onChange={(e) => setContentJson(e.target.value)}
          disabled={isLocked}
          className={`w-full h-[600px] font-mono text-sm p-6 rounded-2xl border-2 focus:ring-4 outline-none transition-all ${
            isLocked 
              ? 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 text-gray-400 cursor-not-allowed' 
              : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 focus:border-blue-500 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100'
          }`}
          spellCheck="false"
        />
        <div className="mt-6 flex items-start space-x-3 text-sm text-gray-500 font-medium">
          <div className="bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded text-xs font-bold uppercase shrink-0">Info</div>
          <p>
            Defines the slides and interactive modules. Expected format is <code>{`{ "slides": [{ "type": "text", "content": "..." }, { "type": "interactive", "widget": "circuit" }] }`}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

