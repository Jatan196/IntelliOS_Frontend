const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let win; // make win global
console.log('App starting...');
function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, 'build/index.html')}`;

  win.loadURL(startURL);

  if (isDev) {
    win.webContents.openDevTools();
    
    // Add error logging
    win.webContents.on('console-message', (event, level, message, line, sourceId) => {
      console.log('Renderer Console:', message);
    });

    // Retry if React not loaded
    win.webContents.on('did-fail-load', () => {
      console.log('Retrying to load React app...');
      setTimeout(() => win.loadURL('http://localhost:3000'), 2000);
    });
  }

  // Handle window close **inside function**
  win.on('closed', () => {
    console.log('Window closed');
    win = null; // clean up reference
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// IPC Handlers
ipcMain.handle('launch-app', async (event, preferences) => {
  console.log('Launching app with preferences:', preferences);
  // Return success=true to indicate app should proceed to login
  return { success: true, shouldLogin: true };
});

// Handle navigation requests from renderer
ipcMain.handle('navigate-to', async (event, route) => {
  console.log('Navigation requested to:', route);
  if (win && !win.isDestroyed()) {
    // Use loadURL with hash for spa navigation
    const baseUrl = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'build/index.html')}`;
    await win.loadURL(`${baseUrl}#${route}`);
    return { success: true };
  }
  return { success: false, error: 'Window not available' };
});

ipcMain.handle('create-workspace', async (event, workspace) => {
  try {
    console.log('Creating workspace:', workspace);
    return { success: true, workspace };
  } catch (error) {
    console.error('Workspace creation failed:', error);
    return { success: false, error: error.message };
  }
});

// Add handlers for installation simulation and directory selection
ipcMain.handle('simulate-installation', async (event, step) => {
  console.log('Simulating installation step:', step);
  // Simulate some work being done
  await new Promise(resolve => setTimeout(resolve, 800));
  return { success: true, step };
});

ipcMain.handle('select-directory', async (event) => {
  const { dialog } = require('electron');
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.filePaths[0];
});
