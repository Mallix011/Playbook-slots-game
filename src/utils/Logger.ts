export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export class Logger {
  private static logLevel: LogLevel = LogLevel.INFO;

  static setLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private static shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  static debug(message: string, ...data: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(`[DEBUG] ${message}`, ...data);
    }
  }

  static info(message: string, ...data: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(`[INFO] ${message}`, ...data);
    }
  }

  static warn(message: string, ...data: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN] ${message}`, ...data);
    }
  }

  static error(message: string, ...error: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`[ERROR] ${message}`, ...error);
    }
  }
}

export class GameError extends Error {
  constructor(
    message: string,
    public readonly context?: string,
    public readonly originalError?: Error,
  ) {
    super(message);
    this.name = "GameError";
  }
}
