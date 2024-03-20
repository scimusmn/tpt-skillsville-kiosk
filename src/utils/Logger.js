/**
 * Singleton sends logging events to the Electron main process via IPC.
 */

// This is the event name that the main process listens for
const RENDERER_LOG_EVENT = 'renderer-log-event';
class Logger {
  constructor() {
    this.ipcRenderer = null;
    this.ipcAvailable = false;

    if (typeof window !== 'undefined' && window && window.ipcRenderer) {
      this.ipcAvailable = true;
      this.ipcRenderer = window.ipcRenderer;
      console.log('Logger initialized with IPC connection');
    } else {
      console.warn('ipcRenderer is not available. Logging events will not be sent to the Electron main process.');
    }
  }

  log(type, value) {
    console.log('logger.log:', type, value);
    if (this.ipcAvailable) {
      const event = {
        type,
        value,
      };
      this.ipcRenderer.send(RENDERER_LOG_EVENT, event);
    }
  }
}

module.exports = new Logger(); // Set the default log path here
