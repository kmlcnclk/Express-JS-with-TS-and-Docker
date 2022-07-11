// import logger from 'pino';
// import dayjs from 'dayjs';

// const log = logger({
//   base: {
//     pid: false,
//   },
//   transport: {
//     target: 'pino-pretty',
//     options: {
//       translateTime: 'SYS:dd-mm-yyyy HH:MM:ss',
//       ignore: 'pid,hostname',
//       colorize: true,
//     },
//   },
//   timestamp: () => `,"time":"${dayjs().format()}"`,
// });

// export default log;

import { format, createLogger, transports } from 'winston';
import dayjs from 'dayjs';
import _ from 'lodash';

const tsFormat = () => dayjs().format('DD/MM/YYYY HH:mm:ss');

const customFormat = format.combine(
  format.timestamp({ format: tsFormat }),
  format.colorize(),
  format.printf((info: any) => {
    return `[${info.timestamp}] - [${info.level}]: ${info.message}`;
  })
);

const logger = createLogger({
  level: 'info',
  format: customFormat,
  // defaultMeta: { service: 'user-service' },
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'warn.log', level: 'warn' }),
    new transports.File({ filename: 'info.log', level: 'info' }),
    new transports.Console({ format: customFormat }),
  ],
});

export default logger;
