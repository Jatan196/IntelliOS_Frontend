import React, { useState, useEffect } from 'react';
import { Settings, Cloud, Github, Bell, Database } from 'lucide-react';

const ChangeCustomizePreferences = () => {
  const [preferences, setPreferences] = useState({
    cloudSync: false,
    githubConnected: false,
    notifications: true,
    autoBackup: false
  });

  useEffect(() => {
    // Get initial preferences
    if (window.electron) {
      window.electron.ipcRenderer.invoke('get-preferences').then(savedPrefs => {
        if (savedPrefs) {
          setPreferences(savedPrefs);
        }
      });
    }
  }, []);

  const handleSavePreferences = () => {
    if (window.electron) {
      window.electron.ipcRenderer.send('save-preferences', preferences);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-2xl mx-auto bg-slate-800 rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Settings className="w-6 h-6 text-purple-400" />
          <h2 className="text-2xl font-bold">Customize Preferences</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Cloud className="w-5 h-5 text-blue-400" />
              <span>Cloud Sync</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.cloudSync}
                onChange={(e) => setPreferences({...preferences, cloudSync: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Github className="w-5 h-5 text-gray-400" />
              <span>GitHub Integration</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.githubConnected}
                onChange={(e) => setPreferences({...preferences, githubConnected: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-yellow-400" />
              <span>Notifications</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.notifications}
                onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
            <div className="flex items-center space-x-3">
              <Database className="w-5 h-5 text-green-400" />
              <span>Auto Backup</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.autoBackup}
                onChange={(e) => setPreferences({...preferences, autoBackup: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer-checked:after:translate-x-full peer-checked:bg-purple-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

export default ChangeCustomizePreferences;