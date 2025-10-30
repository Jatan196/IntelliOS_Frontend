import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { windowsPaths } from '../config/windowsConfig';
import WelcomeScreen from './WelcomeScreen';
import PermissionsScreen from './PermissionsScreen';
import InitialMonitoringScreen from './InitialMonitoringScreen';
import LiveMonitoringScreen from './LiveMonitoringScreen';
import InstallationProgressScreen from './InstallationProgressScreen';
import CompletionScreen from './CompletionScreen';
import ProgressIndicator from './ProgressIndicator';

const InstallerWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  
  const [preferences, setPreferences] = useState({
    installPath: windowsPaths.install,
    permissions: {},
    shortcuts: {
      startMenu: true,
      desktop: true,
      quickLaunch: false
    },
    settings: {
      cloudSync: false,
      githubConnect: false,
      notifications: true,
      autoBackup: false
    }
  });

  useEffect(() => {
    console.log('InstallerWizard mounted');
  }, []);

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  const handleLaunch = async () => {
    console.log('handleLaunch called');
    const api = window.electronAPI || window.electron;
    
    try {
      if (!api || !api.invoke) {
        throw new Error('Electron API not available');
      }

      // Launch the app
      const result = await api.invoke('launch-app', preferences);
      console.log('Launch result:', result);
      
      if (!result || !result.success) {
        throw new Error('Launch failed');
      }

      return true; // Return success
      
    } catch (error) {
      console.error('Failed to launch app:', error);
      throw error; // Propagate error to CompletionScreen
    }
  };

  const steps = [
    'Welcome',
    'Permissions',
    'Initial Monitoring',
    'Live Monitoring',
    'Installation',
    'Complete'
  ];

  const renderStep = () => {
    const stepProps = {
      onNext: handleNext,
      onBack: handleBack,
      preferences,
      setPreferences,
      onLaunch: handleLaunch
    };

    const stepComponents = [
      <WelcomeScreen key="welcome" {...stepProps} />,
      <PermissionsScreen key="permissions" {...stepProps} />,
      <InitialMonitoringScreen key="initial" {...stepProps} />,
      <LiveMonitoringScreen key="live" {...stepProps} />,
      <InstallationProgressScreen key="install" {...stepProps} />,
      <CompletionScreen key="complete" {...stepProps} />
    ];

    return stepComponents[currentStep];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <ProgressIndicator steps={steps} currentStep={currentStep} />
        <div className="bg-white rounded-xl shadow-lg p-8 step-transition">
          {renderStep()}
        </div>
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>IntelliOS Installer v1.0.0</p>
          <p>© 2025 IntelliOS</p>
        </div>
      </div>
    </div>
  );
};

export default InstallerWizard;