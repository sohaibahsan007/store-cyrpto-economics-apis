/* eslint-disable @typescript-eslint/naming-convention */
import { Provider, inject } from "@loopback/core";
import { getService } from "@loopback/service-proxy";
import { CryptoPricesDataSource } from "../datasources";


  // base row service interface which helps providers to implement via datasource
  export interface CryptoPricesService {
    getCryptoPrices(): Promise<object>;
  }

  // baserow provider, which will let interact with datasource.
  export class CryptoPricesProvider
    implements Provider<CryptoPricesService> {
    constructor(
      // CryptoPricesDataSource must match the name property in the datasource json file
      @inject('datasources.CryptoPricesDataSource')
      protected dataSource: CryptoPricesDataSource = new CryptoPricesDataSource(),
    ) { }

    value(): Promise<CryptoPricesService> {
      return getService(this.dataSource);
    }
  }
