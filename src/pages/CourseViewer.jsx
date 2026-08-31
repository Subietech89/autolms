import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { pb } from '../lib/pocketbase';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, RotateCcw, ArrowLeft, Trophy } from 'lucide-react';

export const CourseViewer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [progressRecord, setProgressRecord] = useState(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const [showReentry, setShowReentry] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseData = await pb.collection('courses').getOne(id);
        const progressRecords = await pb.collection('progress').getFullList({
          filter: `user_id = "${user.id}" && course_id = "${id}"`
        });
        
        const prog = progressRecords[0];
        setCourse(courseData);
        setProgressRecord(prog);

        if (prog && prog.saved_state?.slideIndex !== undefined) {
          if (prog.saved_state.slideIndex > 0 && prog.status !== 'completed') {
            setShowReentry(true);
          }
          setCurrentSlideIndex(prog.saved_state.slideIndex);
        }
      } catch (err) {
        console.error("Failed to load course", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [id, user.id]);

  const saveProgress = async (newIndex, isComplete = false) => {
    if (!progressRecord) return;
    try {
      await pb.collection('progress').update(progressRecord.id, {
        saved_state: { slideIndex: newIndex, lastUpdated: new Date().toISOString() },
        status: isComplete ? 'completed' : 'in_progress'
      });
    } catch (err) {
      console.error("Silent save failed", err);
    }
  };

  const handleNext = () => {
    const slides = course.content_json?.slides || [];
    if (currentSlideIndex < slides.length - 1) {
      const nextIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIndex);
      saveProgress(nextIndex);
    } else {
      saveProgress(currentSlideIndex, true);
      setShowCelebration(true);
    }
  };

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to restart this course? All progress will be lost.")) {
      setCurrentSlideIndex(0);
      setShowReentry(false);
      setShowCelebration(false);
      await saveProgress(0, false);
    }
  };

  const handleWidgetWin = () => {
    handleNext();
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading course...</div>;
  if (!course) return <div className="p-8 text-center text-red-500">Course not found.</div>;

  const slides = course.content_json?.slides || [];
  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate('/student')} className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors active:scale-95">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-lg hidden sm:block text-gray-900 dark:text-white">{course.title}</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="bg-gray-100 dark:bg-gray-800 px-4 py-1.5 rounded-full">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-300">
              Slide {currentSlideIndex + 1} / {Math.max(1, slides.length)}
            </span>
          </div>
          <button 
            onClick={handleReset}
            className="flex items-center space-x-2 text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
          >
            <RotateCcw size={16} />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
        
        {/* Re-entry Summary Overlay */}
        {showReentry && (
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-20 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-10 max-w-lg w-full shadow-2xl text-center animate-in zoom-in-95 duration-200">
              <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Welcome Back!</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
                Last time, you were learning about: <strong className="text-gray-900 dark:text-white block mt-2 text-xl">{slides[currentSlideIndex - 1]?.concept_recap || 'the previous topic'}</strong>
                <br/><span className="text-sm mt-4 inline-block">Ready to pick up where you left off?</span>
              </p>
              <button 
                onClick={() => setShowReentry(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-colors shadow-md active:scale-95"
              >
                Resume Learning
              </button>
            </div>
          </div>
        )}

        {/* Celebration Overlay */}
        {showCelebration && (
          <div className="absolute inset-0 bg-blue-600/95 backdrop-blur-md z-30 flex items-center justify-center p-4 text-white text-center animate-in fade-in zoom-in duration-500">
            <div className="max-w-md w-full">
              <div className="inline-flex items-center justify-center w-32 h-32 bg-yellow-400 rounded-full mb-8 shadow-[0_0_60px_rgba(250,204,21,0.6)] transform hover:scale-110 transition-transform duration-300">
                <Trophy size={64} className="text-yellow-900" />
              </div>
              <h2 className="text-5xl font-extrabold mb-4 tracking-tight">Completed!</h2>
              <p className="text-2xl mb-10 text-blue-100 font-medium">+250 XP Earned</p>
              <button 
                onClick={() => navigate('/student')}
                className="w-full bg-white text-blue-600 font-bold py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-xl active:scale-95"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}

        {/* Slide Renderer */}
        <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 min-h-[65vh] flex flex-col overflow-hidden">
          <div className="p-8 sm:p-12 flex-grow overflow-y-auto">
            {currentSlide?.type === 'text' && (
              <div className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: currentSlide.content }} />
            )}
            
            {currentSlide?.type === 'interactive' && (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 p-8">
                <div className="text-center mb-10">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Interactive Diagnostic Module</h3>
                  <p className="text-gray-500 font-mono text-sm bg-gray-200 dark:bg-gray-800 px-4 py-2 rounded-lg inline-block">
                    [{currentSlide.widget} simulation running natively]
                  </p>
                </div>
                <button 
                  onClick={handleWidgetWin}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-10 rounded-2xl shadow-lg hover:shadow-green-500/30 transition-all active:scale-95 text-lg"
                >
                  Simulate "Win" State
                </button>
              </div>
            )}
            
            {!currentSlide && (
              <div className="flex items-center justify-center h-full text-gray-500">
                No content found for this slide.
              </div>
            )}
          </div>
          
          {/* Controls */}
          {currentSlide?.type !== 'interactive' && !showCelebration && (
            <div className="p-6 sm:px-12 sm:py-8 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-800 flex justify-end">
              <button 
                onClick={handleNext}
                className="flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl font-bold transition-all hover:shadow-lg active:scale-95 text-lg"
              >
                <span>{currentSlideIndex < slides.length - 1 ? 'Next Slide' : 'Complete Module'}</span>
                <ChevronRight size={24} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

