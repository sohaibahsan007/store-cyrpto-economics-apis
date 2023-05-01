import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import { environment } from '../environments';

const config = {
  name: 'Store_Crypto_Economics_API',
  connector: 'postgresql',
  url: environment.DB_URL,
  host: environment.DB_HOST,
  port: environment.DB_PORT,
  user: environment.DB_USER,
  password: environment.DB_PASSWORD,
  database: environment.DB_NAME,
  schema: 'Crypto_Economics'
};
// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class StoreCryptoEconomicsApiDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'Store_Crypto_Economics_API';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.Store_Crypto_Economics_API', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
