const { contextBridge, ipcRenderer } = require('electron')

const api = {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
  invoke: (channel, data) => ipcRenderer.invoke(channel, data),

  // Helper: select a directory via main process, with a safe fallback prompt in the renderer
  selectDirectory: async () => {
    try {
      // Ask main process to show native dialog
      const result = await ipcRenderer.invoke('select-directory')
      return result || null
    } catch (err) {
      // Fallback: prompt the user to type a path (renderer-only fallback)
      try {
        const fallback = window.prompt('Enter directory path', 'C:\\Program Files\\')
        return fallback || null
      } catch (e) {
        return null
      }
    }
  },

  // Helper: simulate installation step. Tries to call main process; otherwise resolves after a short delay.
  simulateInstallation: async (stepName) => {
    try {
      // If main process has a handler, invoke it
      const res = await ipcRenderer.invoke('simulate-installation', stepName)
      return res
    } catch (err) {
      // Fallback: simulate locally with a small delay
      console.warn('simulateInstallation: falling back to local simulation for step', stepName)
      await new Promise(resolve => setTimeout(resolve, 400 + Math.random() * 600))
      return { ok: true, step: stepName }
    }
  }
}

// Expose as both `electronAPI` (preferred) and `electron` (backwards compat)
contextBridge.exposeInMainWorld('electronAPI', api)
contextBridge.exposeInMainWorld('electron', api)