class Logger {
    private readonly levels = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      debug: console.debug,
      info: console.info,
      silly: console.log, // Map "silly" to console.log
    } as const;
  
    log(level: keyof typeof this.levels, ...args: any[]) {
      const timestamp = new Date().toISOString();
      const logMessage = `[${timestamp}] [${level.toUpperCase()}]`;
  
      // Call the appropriate logging function
      this.levels[level](logMessage, ...args);
    }
  
    warn(...args: any[]) {
      this.log("warn", ...args);
    }
  
    error(...args: any[]) {
      this.log("error", ...args);
    }

    debug(...args: any[]) {
      this.log("debug", ...args);
    }
  
    info(...args: any[]) {
      this.log("info", ...args);
    }
  
    silly(...args: any[]) {
      this.log("silly", ...args);
    }
  }
  
  // Exporting a singleton instance
  const logger = new Logger();
  export default logger;
  