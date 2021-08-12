import colors from 'colors/safe';
import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, splat } = format;

const infoLogFormat = printf(({ message }) => {
  const date = `[${new Date().toLocaleTimeString()}]`;
  return `${colors.gray(date)}\t${message}`;
});

const warnLogFormat = printf(({ message }) => {
  const date = `[${new Date().toLocaleTimeString()}]`;
  return `${colors.gray(date)}\t🚨 ${colors.yellow(message)}`;
});

const errorLogFormat = printf(({ message }) => {
  const date = `[${new Date().toLocaleTimeString()}]`;
  return `${colors.red(date)}\t🔥 ${colors.red(message)}`;
});

export const logger = createLogger({
  transports: [
    new transports.Console({
      level: 'info',
      format: combine(
        format((info) => (info.level !== 'info' ? false : info))(),
        format.simple(),
        splat(),
        infoLogFormat
      )
    }),
    new transports.Console({
      level: 'error',
      format: combine(format.simple(), errorLogFormat)
    }),
    new transports.Console({
      level: 'warn',
      format: combine(
        format((info) => (info.level !== 'warn' ? false : info))(),
        format.simple(),
        warnLogFormat
      )
    }),
    new transports.File({
      level: 'info',
      format: combine(
        format((info) => (info.level !== 'error' ? false : info))(),
        format.simple(),
        timestamp(),
        format.json()
      ),
      filename: `${process.cwd()}/logs/output.log`
    }),
    new transports.File({
      level: 'error',
      format: combine(
        format((info) => (info.level !== 'error' ? false : info))(),
        format.simple(),
        timestamp(),
        format.json()
      ),
      filename: `${process.cwd()}/logs/output.log`
    }),
    new transports.File({
      level: 'debug',
      format: combine(
        format((info) => {
          return info.level !== 'debug' ? false : info;
        })(),
        format.simple(),
        timestamp(),
        format.json()
      ),
      filename: `${process.cwd()}/logs/output.log`
    })
  ]
});
