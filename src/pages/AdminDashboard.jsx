import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Settings, BookOpen, Palette, Puzzle, ShieldAlert, LayoutDashboard } from 'lucide-react';

export const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('branding');

  // Mock states for the UI settings
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [appName, setAppName] = useState('AutoLMS');

  const tabs = [
    { id: 'branding', label: 'Theme & Branding', icon: Palette },
    { id: 'courses', label: 'Course Management', icon: BookOpen },
    { id: 'widgets', label: 'Widget & Game Library', icon: Puzzle },
    { id: 'superadmin', label: 'Superadmin (PocketBase)', icon: ShieldAlert },
  ];

  return (
    <div className="flex h-[calc(100vh-73px)] bg-gray-50 dark:bg-gray-950">
      
      {/* Admin Sidebar */}
      <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center space-x-2">
            <LayoutDashboard size={16} />
            <span>App Administration</span>
          </h2>
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              if (tab.id === 'superadmin') {
                return (
                  <a 
                    key={tab.id}
                    href="/_/"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </a>
                );
              }

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Admin Main Content Area */}
      <main className="flex-grow p-8 overflow-y-auto">
        
        {/* BRANDING TAB */}
        {activeTab === 'branding' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Theme & Branding</h1>
              <p className="text-gray-500 mt-2">Customize the look and feel of the LMS for your technicians.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-8">
              <div>
                <label className="block text-sm font-bold mb-2">Application Name</label>
                <input 
                  type="text" 
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full max-w-md px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Primary Brand Color</label>
                <div className="flex items-center space-x-4">
                  <input 
                    type="color" 
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-16 h-16 rounded cursor-pointer border-0 p-0"
                  />
                  <span className="font-mono text-gray-500">{primaryColor}</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">This color will be applied to buttons, active states, and progress bars.</p>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Company Logo</label>
                <div className="w-full max-w-md border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 text-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer">
                  <Palette className="mx-auto text-gray-400 mb-3" size={32} />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Drag & Drop Logo Image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG, or SVG (Max 2MB)</p>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
                  Save Theme Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Course Management</h1>
                <p className="text-gray-500 mt-2">Global overview of all training modules across all instructors.</p>
              </div>
              <button className="bg-gray-900 text-white dark:bg-white dark:text-gray-900 px-6 py-2.5 rounded-xl font-bold">
                + Launch Visual Builder
              </button>
            </div>
            
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-16 border border-gray-100 dark:border-gray-800 shadow-sm text-center border-dashed">
              <BookOpen size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Visual Drag & Drop Editor</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                This space will house the visual editor where you can construct courses by dragging text blocks, videos, and interactive widgets onto a canvas.
              </p>
            </div>
          </div>
        )}

        {/* WIDGETS TAB */}
        {activeTab === 'widgets' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in duration-300">
             <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interactive Tools & Games</h1>
              <p className="text-gray-500 mt-2">Manage the HTML5/JS mini-games available to your instructors.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {/* Dummy Widget Tiles */}
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Puzzle size={24} />
                </div>
                <h4 className="font-bold text-lg mb-1">Circuit Diagnostic Sandbox</h4>
                <p className="text-sm text-gray-500">Allows students to connect virtual wires to solve electrical faults.</p>
              </div>
              
              <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm border-dashed flex flex-col items-center justify-center text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer min-h-[200px]">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 text-gray-400 rounded-full flex items-center justify-center mb-2">
                  +
                </div>
                <h4 className="font-bold">Upload New Widget</h4>
                <p className="text-xs text-gray-400 mt-1">Drop a .ZIP containing HTML/JS</p>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

