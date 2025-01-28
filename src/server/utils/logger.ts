import { createLogger, format, transports } from "winston";
import { type TransformableInfo } from "logform";

const { combine, timestamp, printf, colorize } = format;

export interface LoggerConfig {
  level: string;
  message: string;
  timestamp: string;
}

// Define a custom log format
const logFormat = printf((info: TransformableInfo): string => {
  const { level, message, timestamp } = info;
  return `[${timestamp}] ${level}: ${message}`;
});

// Create the logger instance
export const logger = createLogger({
  level: "[INFO]", // Default log level
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Add timestamp to logs
    colorize(), // Add colors for console logs
    logFormat, // Use the custom format
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: "logs/nlp-service.log" }), // Log to file
  ],
});
