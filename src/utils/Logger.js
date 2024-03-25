const IpcRenderer = require('./IpcRenderer');

// This is the channel name that the main Electron process listens for
const RENDERER_LOG_CHANNEL = 'renderer-log-channel';
class Logger {
  constructor() {
    this.ipcAvailable = false;

    this.EVENTS = {
      VIDEO_START: 'video-start',
      VIDEO_EXIT: 'video-exit',
      VIDEO_COMPLETED: 'video-completed',
      LANGUAGE_CHANGE: 'language-change',
    };

    if (IpcRenderer) {
      this.ipcAvailable = true;
      console.info('Logger initialized with IPC connection');
    } else {
      console.warn('ipcRenderer not available. Logging events will not reach Electron.');
    }
  }

  log(type, value) {
    console.info('logger.log:', type, value);
    if (this.ipcAvailable) {
      const event = { [type]: value };
      IpcRenderer.default.sendMessageToMainProcess(RENDERER_LOG_CHANNEL, event);
    }
  }
}

module.exports = new Logger();
