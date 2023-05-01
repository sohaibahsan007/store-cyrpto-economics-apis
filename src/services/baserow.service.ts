/* eslint-disable @typescript-eslint/naming-convention */
import { Provider, inject } from "@loopback/core";
import { getService } from "@loopback/service-proxy";
import { BaserowDataSource } from "../datasources";




  // Token Info Interface exported from Baserow Table
  export interface TokenInfo {
    count: number;
    next: string;
    previous?: null;
    results?: (ResultsEntity)[] | null;
  }
  export interface ResultsEntity {
    id: number;
    order: string;
    Token_ID: string;
    Token_Name: string;
    Token_Symbol: string;
    Token_Supply: number;
    Token_Type: string;
    Token_Price_Per_Bits: number;
    Token_Price_Per_USD: string;
  }




  // base row service interface which helps providers to implement via datasource
  export interface BaserowService {
    getTokenInfo(): Promise<TokenInfo>;
  }

  // baserow provider, which will let interact with datasource.
  export class BaserowProvider
    implements Provider<BaserowService> {
    constructor(
      // BaserowDataSource must match the name property in the datasource json file
      @inject('datasources.BaserowDataSource')
      protected dataSource: BaserowDataSource = new BaserowDataSource(),
    ) { }

    value(): Promise<BaserowService> {
      return getService(this.dataSource);
    }
  }
