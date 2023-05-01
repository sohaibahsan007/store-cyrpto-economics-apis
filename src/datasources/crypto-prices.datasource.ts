import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import { environment } from '../environments';

const baseUrl = `${environment.COINGECKO_BASE_URL}`;

const config = {
  name: 'CryptoPricesDataSource',
  connector: 'rest',
  baseURL: baseUrl,
  crud: false,
  operations: [
    {
      template: {
        method: 'GET',
        url: baseUrl + `/simple/price?ids=bitcoin,ethereum&vs_currencies=usd`,
        headers: {
          'Content-Type': 'application/json'
        }
      },
      functions: {
        getCryptoPrices: [],
      },
    }
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class CryptoPricesDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'CryptoPricesDataSource';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.CryptoPricesDataSource', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
