// We immediately check for ipcRenderer's availability and assign it or log a warning
const ipcRenderer = (() => {
  if (typeof window !== 'undefined') {
    if (typeof window.require !== 'function') return null;

    try {
      return window.require('electron').ipcRenderer;
    } catch (error) {
      console.warn('Failed to load ipcRenderer:', error);
      return null;
    }
  }
  return null;
})();

const IpcRenderer = {
  sendMessageToMainProcess(channel, message) {
    if (!ipcRenderer) {
      // console.warn('ipcRenderer is not available, running outside of Electron');
      return;
    }
    ipcRenderer.send(channel, message);
  },

  listenForMessagesFromMainProcess(channel, callback) {
    if (!ipcRenderer) {
      // console.warn('ipcRenderer is not available, running outside of Electron');
      return;
    }
    ipcRenderer.on(channel, (event, arg) => callback(arg));
  },
};

export default IpcRenderer;
