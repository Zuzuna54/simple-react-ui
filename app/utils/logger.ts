// Logger utility with file names and colored output
// Simple colored console logging with minimal complexity

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  info: '\x1b[36m',    // cyan
  warn: '\x1b[33m',    // yellow
  error: '\x1b[31m',   // red
  debug: '\x1b[90m',   // gray
  file: '\x1b[35m',    // magenta
  timestamp: '\x1b[90m', // gray
};

function formatTimestamp(): string {
  return new Date().toISOString();
}

function formatMessage(level: LogLevel, file: string, message: string, data?: unknown): string {
  const timestamp = formatTimestamp();
  const levelColor = colors[level];
  const fileColor = colors.file;
  const timestampColor = colors.timestamp;
  const reset = colors.reset;
  
  let formattedMessage = `${timestampColor}${timestamp}${reset} ${levelColor}[${level.toUpperCase()}]${reset} ${fileColor}${file}${reset}: ${message}`;
  
  if (data !== undefined) {
    formattedMessage += ` ${JSON.stringify(data, null, 2)}`;
  }
  
  return formattedMessage;
}

export function createLogger(file: string) {
  return {
    info: (message: string, data?: unknown) => {
      console.log(formatMessage('info', file, message, data));
    },
    
    warn: (message: string, data?: unknown) => {
      console.warn(formatMessage('warn', file, message, data));
    },
    
    error: (message: string, data?: unknown) => {
      console.error(formatMessage('error', file, message, data));
    },
    
    debug: (message: string, data?: unknown) => {
      if (process.env.NODE_ENV === 'development') {
        console.log(formatMessage('debug', file, message, data));
      }
    },
  };
}

// Default logger for general use
export const logger = createLogger('app'); 