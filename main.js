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
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const startURL = isDev
    ? 'http://localhost:3000'
    : `file://${path.join(__dirname, '../build/index.html')}`;

  win.loadURL(startURL);

  if (isDev) win.webContents.openDevTools();

  // Retry if React not loaded (development only)
  if (isDev) {
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
  return true;
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
