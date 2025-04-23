import { transports, createLogger, format } from 'winston';

const localLogsTransport = () => {
  return new transports.Console({
    format: format.combine(
      format.colorize({ level: true, message: true }),
      format.timestamp(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.printf(
        (values) =>
          `${values.timestamp}  [level]: ${values.level} [message]: ${
            values.message || values.stack
          }`,
      ),
    ),
  });
};

const remoteLogsTransport = () => {
  return new transports.File({
    filename: 'application_logs.log',
    format: format.combine(
      format.prettyPrint(),
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    ),
  });
};

const logTransport =
  process.env.NODE_ENV === 'localhost'
    ? localLogsTransport
    : remoteLogsTransport;

export default createLogger({
  transports: [logTransport()],
});
