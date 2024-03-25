const IpcRenderer = require('./IpcRenderer');

// This is the channel name that the main process listens for
const RENDERER_LOG_CHANNEL = 'renderer-log-channel';
class Logger {
  constructor() {
    this.ipcAvailable = false;
    console.log('Logger initializing', IpcRenderer);
    if (IpcRenderer) {
      this.ipcAvailable = true;
      console.log('Logger initialized with IPC connection');
    } else {
      console.warn('ipcRenderer not available. Logging events will not reach Electron.');
    }
  }

  log(type, value) {
    console.log('logger.log:', type, value);
    if (this.ipcAvailable) {
      const event = { [type]: value };
      IpcRenderer.default.sendMessageToMainProcess(RENDERER_LOG_CHANNEL, event);
    }
  }
}

module.exports = new Logger(); // Set the default log path here
