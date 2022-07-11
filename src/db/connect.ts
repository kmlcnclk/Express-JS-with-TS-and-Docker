import mongoose from 'mongoose';
import log from '../logger';

function connect() {
  //@ts-ignore
  const dbUri = process.env.DB_URI as string;

  return mongoose
    .connect(dbUri, {
      //@ts-ignore
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => log.info('Database connected'))
    .catch((error: any) => {
      log.error('DB Error: ', error.message);
      process.exit(1);
    });
}

export default connect;
