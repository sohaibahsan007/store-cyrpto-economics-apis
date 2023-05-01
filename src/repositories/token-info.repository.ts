import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {StoreCryptoEconomicsApiDataSource} from '../datasources';
import {TokenInfo, TokenInfoRelations} from '../models';

export class TokenInfoRepository extends DefaultCrudRepository<
  TokenInfo,
  typeof TokenInfo.prototype.id,
  TokenInfoRelations
> {
  constructor(
    @inject('datasources.Store_Crypto_Economics_API') dataSource: StoreCryptoEconomicsApiDataSource,
  ) {
    super(TokenInfo, dataSource);
  }
}
