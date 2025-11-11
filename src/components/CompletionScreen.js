import React, { useState, useEffect } from 'react';

const CompletionScreen = ({ preferences, onLaunch }) => {
  const [installationSuccess] = useState(Math.random() > 0.1); // 90% success rate for demo
  const [showLaunchAnimation, setShowLaunchAnimation] = useState(false);
  const [launchError, setLaunchError] = useState(null);
  
  useEffect(() => {
    console.log('CompletionScreen mounted with preferences:', preferences);
  }, [preferences]);

  const handleLaunchClick = async () => {
    // Prevent multiple clicks
    if (showLaunchAnimation) return;
    
    console.log('Launch button clicked');
    setShowLaunchAnimation(true);
    setLaunchError(null);
    
    try {
      console.log('Calling onLaunch');
      await onLaunch();
      // Force navigation after successful launch
      window.location.href = '#/login';
    } catch (error) {
      console.error('Launch failed:', error);
      setLaunchError('Failed to launch application. Please try again.');
      setShowLaunchAnimation(false);
    }
  };

  const getFeatureStatus = (key) => {
    return preferences[key] ? 'Enabled' : 'Disabled';
  };

  const getFeatureColor = (key) => {
    return preferences[key] ? 'text-green-600' : 'text-gray-500';
  };

  return (
    <div className="animate-fade-in text-center">
      <div className="mb-8">
        <div className={`w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center ${
          installationSuccess ? 'bg-green-100' : 'bg-red-100'
        } ${showLaunchAnimation ? 'animate-bounce' : ''}`}>
          <span className="text-3xl">
            {installationSuccess ? '✅' : '❌'}
          </span>
        </div>
        <h2 className={`text-3xl font-bold mb-2 ${
          installationSuccess ? 'text-green-800' : 'text-red-800'
        }`}>
          {installationSuccess ? 'Installation Successful!' : 'Installation Failed'}
        </h2>
        <p className={`text-lg mb-6 ${
          installationSuccess ? 'text-green-600' : 'text-red-600'
        }`}>
          {installationSuccess 
            ? 'MyApp ML Monitoring has been successfully installed on your system.'
            : 'There was an error during installation. Please try again.'
          }
        </p>
      </div>

      {installationSuccess ? (
        <div className="space-y-6">
          {/* Installation Summary */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center justify-center space-x-2">
              <span>📋</span>
              <span>Installation Summary</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-sm">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-700 font-medium">Installation Path:</span>
                  <span className="text-green-600 font-mono text-xs">
                    {preferences.installPath || 'C:\\Program Files\\MyApp'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 font-medium">Cloud Sync:</span>
                  <span className={getFeatureColor('cloudSync')}>
                    {getFeatureStatus('cloudSync')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 font-medium">GitHub Integration:</span>
                  <span className={getFeatureColor('githubConnect')}>
                    {getFeatureStatus('githubConnect')}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-700 font-medium">Notifications:</span>
                  <span className={getFeatureColor('notifications')}>
                    {getFeatureStatus('notifications')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 font-medium">Auto Backup:</span>
                  <span className={getFeatureColor('autoBackup')}>
                    {getFeatureStatus('autoBackup')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700 font-medium">Installation Size:</span>
                  <span className="text-green-600">847 MB</span>
                </div>
              </div>
            </div>
          </div>

          {/* What's Next Section */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center justify-center space-x-2">
              <span>🚀</span>
              <span>What's Next?</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left text-sm text-blue-700">
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>ML monitoring is now active and learning your system patterns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Background services are running and collecting data</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Access the dashboard to view real-time analytics</span>
                </li>
              </ul>
              <ul className="space-y-2">
                {preferences.cloudSync && (
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>Cloud synchronization will begin shortly</span>
                  </li>
                )}
                {preferences.githubConnect && (
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>GitHub integration setup will continue in the app</span>
                  </li>
                )}
                <li className="flex items-start space-x-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>System will be monitored 24/7 with intelligent alerts</span>
                </li>
              </ul>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center justify-center space-x-2">
              <span>📊</span>
              <span>System Status</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="text-center">
                <div className="w-8 h-8 bg-green-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div className="text-purple-700">ML Engine</div>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full mx-auto mb-1 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                <div className="text-purple-700">Monitoring</div>
              </div>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                  preferences.cloudSync ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  <span className="text-white text-xs">
                    {preferences.cloudSync ? '✓' : '○'}
                  </span>
                </div>
                <div className="text-purple-700">Cloud Sync</div>
              </div>
              <div className="text-center">
                <div className={`w-8 h-8 rounded-full mx-auto mb-1 flex items-center justify-center ${
                  preferences.notifications ? 'bg-green-500' : 'bg-gray-400'
                }`}>
                  <span className="text-white text-xs">
                    {preferences.notifications ? '✓' : '○'}
                  </span>
                </div>
                <div className="text-purple-700">Alerts</div>
              </div>
            </div>
          </div>

          {/* Launch Button */}
          <div className="pt-4">
            <button
              onClick={handleLaunchClick}
              disabled={showLaunchAnimation}
              className={`bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-10 py-4 rounded-lg font-medium transition-all duration-200 text-lg shadow-lg hover:shadow-xl ${
                showLaunchAnimation 
                  ? 'transform scale-110 animate-pulse cursor-wait' 
                  : 'transform hover:scale-105'
              }`}
            >
              {showLaunchAnimation ? (
                <span className="flex items-center space-x-2">
                  <span className="animate-spin">⚡</span>
                  <span>Launching...</span>
                </span>
              ) : (
                <span className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Launch Application</span>
                </span>
              )}
            </button>
          </div>
        </div>
      ) : (
        // Failure State
        <div className="space-y-6">
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Error Details</h3>
            <p className="text-sm text-red-700 text-left mb-4">
              The installation process encountered an unexpected error. This could be due to:
            </p>
            <ul className="text-left text-sm text-red-700 space-y-1 ml-4">
              <li>• Insufficient system permissions</li>
              <li>• Antivirus software interference</li>
              <li>• Disk space limitations (requires 2GB free)</li>
              <li>• Network connectivity issues</li>
              <li>• Conflicting software installations</li>
            </ul>
          </div>

          {/* Troubleshooting Steps */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="text-sm font-semibold text-yellow-800 mb-2">Troubleshooting Steps:</h4>
            <ul className="text-xs text-yellow-700 space-y-1 ml-4">
              <li>1. Run installer as Administrator</li>
              <li>2. Temporarily disable antivirus software</li>
              <li>3. Free up at least 2GB of disk space</li>
              <li>4. Check internet connection</li>
              <li>5. Contact support if issue persists</li>
            </ul>
          </div>
          
          <div className="flex space-x-4 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => window.close()}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              ❌ Exit Installer
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-400 border-t pt-4">
        <p>Installation completed at {new Date().toLocaleString()}</p>
        <p>MyApp ML Monitoring v1.0.0 © 2024</p>
      </div>
    </div>
  );
};

export default CompletionScreen;