// Add enhanced image tracking capabilities
class DebugLogger {
  constructor() {
    this.logs = [];
    this.interactions = [];
    this.performance = [];
    this.networkCalls = [];
    this.errors = [];
    this.qrCodes = [];
    this.images = [];
    this.memory = [];
    this.imageAttempts = new Map(); // Track load attempts per image
    this.imageStats = {
      totalAttempts: 0,
      successfulLoads: 0,
      failedLoads: 0,
      loadTimes: [],
    };
  }

  log(level, category, message, details = {}) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      id: `m${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
      timestamp,
      level,
      category,
      message,
      details
    };
    this.logs.push(logEntry);
    return logEntry;
  }

  debug(category, message, details = {}) {
    return this.log('debug', category, message, details);
  }

  info(category, message, details = {}) {
    return this.log('info', category, message, details);
  }

  warn(category, message, details = {}) {
    return this.log('warn', category, message, details);
  }

  error(category, message, details = {}) {
    return this.log('error', category, message, details);
  }

  trackImageLifecycle(imageUrl, stage, details = {}) {
    const timestamp = new Date().toISOString();
    const imageLog = {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url: imageUrl,
      stage,
      timestamp,
      ...details
    };

    // Track attempt statistics
    if (!this.imageAttempts.has(imageUrl)) {
      this.imageAttempts.set(imageUrl, {
        attempts: 0,
        successes: 0,
        failures: 0,
        firstAttempt: timestamp,
        lastAttempt: timestamp,
      });
    }

    const stats = this.imageAttempts.get(imageUrl);
    stats.attempts++;
    stats.lastAttempt = timestamp;

    if (stage === 'success') {
      stats.successes++;
      this.imageStats.successfulLoads++;
    } else if (stage === 'error') {
      stats.failures++;
      this.imageStats.failedLoads++;
    }

    this.imageStats.totalAttempts++;

    this.log('debug', 'Image', `Image ${stage}`, {
      imageLog,
      stats: {
        attempts: stats.attempts,
        successes: stats.successes,
        failures: stats.failures,
        timeSinceFirstAttempt: new Date(timestamp) - new Date(stats.firstAttempt),
      }
    });

    return imageLog;
  }

  getAllData() {
    return {
      logs: this.logs,
      interactions: this.interactions,
      performance: this.performance,
      networkCalls: this.networkCalls,
      errors: this.errors,
      qrCodes: this.qrCodes,
      images: this.images,
      memory: this.memory
    };
  }

  clear() {
    this.logs = [];
    this.interactions = [];
    this.performance = [];
    this.networkCalls = [];
    this.errors = [];
    this.qrCodes = [];
    this.images = [];
    this.memory = [];
    this.imageAttempts.clear();
    this.imageStats = {
      totalAttempts: 0,
      successfulLoads: 0,
      failedLoads: 0,
      loadTimes: [],
    };
  }
}

const debugLogger = new DebugLogger();

const imageLogger = {
  startLoad: (src, context = {}) => {
    return debugLogger.trackImageLifecycle(src, 'load_start', {
      context,
      componentInfo: {
        name: context.componentName,
        props: context.props,
        timestamp: new Date().toISOString()
      }
    });
  },

  success: (src, details = {}) => {
    return debugLogger.trackImageLifecycle(src, 'success', {
      ...details,
      loadTime: details.loadTime || 0,
      dimensions: details.dimensions || null,
      timestamp: new Date().toISOString()
    });
  },

  error: (src, error = {}, context = {}) => {
    return debugLogger.trackImageLifecycle(src, 'error', {
      error: error.message || 'Unknown error',
      stack: error.stack,
      context,
      timestamp: new Date().toISOString()
    });
  },

  debug: (message, details = {}) => {
    return debugLogger.debug('Image', message, details);
  },

  info: (message, details = {}) => {
    return debugLogger.info('Image', message, details);
  },

  warn: (message, details = {}) => {
    return debugLogger.warn('Image', message, details);
  }
};

const componentLogger = {
  debug: (message, details = {}) => debugLogger.debug('Component', message, details),
  error: (message, error, details = {}) => debugLogger.error('Component', message, { ...details, error })
};

const pdfLogger = {
  debug: (message, details = {}) => debugLogger.debug('PDF', message, details),
  info: (message, details = {}) => debugLogger.info('PDF', message, details),
  error: (message, details = {}) => debugLogger.error('PDF', message, details)
};

const contextLogger = {
  debug: (message, details = {}) => debugLogger.debug('Context', message, details),
  info: (message, details = {}) => debugLogger.info('Context', message, details),
  error: (message, details = {}) => debugLogger.error('Context', message, details),
  warn: (message, details = {}) => debugLogger.warn('Context', message, details)
};

export {
  debugLogger,
  imageLogger,
  componentLogger,
  pdfLogger,
  contextLogger
};