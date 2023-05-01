import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';
import { environment } from '../environments';

const baseUrl = `${environment.BASEROW_BASE_URL}/api/database/rows/table`;

const config = {
  name: 'BaserowDataSource',
  connector: 'rest',
  baseURL: baseUrl,
  crud: false,
  operations: [
    {
      template: {
        method: 'GET',
        url: baseUrl + `/${environment.BASEROW_TOKEN_INFO_TABLE}/?user_field_names=true`,
        headers: {
          authorization: `Token ${environment.BASEROW_TOKEN}`,
          'Content-Type': 'application/json'
        }
      },
      functions: {
        getTokenInfo: [],
      },
    }
  ],
};

// Observe application's life cycle to disconnect the datasource when
// application is stopped. This allows the application to be shut down
// gracefully. The `stop()` method is inherited from `juggler.DataSource`.
// Learn more at https://loopback.io/doc/en/lb4/Life-cycle.html
@lifeCycleObserver('datasource')
export class BaserowDataSource
  extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'BaserowDataSource';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.BaserowDataSource', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
