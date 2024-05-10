import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
import * as fs from "node:fs";

/**
 * Typeorm migration used for migration.
 */

const data: any = dotenv.parse(fs.readFileSync(`.env`));

export const config: DataSourceOptions = {
  type: 'postgres',
  host: data['POSTGRES_HOST'],
  port: data['POSTGRES_PORT'],
  username: data['POSTGRES_USER'],
  password: data['POSTGRES_PASSWORD'],
  database: data['POSTGRES_DB'],
  entities: ['dist/**/*.entity.js'],
  migrations: ['migration/*.ts'],
};

export default new DataSource(config);
