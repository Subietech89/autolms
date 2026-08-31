import { useAuth } from '../context/AuthContext';
import { Moon, Sun, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Navigation = () => {
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (!user) return null;

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
      <div className="font-bold text-xl text-blue-600 dark:text-blue-400">AutoLMS</div>
      <div className="flex items-center space-x-6">
        <div className="text-sm">
          <span className="text-gray-500 dark:text-gray-400">Logged in as: </span>
          <span className="font-medium">{user.email} ({user.role})</span>
        </div>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button 
          onClick={logout}
          className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
        >
          <LogOut size={20} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  );
};

