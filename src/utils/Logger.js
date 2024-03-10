/**
 * Singleton that sends logging events to the Electron main process via IPC.
 */

// TODO - add event logging (outside this file) for:
// - language selection
// - video selection
// - video completion
// - video exit

class Logger {
  constructor(logPath) {
    this.ipcRenderer = null;
    this.ipcAvailable = false;
    this.logPath = logPath || '';

    if (window.ipcRef) {
      this.ipcAvailable = true;
      this.ipcRenderer = window.ipcRef;
      console.log('Logger initialized with IPC connection');
    } else {
      console.warn('ipcRef is not available. Logging events will not be sent to the Electron main process.');
    }
  }

  log(eventType, eventValue) {
    console.log('log:', eventType, eventValue);
    if (this.ipcAvailable) {
      this.ipcRenderer.send('RENDERER_LOG_EVENT', this.logPath, eventType, eventValue);
    }
  }
}

// Relative to operating system's user directory
const RENDERER_LOGGING_PATH = '/skillsville-logs/';

module.exports = new Logger(RENDERER_LOGGING_PATH); // Set the default log path here
